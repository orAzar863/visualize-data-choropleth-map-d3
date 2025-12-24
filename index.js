

function App() {
    const [countyData, setCountyData] = React.useState(null);
    const [educationData, setEducationData] = React.useState(null);
    React.useEffect(() => {
        Promise.all([
            fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json").then(res => res.json()),
            fetch("https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json").then(res => res.json())
        ]).then(([counties, education]) => {
            setCountyData(counties);
            setEducationData(education);
        });
    }, []);

    return (
        <div className="choropleth-center">
            <h1 id="title">United States Educational Attainment</h1>
            <p id="description">
                Percentage of adults age 25 and older with a bachelor's degree or higher (2010-2014)
            </p>
            {countyData && educationData && (
                <ChoroplethMap countyData={countyData} educationData={educationData} />
            )}
        </div>
    );
}


function ChoroplethMap({ countyData, educationData }) {
    const width = 960, height = 600;
    // Color palette for the map
    const colorRange = ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"];
    // Memoize education values and min/max
    const eduValues = React.useMemo(() => educationData.map(d => d.bachelorsOrHigher), [educationData]);
    const minEdu = React.useMemo(() => Math.min(...eduValues), [eduValues]);
    const maxEdu = React.useMemo(() => Math.max(...eduValues), [eduValues]);
    // Memoize thresholds and color scale
    const thresholds = React.useMemo(() => d3.range(minEdu, maxEdu, (maxEdu - minEdu) / colorRange.length), [minEdu, maxEdu, colorRange.length]);
    const colorScale = React.useMemo(() => d3.scaleThreshold().domain(thresholds.slice(1)).range(colorRange), [thresholds, colorRange]);
    const legendWidth = 300;
    const legendHeight = 20;
    const legendRectWidth = legendWidth / colorRange.length;

    // Memoize counties conversion from TopoJSON to GeoJSON
    const counties = React.useMemo(() =>
        window.topojson ? window.topojson.feature(countyData, countyData.objects.counties).features : [],
        [countyData]
    );
    // Memoize FIPS map for fast lookup
    const eduMap = React.useMemo(() => {
        const map = {};
        educationData.forEach(d => { map[d.fips] = d; });
        return map;
    }, [educationData]);
    // Memoize D3 geoPath generator
    const path = React.useMemo(() => d3.geoPath(), []);

    // Tooltip state (only updates tooltip, not whole map)
    const [tooltip, setTooltip] = React.useState({ visible: false, x: 0, y: 0, county: '', state: '', education: 0, fips: 0 });

    // Memoized event handlers for mouse events
    const handleMouseOver = React.useCallback((e, d) => {
        const edu = eduMap[d.id];
        setTooltip({
            visible: true,
            x: e.clientX,
            y: e.clientY,
            county: edu ? edu.area_name : '',
            state: edu ? edu.state : '',
            education: edu ? edu.bachelorsOrHigher : 0,
            fips: d.id
        });
    }, [eduMap]);
    const handleMouseOut = React.useCallback(() => setTooltip(t => ({ ...t, visible: false })), []);

    // Only update highlight state for hovered county
    const [hoveredId, setHoveredId] = React.useState(null);

    // Memoize SVG county paths for performance
    const countyPaths = React.useMemo(() => counties.map((d) => {
        const edu = eduMap[d.id];
        return (
            <path
                key={d.id}
                d={path(d)}
                className="county"
                data-fips={d.id}
                data-education={edu ? edu.bachelorsOrHigher : 0}
                fill={edu ? colorScale(edu.bachelorsOrHigher) : '#ccc'}
                stroke="#fff"
                strokeWidth={0.2}
                onMouseOver={e => { handleMouseOver(e, d); setHoveredId(d.id); }}
                onMouseOut={e => { handleMouseOut(); setHoveredId(null); }}
                style={hoveredId === d.id ? { filter: 'brightness(1.2)' } : {}}
            />
        );
    }), [counties, eduMap, colorScale, path, handleMouseOver, handleMouseOut, hoveredId]);

    return (
        <div style={{ position: 'relative' }} className="choropleth-center">
            <svg width={width} height={height} className="choropleth-svg">
                <g>
                    {countyPaths}
                </g>
                <g id="legend" transform={`translate(${width / 2 - legendWidth / 2},${height - 60})`}>
                    {colorRange.map((color, i) => (
                        <rect
                            key={i}
                            x={i * legendRectWidth}
                            y={0}
                            width={legendRectWidth}
                            height={legendHeight}
                            fill={color}
                            stroke="#000"
                        />
                    ))}
                    {thresholds.map((t, i) => (
                        <text
                            key={i}
                            x={i * legendRectWidth}
                            y={legendHeight + 15}
                            fontSize="12"
                            textAnchor="middle"
                            fill="#222"
                        >
                            {t.toFixed(1)}%
                        </text>
                    ))}
                </g>
            </svg>
            {tooltip.visible && (
                <div
                    id="tooltip"
                    data-education={tooltip.education}
                    className="tooltip"
                    style={{ left: tooltip.x + 10, top: tooltip.y - 40 }}
                >
                    <div><strong>{tooltip.county}, {tooltip.state}</strong></div>
                    <div>{tooltip.education}% with Bachelor&apos;s or higher</div>
                </div>
            )}
        </div>
    );
}


ReactDOM.createRoot(document.getElementById("root")).render(<App />);



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

    //coloring scale
    const colorRange = ["#edf8fb", "#b2e2e2", "#66c2a4", "#2ca25f", "#006d2c"];
    const eduValues = educationData.map(d => d.bachelorsOrHigher);
    const minEdu = Math.min(...eduValues);
    const maxEdu = Math.max(...eduValues);

    //scales
    const thresholds = d3.range(minEdu, maxEdu, (maxEdu - minEdu) / colorRange.length);
    const colorScale = d3.scaleThreshold().domain(thresholds.slice(1)).range(colorRange);

    //tooltip state
    const [tooltip, setTooltip] = React.useState({ visible: false, x: 0, y: 0, county: '', state: '', education: 0, fips: 0 });

    //map FIPS to education
    const eduMap = React.useMemo(() => {
        const map = {};
        educationData.forEach(d => { map[d.fips] = d; });
        return map;
    }, [educationData]);

    //D3 geo setup
    const path = d3.geoPath();
    //TopoJSON: counties
    const counties = window.topojson ? window.topojson.feature(countyData, countyData.objects.counties).features : [];

    //mouseEvents
    const handleMouseOver = (e, d) => {
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
    };
    const handleMouseOut = () => setTooltip(t => ({ ...t, visible: false }));

    //THE LEGEND
    const legendWidth = 300;
    const legendHeight = 20;
    const legendRectWidth = legendWidth / colorRange.length;

    return (
        <div style={{ position: 'relative' }} className="choropleth-center">
            <svg width={width} height={height} className="choropleth-svg">
                <g>
                    {counties.map((d, i) => {
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
                                onMouseOver={e => handleMouseOver(e, d)}
                                onMouseOut={handleMouseOut}
                            />
                        );
                    })}
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


// TopoJSON CDN for React CDN use
if (!window.topojson) {
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/topojson-client@3/dist/topojson-client.min.js';
    script.onload = () => {
        ReactDOM.createRoot(document.getElementById("root")).render(<App />);
    };
    document.body.appendChild(script);
} else {
    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
}

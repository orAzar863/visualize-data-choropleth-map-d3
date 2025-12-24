# Choropleth Map - FreeCodeCamp D3 Project

This project is a US Choropleth Map built for the FreeCodeCamp Data Visualization Certification. It visualizes the percentage of adults age 25 and older with a bachelor's degree or higher by county, using D3.js, React, and TopoJSON.

## Features

- **Interactive US Map:**
  - Each county is colored based on education data.
  - Hovering over a county shows a tooltip with detailed info.
- **Legend:**
  - Shows the color scale and corresponding education percentage ranges.
- **Responsive and Centered Layout:**
  - All content is centered and styled for clarity.
- **Performance Optimizations:**
  - Uses React's `useMemo` and `useCallback` to avoid unnecessary recalculations and re-renders.

## Technologies Used

- **React (via CDN):** UI rendering and state management.
- **D3.js (via CDN):** Data-driven SVG rendering and color scales.
- **TopoJSON (via CDN):** Efficient geographic data encoding and conversion to GeoJSON.
- **FreeCodeCamp Datasets:**
  - [US County TopoJSON](https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json)
  - [US Education Data](https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/for_user_education.json)
- **CSS:** Custom styles for centering, tooltips, and map appearance.

## How It Works

1. **Data Loading:**
   - Fetches county shapes (TopoJSON) and education data (JSON) on load.
2. **Data Processing:**
   - Converts TopoJSON to GeoJSON for D3 rendering.
   - Maps FIPS codes to education data for fast lookup.
3. **Rendering:**
   - Uses D3's `geoPath` to convert GeoJSON features to SVG paths.
   - Colors each county based on education percentage using a threshold color scale.
   - Renders a legend and interactive tooltip.
4. **Performance:**
   - Memoizes heavy computations and event handlers for smooth interaction.

## How to Run

1. **Clone or Download the Repository.**
2. **Open `index.html` in your browser.**
   - Make sure you have an internet connection for the CDN scripts and data.
3. **Explore the Map!**
   - Hover over counties to see tooltips.
   - View the legend for color meaning.

## Project Structure

- `index.html` - Loads all scripts and contains the root div.
- `index.js` - Main React/D3 code for the map and logic.
- `styles.css` - Custom styles for layout and appearance.

## Notable Techniques & Decisions

- **React + D3 Integration:** Used React for UI and D3 for SVG and color scales.
- **TopoJSON:** Used for efficient map data and converted to GeoJSON for D3.
- **Performance:** Used React hooks (`useMemo`, `useCallback`) to optimize rendering.
- **No Build Step:** All libraries loaded via CDN for simplicity and easy deployment.
- **Accessibility:** Tooltip includes data attributes for FCC tests.

## Credits

- [FreeCodeCamp](https://www.freecodecamp.org/)
- [D3.js](https://d3js.org/)
- [TopoJSON](https://github.com/topojson/topojson)

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---


// Load data from datasets/videogames_wide.csv using d3.csv and then make visualizations
async function fetchData() {
  // Load wide dataset
  const wideData = await d3.csv("./data/videogames_wide.csv");
  wideData.forEach((d) => (d.Global_Sales = +d.Global_Sales)); // convert numeric fields

  // Load long dataset
  const longData = await d3.csv("./data/videogames_long.csv");
  longData.forEach((d) => (d.global_sales = +d.global_sales)); // convert numeric fields
  // Make sure column names match your Vega-Lite encoding (platform, sales_region, global_sales)

  return { wideData, longData };
}
window.addEventListener("DOMContentLoaded", () => {
  fetchData().then(async ({ wideData, longData }) => {
    /* ----- Create 4 Visual Explorations Using Vega-Lite ----- */
    // Visualization 1: global sales by genre and platform
    const chart1Spec = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .encode(
        vl.x().fieldN("Genre").title("Genre"),
        vl.y().fieldN("Platform").title("Platform"),
        vl
          .color()
          .fieldQ("Global_Sales")
          .aggregate("sum")
          .title("Total Global Sales"),
      )
      .title("Total Global Sales by Genre and Platform")
      .width("container")
      .height(400)
      .toSpec();
    render("#view1", chart1Spec);

    /* Vis1 Questions: What are the top 5 action games for X360 and PS3 by global sales? How much of NA_sales make up of those global sales? */
    // Vis 1 Analysis 1
    const view1Analysis1 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter("datum.Platform === 'PS3'"),
        vl.filter("datum.Genre === 'Action'"),
        vl
          .window([{ op: "rank", as: "rank" }])
          .sort([{ field: "Global_Sales", order: "descending" }]),
        vl.filter("datum.rank <= 5"),
      )
      .encode(
        vl.x().fieldQ("Global_Sales").title("Global Sales"),
        vl.y().fieldN("Name").sort("-x").title("Game"),
      )
      .title("Top 5 Action Games on PS3 by Global Sales")
      .width("container")
      .height(80)
      .toSpec();
    render("#view1Analysis1", view1Analysis1);

    // Vis 1 Analysis 2
    const view1Analysis2 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter("datum.Platform === 'X360'"),
        vl.filter("datum.Genre === 'Action'"),
        vl
          .window([{ op: "rank", as: "rank" }])
          .sort([{ field: "Global_Sales", order: "descending" }]),
        vl.filter("datum.rank <= 5"),
      )
      .encode(
        vl.x().fieldQ("Global_Sales").title("Global Sales"),
        vl.y().fieldN("Name").sort("-x").title("Game"),
      )
      .title("Top 5 Action Games on X360 by Global Sales")
      .width("container")
      .height(80)
      .toSpec();
    render("#view1Analysis2", view1Analysis2);

    // Vis 1 Analysis 3
    const view1Analysis3 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter(
          "(datum.Name === 'Grand Theft Auto V' || datum.Name === 'Grand Theft Auto IV') && (datum.Platform === 'X360' || datum.Platform === 'PS3')",
        ),
      )
      .encode(
        vl.x().fieldN("Name").title("Game"),
        vl.y().fieldQ("Global_Sales").title("Global Sales"),
        vl.color().fieldN("Platform").title("Platform"),
        vl.tooltip([
          { field: "Name" },
          { field: "Platform" },
          { field: "Global_Sales", title: "Global Sales (millions)" },
        ]),
        vl.xOffset().fieldN("Platform"),
      )
      .title("Global Sales of GTA V and GTA IV on X360 and PS3")
      .width(200)
      .height(400)
      .toSpec();

    render("#view1Analysis3", view1Analysis3);

    // Visualization 2: Sales Over Time by Platform and Genre
    function renderChart(selectedGenre) {
      const chart2Spec = vl
        .markCircle({ tooltip: true })
        .data(
          wideData.filter(
            (row) =>
              row.Genre &&
              row.Genre.toLowerCase() === selectedGenre.toLowerCase() &&
              row.Year &&
              row.Year !== "N/A",
          ),
        )
        .encode(
          vl.y().fieldN("Platform").title("Platform"),
          vl.x().fieldO("Year").title("Year"),
          vl.size().fieldQ("Global_Sales").aggregate("sum"),
          vl
            .color()
            .fieldQ("Global_Sales")
            .aggregate("sum")
            .title("Global Sales"),
        )
        .title(`Sales Over Time by Platform for ${selectedGenre} Games`)
        .width("container")
        .height(400)
        .toSpec();

      render("#view2", chart2Spec);
    }

    const input = document.getElementById("genre-input");
    renderChart(input.value);
    input.addEventListener("input", () => {
      renderChart(input.value);
    });

    // Vis 2 Analysis 1
    const view2Analysis1 = vl
      .markCircle({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter(
          "(datum.Platform === 'X360' || datum.Platform === 'PS3') && (datum.Year >= 2008 && datum.Year <= 2013)",
        ),
      )
      .encode(
        vl.x().fieldQ("NA_Sales").title("North America Sales"),
        vl.y().fieldQ("Global_Sales").title("Global Sales"),
        vl.tooltip([
          { field: "Name", type: "nominal", title: "Game" },
          { field: "Platform", type: "nominal" },
          { field: "Year", type: "ordinal" },
          { field: "NA_Sales", type: "quantitative", title: "NA Sales" },
          {
            field: "Global_Sales",
            type: "quantitative",
            title: "Global Sales",
          },
        ]),
        vl.color().condition({
          test: "datum.Global_Sales - datum.NA_Sales > 4",
          value: "red",
        }),
      )
      .title("NA Sales vs Global Sales for X360 and PS3 Games (2008–2013)")
      .width("container")
      .height(400)
      .toSpec();
    render("#view2Analysis1", view2Analysis1);

    // Visualization 3: Regional Sales vs. Platform
    const chart3Spec = vl
      .markArea({ tooltip: true })
      .data(longData)
      .encode(
        vl.y().fieldQ("global_sales").aggregate("sum").title("Total Sales"),
        vl.x().fieldN("platform").title("Platform"),
        vl.color().fieldN("sales_region").title("Region Sales"),
      )
      .title("Sales Between Different Regions by Platform")
      .width("container")
      .height(400)
      .toSpec();
    render("#view3", chart3Spec);

    // Vis 3 Analysis 1
    const view3Analysis1 = vl
      .markCircle({ tooltip: true })
      .data(wideData)
      .transform(vl.filter("datum.Platform === 'PS2'"))
      .encode(
        vl.x().fieldQ("NA_Sales").title("North America Sales"),
        vl.y().fieldQ("EU_Sales").title("Europe Sales"),
        vl.size().fieldQ("Global_Sales").aggregate("sum").title("Global Sales"),
        vl.tooltip([
          { field: "Name", type: "nominal", title: "Game" },
          { field: "Platform", type: "nominal" },
          { field: "Year", type: "ordinal" },
          { field: "NA_Sales", type: "quantitative", title: "NA Sales" },
          { field: "EU_Sales", type: "quantitative", title: "EU Sales" },
          {
            field: "Global_Sales",
            type: "quantitative",
            title: "Global Sales",
          },
        ]),
        vl.color().condition({
          test: "datum.EU_Sales > datum.NA_Sales",
          value: "red", // highlight games that did better in EU
        }),
      )
      .title("NA Sales vs Europe Sales for PS2 Games")
      .width("container")
      .height(400)
      .toSpec();

    render("#view3Analysis1", view3Analysis1);

    // Visualization 4: Tell Us a Visual Story
    // Filter Electronic Arts games
    const electronicArtGames = wideData.filter((d) => {
      return (
        typeof d.Publisher === "string" && d.Publisher === "Electronic Arts"
      );
    });
    const chart4Spec = vl
      .markSquare({ tooltip: true })
      .data(electronicArtGames.filter((row) => row.Year !== "N/A"))
      .encode(
        vl.size().fieldQ("Global_Sales").aggregate("sum").title("Global Sales"),
        vl.x().fieldO("Year").title("Year"),
        vl.y().fieldN("Genre").title("Genre"),
        vl.color().fieldN("Genre").title("Genre"),
      )
      .title("Electronic Arts Sales by Genre")
      .width("container")
      .height(400)
      .toSpec();
    render("#view4", chart4Spec);

    // Filter Nintendo games
    const nintendoGames = wideData.filter((d) => {
      return typeof d.Publisher === "string" && d.Publisher === "Nintendo";
    });

    const chart4Spec2 = vl
      .markSquare({ tooltip: true })
      .data(nintendoGames.filter((row) => row.Year !== "N/A"))
      .encode(
        vl.size().fieldQ("Global_Sales").aggregate("sum").title("Global Sales"),
        vl.x().fieldO("Year").title("Year"),
        vl.y().fieldN("Genre").title("Genre"),
        vl.color().fieldN("Genre").title("Genre"),
      )
      .title("Nintendo Sales by Genre")
      .width("container")
      .height(400)
      .toSpec();
    render("#view4Nintendo", chart4Spec2);

    // Vis 3 Analysis 1
    const view4Analysis1 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter("datum.Publisher === 'Electronic Arts'"),
        vl.filter("datum.Genre === 'Sports'"),
        vl
          .window([{ op: "rank", as: "rank" }])
          .sort([{ field: "Global_Sales", order: "descending" }]),
        vl.filter("datum.rank <= 30"),
      )
      .encode(
        vl
          .x()
          .fieldQ("Global_Sales")
          .aggregate("average")
          .title("Average Global Sales"),
        vl.y().fieldN("Name").sort("-x").title("Game"),
      )
      .title("Average Sale of Top Selling Electronic Arts Sports Games")
      .width("container")
      .height(400)
      .toSpec();
    render("#view4Analysis1", view4Analysis1);

    const view4Analysis2 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter("datum.Publisher === 'Electronic Arts'"),
        vl.filter("datum.Genre === 'Sports'"),
        vl.filter("datum.Name && indexof(lower(datum.Name), 'nfl') >= 0"),
      )
      .encode(
        vl
          .x()
          .fieldQ("Global_Sales")
          .aggregate("sum")
          .title("Sum of NFL Global Sales"),
        vl.y().fieldN("Publisher"),
      )
      .title("NFL Games Global Sales")
      .width(400)
      .height(20)
      .toSpec();
    render("#view4Analysis2", view4Analysis2);

    const view4Analysis3 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter("datum.Publisher === 'Electronic Arts'"),
        vl.filter("datum.Genre === 'Sports'"),
        vl.filter("datum.Name && indexof(lower(datum.Name), 'fifa') >= 0"),
      )
      .encode(
        vl
          .x()
          .fieldQ("Global_Sales")
          .aggregate("sum")
          .title("Sum of FIFA Global Sales"),
        vl.y().fieldN("Publisher"),
      )
      .title("FIFA Games Global Sales")
      .width(400)
      .height(20)
      .toSpec();
    render("#view4Analysis3", view4Analysis3);

    const view4Analysis4 = vl
      .markBar({ tooltip: true })
      .data(wideData)
      .transform(
        vl.filter("datum.Publisher === 'Electronic Arts'"),
        vl.filter("datum.Genre === 'Sports'"),
        vl.filter(
          "datum.Name && (indexof(lower(datum.Name), 'nfl') >= 0 || indexof(lower(datum.Name), 'fifa') >= 0)",
        ),
      )
      .encode(
        vl
          .x()
          .fieldQ("Global_Sales")
          .aggregate("sum")
          .title("Sum of NFL and FIFA Sales"),
        vl.y().fieldN("Publisher"),
      )
      .title("NFL and FIFA Games Global Sales")
      .width(400)
      .height(20)
      .toSpec();
    render("#view4Analysis4", view4Analysis4);
  });
});
/* ----- end of 2. Create 4 Visual Explorations Using Vega-Lite ----- */

async function render(viewID, spec) {
  const result = await vegaEmbed(viewID, spec, {
    renderer: "canvas",
    autosize: {
      type: "fit",
      contains: "padding",
    },
    tooltip: true,
  });
  result.view.run();
}

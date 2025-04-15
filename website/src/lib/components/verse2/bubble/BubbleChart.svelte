<script lang="ts">
    import { scaleLinear } from "d3-scale";
    import points from "./verse2_data.json";
    import { select } from "d3-selection";
    import { onMount } from "svelte";
    import * as d3 from "d3";

    let data: {
        metro_area: string;
        median_housing_price: number;
        median_income: number;
        education_attainment: number;
        total_population: number;
        education_attainment_population: number;
    }[] = points;

    const width = 700;
    const height = 500;
    const padding = { top: 50, right: 100, bottom: 50, left: 70 };

    const xScale = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.median_housing_price))])
        .range([padding.left, width - padding.right - 50]);

    const yScale = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.median_income))])
        .range([height - padding.bottom, padding.top]);

    const rScale = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.total_population))])
        .range([0, 80]);

    const xTickValues = [0, 200000, 400000, 600000, 800000]; // Adjust for readability
    const xTicks = ["$0", "$200,000", "$400,000", "$600,000", "$800,000"];
    const yTicks = ["$0", "$50,000", "$100,000", "$150,000", "$200,000"];
    const yTickValues = [0, 50000, 100000, 150000, 200000];

    onMount(() => {
        const svg = select("#bubble-chart")
            .attr("width", width)
            .attr("height", height)
            .select("g#chart-content");

        const onCircleClick = () => {
            console.log("circle clicked");

            const pieGroups = svg.selectAll(".pie-group");

            // Check current display style
            const isVisible = pieGroups.style("display") !== "none";

            if (isVisible) {
                // Hide the pie groups
                pieGroups
                    .selectAll("path")
                    .transition()
                    .duration(500)
                    .attrTween("d", function (d) {
                        const radius = d3.select(this.parentNode).datum()
                            ? rScale(d3.select(this.parentNode).datum().total_population)
                            : 20;

                        const arc = d3.arc().innerRadius(0).outerRadius(radius);

                        const startAngle =
                            d.startAngle >= 0 ? d.startAngle : d.startAngle + 2 * Math.PI;
                        const endAngle = d.endAngle >= 0 ? d.endAngle : d.endAngle + 2 * Math.PI;

                        const adjustedStartAngle = Math.min(startAngle, endAngle);
                        const adjustedEndAngle = Math.max(startAngle, endAngle);

                        const interpolate = d3.interpolate(
                            { startAngle: adjustedStartAngle, endAngle: adjustedEndAngle },
                            { startAngle: 0, endAngle: 0 }
                        );

                        return function (t) {
                            return arc(interpolate(t));
                        };
                    })
                    .on("end", function (_, i, nodes) {
                        if (i === nodes.length - 1) {
                            // Once all transitions end, hide the group
                            pieGroups.style("display", "none");
                        }
                    });
            } else {
                // Show and animate the pie groups
                pieGroups
                    .style("display", "block")
                    .selectAll("path")
                    .transition()
                    .duration(800)
                    .attrTween("d", function (d) {
                        const radius = d3.select(this.parentNode).datum()
                            ? rScale(d3.select(this.parentNode).datum().total_population)
                            : 20;

                        const arc = d3.arc().innerRadius(0).outerRadius(radius);

                        const startAngle =
                            d.startAngle >= 0 ? d.startAngle : d.startAngle + 2 * Math.PI;
                        const endAngle = d.endAngle >= 0 ? d.endAngle : d.endAngle + 2 * Math.PI;

                        const adjustedStartAngle = Math.min(startAngle, endAngle);
                        const adjustedEndAngle = Math.max(startAngle, endAngle);

                        const interpolate = d3.interpolate(
                            { startAngle: 0, endAngle: 0 },
                            { startAngle: adjustedStartAngle, endAngle: adjustedEndAngle }
                        );

                        return function (t) {
                            return arc(interpolate(t));
                        };
                    });
            }
        };

        // Add bubbles
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.median_housing_price))
            .attr("cy", (d) => yScale(d.median_income))
            .attr("r", (d) => rScale(d.total_population))
            .attr("fill", "steelblue")
            .attr("opacity", 1)
            .on("click", onCircleClick)
            .attr("stroke", "black")
            .attr("stroke-width", 1);

        const pie = d3
            .pie()
            .startAngle(0)
            .endAngle(-2 * Math.PI);

        const pieColor = d3.scaleLinear<string>().domain([0, 1]).range(["lightgray", "darkgreen"]); // 4-year degree vs. not

        // Add labels
        svg.selectAll("text.metro")
            .data(data)
            .enter()
            .append("text")
            .attr("x", (d) => xScale(d.median_housing_price)) // Center horizontally
            .attr("y", (d) => yScale(d.median_income) + rScale(d.total_population) + 10)
            .attr("text-anchor", "middle") // Center text horizontally
            .attr("dominant-baseline", "middle") // Center text vertically
            .attr("font-size", "16px")
            .attr("fill", "#333")
            .text((d) => d.metro_area);

        svg.selectAll(".pie-group")
            .data(data)
            .enter()
            .append("g")
            .attr("class", "pie-group")
            .attr(
                "transform",
                (d) => `translate(${xScale(d.median_housing_price)}, ${yScale(d.median_income)})`
            )
            .style("display", "none") // initially hidden
            .on("click", onCircleClick)
            .each(function (d) {
                const radius = rScale(d.total_population);

                const pieData = pie([d.education_attainment, 100 - d.education_attainment]);

                d3.select(this)
                    .selectAll("path")
                    .data(pieData)
                    .enter()
                    .append("path")
                    .attr("fill", (d, i) => pieColor(i))
                    .attr("opacity", 1)
                    .attr(
                        "d",
                        d3.arc().innerRadius(0).outerRadius(radius).startAngle(0).endAngle(0)
                    ) // start with no visible arc
                    .attr("stroke", "black") // Add black border to the pie slices
                    .attr("stroke-width", 1)
                    .on("mouseover", function () {
                        d3.select(this)
                            .attr("stroke", "white") // Add white border on mouseover
                            .attr("stroke-width", 2); // Make the stroke bold
                        d3.select(this.parentNode)
                            .append("rect")
                            .attr("class", "text-background") // Class to style the background
                            .attr("x", 0.78 * (radius + 20) - 16) // Adjust position (x) for padding
                            .attr("y", 0.78 * -radius - 10) // Adjust position (y) for padding attr("y", -radius / 2 - (radius / 4) + 10)
                            .attr("width", 34) // Set width of the background rectangle
                            .attr("height", 18) // Set height of the background rectangle
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .attr("fill", "#86b586") // Set the fill color to white for the background
                            .attr("stroke", "none") // No border for the background
                            .attr("opacity", 1);
                        d3.select(this.parentNode) // Select the group containing the pie slice
                            .append("text")
                            .attr("class", "hover-text") // Add a class to style the text
                            .attr("x", 0.78 * (radius + 21))
                            .attr("y", 0.78 * -radius) // Center the text vertically
                            .attr("text-anchor", "middle")
                            .attr("dominant-baseline", "middle")
                            .attr("font-size", "16px")
                            .attr("fill", "black")
                            .text(d3.format(".0%")(d.education_attainment / 100));
                        d3.select(this.parentNode) // rect for education_attainment_population
                            .append("rect")
                            .attr("class", "text-background")
                            .attr("x", 0.78 * (radius - 20) + 2)
                            .attr("y", 0.78 * -radius - 21.5)
                            .attr("width", 58)
                            .attr("height", 12)
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .attr("fill", "#86b586")
                            .attr("stroke", "none")
                            .attr("opacity", 1);
                        d3.select(this.parentNode) // education_attainment_population
                            .append("text")
                            .attr("class", "hover-text")
                            .attr("x", 0.78 * (radius + 20))
                            .attr("y", 0.78 * -radius - 14)
                            .attr("dominant-baseline", "middle")
                            .attr("font-size", "12px")
                            .attr("fill", "black")
                            .text((d) => `${d.education_attainment_population.toLocaleString()}`);
                        d3.select(this.parentNode)
                            .append("rect")
                            .attr("class", "text-background") // Class to style the background
                            .attr("x", -110 / 2) // Adjust position (x) for padding
                            .attr("y", radius + 18) // Adjust position (y) for padding attr("y", -radius / 2 - (radius / 4) + 10)
                            .attr("width", 110) // Set width of the background rectangle
                            .attr("height", 12) // Set height of the background rectangle
                            .attr("rx", 5)
                            .attr("ry", 5)
                            .attr("fill", "white") // Set the fill color to white for the background
                            .attr("stroke", "none") // No border for the background
                            .attr("opacity", 0.7);
                        d3.select(this.parentNode)
                            .attr("text-anchor", "middle")
                            .append("text")
                            .attr("class", "text-population")
                            .attr("x", 0) // Center horizontally
                            .attr("y", radius + 28)
                            .attr("font-size", "12px")
                            .attr("fill", "#black")
                            .text((d) => `Total pop: ${d.total_population.toLocaleString()}`);
                    })

                    .on("mouseout", function () {
                        d3.select(this)
                            .attr("stroke", "black") // Remove the stroke on mouseout
                            .attr("stroke-width", 1); // Reset stroke width to default
                        d3.select(this.parentNode)
                            .selectAll(".hover-text") // Select the text element with the class "hover-text"
                            .remove(); // Remove the text
                        d3.select(this.parentNode)
                            .selectAll(".text-background") // Select the background rectangle
                            .remove(); // Remove the background rectangle
                        d3.select(this.parentNode).selectAll(".text-population").remove(); // Remove the text
                    });
            });
    });
</script>

<div class="w-[700px] bg-gray-100">
    <h2 class="mb-2.5 text-center text-lg font-bold break-words">
        Total Population and Total Population with 4 Year College Degree or Equivalent, by Metro
        Area
    </h2>
    <svg id="bubble-chart">
        <!-- y-axis -->
        <g>
            {#each yTickValues as tick, i (i)}
                <g class="tick tick-{tick}" transform="translate(30, {yScale(tick)})">
                    <line x2="100%" stroke="#d4d4d4" style="stroke-dasharray: 2;" />
                    <text y="-4" class="text-center text-sm">{yTicks[i]}</text>
                </g>
            {/each}
        </g>
        <!-- y-axis label -->
        <text
            x={-height / 2 - 50}
            y={padding.left - 50}
            transform="rotate(-90)"
            class="text-center text-sm"
        >
            Median Income ($)
        </text>

        <!-- x-axis -->
        <g>
            {#each xTickValues as tick, i (i)}
                <g class="tick" transform="translate({xScale(tick)}, {height - padding.bottom})">
                    <line y2="6" stroke="#d4d4d4" style="stroke-dasharray: 2;" />
                    <line y1="-{height - padding.bottom - padding.top / 1.5}" y2="0" />
                    <text x="0" y="20" text-anchor="middle" class="text-center text-sm"
                        >{xTicks[i]}</text
                    >
                </g>
            {/each}
        </g>
        <!-- x-axis label -->
        <text
            x={width / 2 - padding.right}
            y={height - padding.bottom + 40}
            class="text-center text-sm"
        >
            Median Housing Value ($)
        </text>

        <!-- legend -->
        <g class="legend" transform="translate({width - padding.right - 100}, {padding.top})">
            <g transform="translate(55, 100)">
                <!-- bg rectangle -->
                <rect
                    x="-8"
                    y="-5"
                    width="145"
                    height="100"
                    fill="white"
                    stroke="black"
                    stroke-width="1"
                    rx="5"
                    ry="5"
                />
                <circle cx="0" cy="5" r="5" fill="steelblue" />
                <text x="10" y="10" font-size="12px">
                    <tspan x="10" dy="0">Population by Metro</tspan>
                    <tspan x="10" dy="15">Area </tspan>
                </text>
                <circle cx="0" cy="40" r="5" fill="darkgreen" />
                <text x="10" y="40" font-size="12px">
                    <tspan x="10" dy="0">Population with 4 Year</tspan>
                    <tspan x="10" dy="15"> College Degree Or</tspan>
                    <tspan x="10" dy="15"> Equivalent by Metro</tspan>
                    <tspan x="10" dy="15"> Area</tspan>
                </text>
            </g>
        </g>

        <!-- chart content -->
        <g id="chart-content" />
    </svg>
</div>

<style>
    .tick line {
        stroke: #d4d4d4;
        stroke-dasharray: 2;
    }
    .text-sm {
        font-size: 16px; /* Change the font size in the CSS class */
    }
</style>

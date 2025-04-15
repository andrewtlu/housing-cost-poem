<script lang="ts">
    import { scaleLinear } from "d3-scale";
    // import { educationData, type MetroEducation } from "$lib/data";
    import { extent } from "d3";
    import { Info, Title } from "$lib/components/chart-common";

    // let data: MetroEducation[] = educationData;

    // graph properties
    const width = 820;
    const height = 660;
    /* padding between svg and axes */
    const padding = { top: 50, right: 50, bottom: 50, left: 50 };

    // axes
    const xTicks = [0, 200000, 400000, 600000, 800000];
    const yTicks = [0, 50000, 100000];

    // note to future: this is jank, but we precalculate xTicks and yTicks :(
    const xScale = scaleLinear()
        .domain(extent(xTicks) as [number, number])
        .range([padding.left, width - padding.right]);

    const yScale = scaleLinear()
        .domain(extent(yTicks) as [number, number])
        .range([height - padding.bottom, padding.top]);

    // const rScale = scaleLinear()
    //     .domain(extent([0, ...data.map((d) => d.total_population)]) as [number, number])
    //     .range([0, 80]);

    // const pieColor = d3.scaleLinear<string>().domain([0, 1]).range(["lightgray", "darkgreen"]); // 4-year degree vs. not

    // const pieGenerator = pie<MetroEducation>().value((d) => d.education_attainment);
    // // need data point to have metro area, education type (no degree, college+), and percentage
    // let pieData = $derived(pieGenerator(educationData));
    // const arcGenerator = arc<MetroEducation>()
    //     .innerRadius(0)
    //     .outerRadius((d) => rScale(d.total_population))
    //     .startAngle(0)
    //     .endAngle(0);

    console.log(xScale(xTicks[xTicks.length - 1]));

    // onMount(() => {
    //     const svg = select("#bubble-chart")
    //         .attr("width", width)
    //         .attr("height", height)
    //         .select("g#chart-content");

    //     const onCircleClick = () => {
    //         console.log("circle clicked");

    //         const pieGroups = svg.selectAll(".pie-group");

    //         // Check current display style
    //         const isVisible = pieGroups.style("display") !== "none";

    //         if (isVisible) {
    //             // Hide the pie groups
    //             pieGroups
    //                 .selectAll("path")
    //                 .transition()
    //                 .duration(500)
    //                 .attrTween("d", function (d) {
    //                     const radius = d3.select(this.parentNode).datum()
    //                         ? rScale(d3.select(this.parentNode).datum().total_population)
    //                         : 20;

    //                     const arc = d3.arc().innerRadius(0).outerRadius(radius);

    //                     const startAngle =
    //                         d.startAngle >= 0 ? d.startAngle : d.startAngle + 2 * Math.PI;
    //                     const endAngle = d.endAngle >= 0 ? d.endAngle : d.endAngle + 2 * Math.PI;

    //                     const adjustedStartAngle = Math.min(startAngle, endAngle);
    //                     const adjustedEndAngle = Math.max(startAngle, endAngle);

    //                     const interpolate = d3.interpolate(
    //                         { startAngle: adjustedStartAngle, endAngle: adjustedEndAngle },
    //                         { startAngle: 0, endAngle: 0 }
    //                     );

    //                     return function (t) {
    //                         return arc(interpolate(t));
    //                     };
    //                 })
    //                 .on("end", function (_, i, nodes) {
    //                     if (i === nodes.length - 1) {
    //                         // Once all transitions end, hide the group
    //                         pieGroups.style("display", "none");
    //                     }
    //                 });
    //         } else {
    //             // Show and animate the pie groups
    //             pieGroups
    //                 .style("display", "block")
    //                 .selectAll("path")
    //                 .transition()
    //                 .duration(800)
    //                 .attrTween("d", function (d) {
    //                     const radius = d3.select(this.parentNode).datum()
    //                         ? rScale(d3.select(this.parentNode).datum().total_population)
    //                         : 20;

    //                     const arc = d3.arc().innerRadius(0).outerRadius(radius);

    //                     const startAngle =
    //                         d.startAngle >= 0 ? d.startAngle : d.startAngle + 2 * Math.PI;
    //                     const endAngle = d.endAngle >= 0 ? d.endAngle : d.endAngle + 2 * Math.PI;

    //                     const adjustedStartAngle = Math.min(startAngle, endAngle);
    //                     const adjustedEndAngle = Math.max(startAngle, endAngle);

    //                     const interpolate = d3.interpolate(
    //                         { startAngle: 0, endAngle: 0 },
    //                         { startAngle: adjustedStartAngle, endAngle: adjustedEndAngle }
    //                     );

    //                     return function (t) {
    //                         return arc(interpolate(t));
    //                     };
    //                 });
    //         }
    //     };

    //     // Add bubbles
    //     svg.selectAll("circle")
    //         .data(data)
    //         .enter()
    //         .append("circle")
    //         .attr("cx", (d) => xScale(d.median_home_value))
    //         .attr("cy", (d) => yScale(d.median_income))
    //         .attr("r", (d) => rScale(d.total_population))
    //         .attr("fill", "steelblue")
    //         .attr("opacity", 1)
    //         .on("click", onCircleClick)
    //         .attr("stroke", "black")
    //         .attr("stroke-width", 1);

    //     const pie = d3
    //         .pie()
    //         .startAngle(0)
    //         .endAngle(-2 * Math.PI);

    //     const pieColor = d3.scaleLinear<string>().domain([0, 1]).range(["lightgray", "darkgreen"]); // 4-year degree vs. not

    //     // Add labels
    //     svg.selectAll("text.metro")
    //         .data(data)
    //         .enter()
    //         .append("text")
    //         .attr("x", (d) => xScale(d.median_home_value)) // Center horizontally
    //         .attr("y", (d) => yScale(d.median_income) + rScale(d.total_population) + 10)
    //         .attr("text-anchor", "middle") // Center text horizontally
    //         .attr("dominant-baseline", "middle") // Center text vertically
    //         .attr("font-size", "16px")
    //         .attr("fill", "#333")
    //         .text((d) => d.metro_area);

    //     svg.selectAll(".pie-group")
    //         .data(data)
    //         .enter()
    //         .append("g")
    //         .attr("class", "pie-group")
    //         .attr(
    //             "transform",
    //             (d) => `translate(${xScale(d.median_home_value)}, ${yScale(d.median_income)})`
    //         )
    //         .style("display", "none") // initially hidden
    //         .on("click", onCircleClick)
    //         .each(function (d) {
    //             const radius = rScale(d.total_population);

    //             const pieData = pie([d.education_attainment, 100 - d.education_attainment]);

    //             d3.select(this)
    //                 .selectAll("path")
    //                 .data(pieData)
    //                 .enter()
    //                 .append("path")
    //                 .attr("fill", (d, i) => pieColor(i))
    //                 .attr("opacity", 1)
    //                 .attr(
    //                     "d",
    //                     d3.arc().innerRadius(0).outerRadius(radius).startAngle(0).endAngle(0)
    //                 ) // start with no visible arc
    //                 .attr("stroke", "black") // Add black border to the pie slices
    //                 .attr("stroke-width", 1)
    //                 .on("mouseover", function () {
    //                     d3.select(this)
    //                         .attr("stroke", "white") // Add white border on mouseover
    //                         .attr("stroke-width", 2); // Make the stroke bold
    //                     d3.select(this.parentNode)
    //                         .append("rect")
    //                         .attr("class", "text-background") // Class to style the background
    //                         .attr("x", 0.78 * (radius + 20) - 16) // Adjust position (x) for padding
    //                         .attr("y", 0.78 * -radius - 10) // Adjust position (y) for padding attr("y", -radius / 2 - (radius / 4) + 10)
    //                         .attr("width", 34) // Set width of the background rectangle
    //                         .attr("height", 18) // Set height of the background rectangle
    //                         .attr("rx", 5)
    //                         .attr("ry", 5)
    //                         .attr("fill", "#86b586") // Set the fill color to white for the background
    //                         .attr("stroke", "none") // No border for the background
    //                         .attr("opacity", 1);
    //                     d3.select(this.parentNode) // Select the group containing the pie slice
    //                         .append("text")
    //                         .attr("class", "hover-text") // Add a class to style the text
    //                         .attr("x", 0.78 * (radius + 21))
    //                         .attr("y", 0.78 * -radius) // Center the text vertically
    //                         .attr("text-anchor", "middle")
    //                         .attr("dominant-baseline", "middle")
    //                         .attr("font-size", "16px")
    //                         .attr("fill", "black")
    //                         .text(d3.format(".0%")(d.education_attainment / 100));
    //                     d3.select(this.parentNode) // rect for education_attainment_population
    //                         .append("rect")
    //                         .attr("class", "text-background")
    //                         .attr("x", 0.78 * (radius - 20) + 2)
    //                         .attr("y", 0.78 * -radius - 21.5)
    //                         .attr("width", 58)
    //                         .attr("height", 12)
    //                         .attr("rx", 5)
    //                         .attr("ry", 5)
    //                         .attr("fill", "#86b586")
    //                         .attr("stroke", "none")
    //                         .attr("opacity", 1);
    //                     d3.select(this.parentNode) // education_attainment_population
    //                         .append("text")
    //                         .attr("class", "hover-text")
    //                         .attr("x", 0.78 * (radius + 20))
    //                         .attr("y", 0.78 * -radius - 14)
    //                         .attr("dominant-baseline", "middle")
    //                         .attr("font-size", "12px")
    //                         .attr("fill", "black")
    //                         .text((d) => `${d.education_attainment_population.toLocaleString()}`);
    //                     d3.select(this.parentNode)
    //                         .append("rect")
    //                         .attr("class", "text-background") // Class to style the background
    //                         .attr("x", -110 / 2) // Adjust position (x) for padding
    //                         .attr("y", radius + 18) // Adjust position (y) for padding attr("y", -radius / 2 - (radius / 4) + 10)
    //                         .attr("width", 110) // Set width of the background rectangle
    //                         .attr("height", 12) // Set height of the background rectangle
    //                         .attr("rx", 5)
    //                         .attr("ry", 5)
    //                         .attr("fill", "white") // Set the fill color to white for the background
    //                         .attr("stroke", "none") // No border for the background
    //                         .attr("opacity", 0.7);
    //                     d3.select(this.parentNode)
    //                         .attr("text-anchor", "middle")
    //                         .append("text")
    //                         .attr("class", "text-population")
    //                         .attr("x", 0) // Center horizontally
    //                         .attr("y", radius + 28)
    //                         .attr("font-size", "12px")
    //                         .attr("fill", "#black")
    //                         .text((d) => `Total pop: ${d.total_population.toLocaleString()}`);
    //                 })

    //                 .on("mouseout", function () {
    //                     d3.select(this)
    //                         .attr("stroke", "black") // Remove the stroke on mouseout
    //                         .attr("stroke-width", 1); // Reset stroke width to default
    //                     d3.select(this.parentNode)
    //                         .selectAll(".hover-text") // Select the text element with the class "hover-text"
    //                         .remove(); // Remove the text
    //                     d3.select(this.parentNode)
    //                         .selectAll(".text-background") // Select the background rectangle
    //                         .remove(); // Remove the background rectangle
    //                     d3.select(this.parentNode).selectAll(".text-population").remove(); // Remove the text
    //                 });
    //         });
    // });
</script>

<div class="bg-moon-light/95 relative flex flex-col overflow-x-clip rounded-md font-bold">
    <Title title="Proportion of Metro Area w/ College Degree or Equivalent" />
    <Info tooltip="todo" top={true} />

    <svg id="bubble-chart" {width} {height}>
        <!-- axes -->
        <g>
            {#each yTicks as tick, i (i)}
                <g transform="translate(30, {yScale(tick)})">
                    <line
                        x1="0"
                        x2={xScale(xTicks[xTicks.length - 1]) - 30}
                        style="stroke: var(--color-moon-dark); stroke-dasharray: 2;"
                    />
                    <text y="-4" class="text-center text-sm"
                        >{`$${tick.toLocaleString("en-US")}`}</text
                    >
                </g>
            {/each}
        </g>
        <g>
            {#each xTicks as tick, i (i)}
                <g transform="translate({xScale(tick)}, {height - padding.bottom})">
                    <line y2="6" style="stroke: var(--color-moon-dark); stroke-dasharray: 2;" />
                    <line
                        y1="0"
                        y2="-{height - padding.bottom - padding.top}"
                        style="stroke: var(--color-moon-dark); stroke-dasharray: 2;"
                    />
                    <text x="0" y="20" text-anchor="middle" class="text-center text-sm"
                        >{`$${tick.toLocaleString("en-US")}`}</text
                    >
                </g>
            {/each}
        </g>
        <!-- labels (don't ask me why this works but it does) -->
        <text
            x={-height / 2}
            y={padding.left / 2}
            text-anchor="middle"
            transform="rotate(-90)"
            class="text-center text-sm"
        >
            Median Income ($)
        </text>
        <text
            x={width / 2 - padding.right}
            y={height - padding.bottom + 40}
            class="text-center text-sm"
        >
            Median Housing Value ($)
        </text>

        <!-- legend -->
        <g class="legend" transform="translate({width / 2 + padding.left}, {height / 2})">
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

        <!-- {#each pieData as data, idx (idx)}
            <path
                pointer-events="all"
                cursor="pointer"
                d={arcGenerator(data.data.)}
                stroke="none"
                stroke-width="2"
                fill={pieColor(data.)}
            />
            <text
                x="0"
                y="0"
                text-anchor="middle"
                font-size="0.8em"
                class="fill-gray-100"
                transform="translate({labelArcs.centroid(d).join(' ')})"
                >{d.data.type}
            </text>
            <text
                x="0"
                y="1.2em"
                text-anchor="middle"
                font-size="0.8em"
                font-weight="700"
                class="fill-gray-100"
                transform="translate({labelArcs.centroid(d).join(' ')})"
                >{d.data.value + " kg"}
            </text>
        {/each} -->
    </svg>
</div>

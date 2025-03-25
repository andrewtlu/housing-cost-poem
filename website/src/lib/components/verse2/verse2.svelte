<script lang="ts">
    import { scaleLinear } from "d3-scale";
    import points from "./verse2_data.json";
    import { select } from "d3-selection";
    import { onMount } from "svelte";

    let data: {
        metro_area: string;
        median_housing_price: number;
        median_income: number;
        education_attainment: number;
    }[] = points;

    let lines = [
        "Plans of school, moving downtown",
        "cut short. Finding no space within,",
        "they plea: “Just earn your pension!”",
        "For what? To be kept trapped therein?"
    ];

    const width = 600;
    const height = 400;
    const padding = { top: 50, right: 100, bottom: 50, left: 70 };

    const xScale = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.median_housing_price))])
        .range([padding.left, width - padding.right]);

    const yScale = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.median_income))])
        .range([height - padding.bottom, padding.top]);

    const rScale = scaleLinear()
        .domain([0, Math.max(...data.map((d) => d.education_attainment))])
        .range([5, 30]);

    const xTickValues = [0, 200000, 400000, 600000, 800000]; // Adjust for readability
    const xTicks = ["$0", "$200,000", "$400,000", "$600,000", "$800,000"];
    const yTicks = ["$0", "$50,000", "$100,000", "$150,000", "$200,000"];
    const yTickValues = [0, 50000, 100000, 150000, 200000];

    onMount(() => {
        const svg = select("#bubble-chart").attr("width", width).attr("height", height).select("g");

        // Add bubbles
        svg.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", (d) => xScale(d.median_housing_price))
            .attr("cy", (d) => yScale(d.median_income))
            .attr("r", (d) => rScale(d.education_attainment))
            .attr("fill", "steelblue")
            .attr("opacity", 0.7);

        // Add labels
        svg.selectAll("text")
            .data(data)
            .enter()
            .append("text")
            .attr("x", (d) => xScale(d.median_housing_price)) // Center horizontally
            .attr("y", (d) => yScale(d.median_income)) // Center vertically
            .attr("text-anchor", "middle") // Center text horizontally
            .attr("dominant-baseline", "middle") // Center text vertically
            .attr("font-size", "12px")
            .attr("fill", "#333")
            .text((d) => d.metro_area);
    });
</script>

<ul>
    {#each lines as line, index (index)}
        <li>{line}</li>
    {/each}
</ul>

<div class="bg-gray-100">
    <svg id="bubble-chart">
        <g />
        <!-- Left Y-axis -->
        <g>
            {#each yTickValues as tick, i (i)}
                <g class="tick tick-{tick}" transform="translate(30, {yScale(tick)})">
                    <line x2="100%" stroke="#d4d4d4" />
                    <text y="-4">{yTicks[i]}</text>
                </g>
            {/each}
        </g>

        <g class="legend" transform="translate({width - padding.right - 100}, {padding.top})">
            <!-- Proportion Under 25 -->
            <g transform="translate(60, 100)">
                <!-- Background rectangle -->
                <rect
                    x="-8"
                    y="-5"
                    width="140"
                    height="70"
                    fill="white"
                    stroke="black"
                    stroke-width="1"
                    rx="5"
                    ry="5"
                />

                <!-- Legend Circle -->
                <circle cx="0" cy="5" r="5" fill="steelblue" />

                <!-- Legend Text -->
                <text x="10" y="10" font-size="12px">
                    <tspan x="10" dy="0">Proportion Over 25</tspan>
                    <tspan x="10" dy="15">with 4 Year College</tspan>
                    <tspan x="10" dy="15">Degree Or Equivalent</tspan>
                    <tspan x="10" dy="15">by Metro Area</tspan>
                </text>
            </g>
        </g>

        <!-- X-axis -->
        <g>
            {#each xTickValues as tick, i (i)}
                <g class="tick" transform="translate({xScale(tick)}, {height - padding.bottom})">
                    <line y2="6" stroke="#d4d4d4" style="stroke-dasharray: 2;" />
                    <line y1="-{height - padding.bottom - padding.top}" y2="0" />
                    <text x="0" y="20" text-anchor="middle">{xTicks[i]}</text>
                </g>
            {/each}
        </g>
        <!-- X-Axis Label -->
        <text x={width / 2} y={height - padding.bottom + 40} class="text-center text-sm">
            Median Housing Value ($)
        </text>

        <!-- Y-Axis Label -->
        <text
            x={-height / 2}
            y={padding.left - 50}
            transform="rotate(-90)"
            class="text-center text-sm"
        >
            Median Income ($)
        </text>
    </svg>
</div>

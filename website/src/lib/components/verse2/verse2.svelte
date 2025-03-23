<script lang="ts">
    import { getFrame, keyframe } from "$lib/keyframe.svelte";
    import { scaleBand, scaleLinear } from 'd3-scale';
    import points from './verse2_data.json';
    import { select } from 'd3-selection';
    import { transition } from 'd3-transition';
    import { onMount } from 'svelte';

    interface MetroArea {
        metro_area: string;
        median_housing_price: number;
        median_income: number;
        education_attainment: number;
    }

    let data: MetroArea[] = points;

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
        .domain([0, Math.max(...data.map(d => d.median_housing_price))])
        .range([padding.left, width - padding.right]);

    const yScale = scaleLinear()
        .domain([0, Math.max(...data.map(d => d.median_income))])
        .range([height - padding.bottom, padding.top]);

    const rScale = scaleLinear()
        .domain([0, Math.max(...data.map(d => d.education_attainment))])
        .range([5, 30]);

    const xTickValues = [0, 200000, 400000, 600000, 800000]; // Adjust for readability
    const xTicks = ["$0", "$200,000", "$400,000", "$600,000", "$800,000"];
    const yTicks = ["$0", "$50,000", "$100,000", "$150,000", "$200,000"];
    const yTickValues = [0, 50000, 100000, 150000, 200000];


    onMount(() => {
    const svg = select("#bubble-chart")
        .attr("width", width)
        .attr("height", height)
        .select("g");

    // Add bubbles
    svg.selectAll("circle")
        .data(data)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.median_housing_price))
        .attr("cy", d => yScale(d.median_income))
        .attr("r", d => rScale(d.education_attainment))
        .attr("fill", "steelblue")
        .attr("opacity", 0.7);

    // Add labels
    svg.selectAll("text")
        .data(data)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.median_housing_price))
        .attr("y", d => yScale(d.median_income))
        .attr("dy", "-0.5em")
        .attr("text-anchor", "middle")
        .attr("font-size", "12px")
        .attr("fill", "#333")
        .text(d => d.metro_area);
    });
</script>

<ul>
    {#each lines as line, index (index)}
        <li>{line}</li>
    {/each}
</ul>

<div class="bg-gray-100">
<svg id="bubble-chart">
    <g/>
    <!-- Left Y-axis -->
    <g class="axis y-axis">
        {#each yTickValues as tick, i (i)}
            <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
                <line x2="100%" stroke="black"/>
                <text y="-4">{yTicks[i]}</text>
            </g>
        {/each}
    </g>

    <!-- X-axis -->
    <g class="axis x-axis">
        {#each xTickValues as tick, i (i)}
            <g class="tick" transform="translate({xScale(tick)}, {height - padding.bottom})">
                <line y2="6" stroke="black"/>
                <line y1="-{height - padding.bottom - padding.top}" y2="0"/>
                <text x="0" y="20" text-anchor="middle">{xTicks[i]}</text>
            </g>
        {/each}
    </g>
</svg>
</div>

<style>
    .x-axis text {
        font-size: 14px;
    }
    .y-axis text {
        font-size: 12px;
    }
    .tick line {
		stroke: #d4d4d4;
		stroke-dasharray: 2;
	}
</style>
<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale";
    import points from "./verse1_data.json";
    import { writable } from 'svelte/store';
    import { getFrame, keyframe } from "$lib";
    import { toggleMedianIncome, showMedianIncome, toggleHousingPrice, showMedianHousingPrice, showProportion, textOpacity } from '$lib/actions';

    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];

    let data: {
        metro_area: string;
        median_housing_price: number;
        median_income: number;
        median_home_value_to_income: number;
        proportion_under_25: number;
    }[] = points;

    const xTicks = ["ATL", "BALT", "NYC", "SF", "DC"];
    const yTicks = ["$0", "$200,000", "$400,000", "$600,000", "$800,000", "$1,000,000"];
    const yTickValues = [0, 200000, 400000, 600000, 800000, 1000000];
    const y2Ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // For percentage scale
    const padding = { top: 20, right: 50, bottom: 40, left: 50 };

    let width = $state(700);
    let height = 500;

    // scales
    let xScale = $derived(
        scaleBand()
            .domain(xTicks)
            .range([padding.left + 10, width - padding.right])
            .padding(0.1)
    );
    // y-axis scale for the main bars (housing, income, home value)
    let yScale = scaleLinear()
        .domain([0, 1000000])
        .range([height - padding.bottom, padding.top]);
    // y2-axis scale for the "proportion_under_25" data
    let y2Scale = scaleLinear()
        .domain([0, 100])
        .range([height - padding.bottom, padding.top]);

    let barWidth = $derived(xScale.bandwidth() / 2);

    function formatMobile(tick: string) {
        return "'" + tick.slice(-2);
    }

    // Create a writable store for the variable
</script>

<ul>
    {#each lines as line, index (index)}
        <li
            title={line}
            class={`opacity-50 transition-all ${getFrame(keyframe.value).bolded.includes(index) ? "font-bold opacity-100" : ""}`}
        >
            {line}
        </li>
    {/each}
</ul>

<div class="bg-gray-100 w-[700px]" bind:clientWidth={width}>
    <h2 class="mb-2.5 text-center text-lg font-bold break-words">
    Comparing Median Income and Median Housing Value by Metro Area
    </h2>

    <svg {width} {height}>
        <!-- Left Y-axis -->
        <g class="axis">
            {#each yTickValues as tick, i (i)}
                <g class="tick tick-{tick}" transform="translate(3, {yScale(tick)})">
                    <line x2="100%" />
                    <text y="-4" class="text-xs">{yTicks[i]}</text>
                    <!-- Display string tick from yTicks -->
                </g>
            {/each}
        </g>
        <!-- X-axis -->
        <g class="axis x-axis">
            {#each xTicks as tick, i (i)}
                <g class="tick" transform="translate({xScale(tick)}, {height})">
                    <text class="text-start text-sm" x={barWidth-25} y="-20">
                        {width > 380 ? tick : formatMobile(tick)}
                    </text>
                </g>
            {/each}
        </g>
        <!-- Bars -->
        <g class="bars">
            {#each data as point, i (i)}
                <g>
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 0}
                        y={yScale(point.median_housing_price)}
                        width={barWidth * 0.9}
                        height={yScale(0) - yScale(point.median_housing_price)}
                        fill={$showMedianHousingPrice ? 'black' : 'white'}
                        style="transition: fill 0.5s;"
                    />
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 1}
                        y={yScale(point.median_income)}
                        width={barWidth * 0.9}
                        height={yScale(0) - yScale(point.median_income)}
                        style="transition: fill 0.5s;"
                        fill={$showMedianIncome ? 'lightgray' : 'white'}
                        stroke="gray"
                        stroke-width="1"
                        stroke-opacity={$showProportion ? 1 : 0}
                    />
                    <!-- Additional Rectangles on top of the Median Income bar -->
                    {#each Array(Math.floor(point.median_housing_price / point.median_income) - 1).fill() as _, index}
                        <rect
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_income) - (index + 1)*(yScale(0) - yScale(point.median_income))}
                            width={barWidth * 0.9}
                            height={yScale(0) - yScale(point.median_income)} 
                            fill="lightgray"
                            stroke="gray"
                            stroke-width="1"
                            style={`transition: fill 0.5s, opacity 0.5s; transition-delay: ${$showProportion ? (index + 1) * 0.15 + 's' : '0s'};`}
                            opacity={$showProportion ? 1 : 0}
                        />
                    {/each}
                    <!-- Fractional Rectangle (if there's a remainder) -->
                    {#if (point.median_housing_price / point.median_income) % 1 !== 0}
                        <rect
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_income) - ((point.median_housing_price / point.median_income) - 1)*(yScale(0) - yScale(point.median_income))}
                            width={barWidth * 0.9}
                            height={(yScale(0) - yScale(point.median_income)) * ((point.median_housing_price / point.median_income) % 1)}
                            fill="lightgray"
                            stroke="gray"
                            stroke-width="1"
                            style={`transition: fill 0.5s, opacity 0.5s; transition-delay: ${$showProportion ? Math.floor(point.median_housing_price / point.median_income) * 0.15 + 's' : '0s'};`}
                            opacity={$showProportion ? 1 : 0}
                        />
                    {/if}
                    
                    <text
                        x={Number(xScale(xTicks[i])) + barWidth * 1}
                        y={yScale(point.median_housing_price) - 45}
                        text-anchor="middle"
                        font-size="12px"
                        fill="black"
                        style="transition: opacity 0.5s;"
                        opacity={$textOpacity ? 1 : 0}
                    >
                        <tspan font-size="14px">Median Housing is </tspan>
                    </text>
                    <text
                        x={Number(xScale(xTicks[i])) + barWidth * 1}
                        y={yScale(point.median_housing_price) - 20}
                        text-anchor="middle"
                        font-size="12px"
                        fill="black"
                        style="transition: opacity 0.5s;"
                        opacity={$textOpacity ? 1 : 0}
                    >
                        <tspan font-size="24px">{(point.median_housing_price / point.median_income).toFixed(1)}</tspan><tspan font-size="14px">x</tspan>
                    </text>
                    <text
                        x={Number(xScale(xTicks[i])) + barWidth * 1}
                        y={yScale(point.median_housing_price) - 5}
                        text-anchor="middle"
                        font-size="12px"
                        fill="black"
                        style="transition: opacity 0.5s;"
                        opacity={$textOpacity ? 1 : 0}
                    >
                        <tspan font-size="14px">Median Income</tspan>
                    </text>
                    
                </g>
            {/each}
        </g>
        <!-- X-Axis Label -->
        <text
            x={width / 2}
            y={height - padding.bottom + 35}
            text-anchor="middle"
            class="text-center text-xs"
        >
            Metro Area
        </text>

        <!-- Legend -->
        <g class="legend" transform="translate({width - padding.right - 150}, {padding.top})">
            <!-- bg rectangle -->
            <rect
                x="-10"
                y="10"
                width="185"
                height="50"
                fill="white"
                stroke="black"
                stroke-width="1"
                rx="5"
                ry="5"
            />
            <!-- Median Housing Price -->
            <g transform="translate(0, 20)" on:click={toggleHousingPrice} style="cursor: pointer;">
                <circle cx="0" cy="5" r="7" fill="black" />
                <text x="10" y="10" font-size="16px">Median Housing Value</text>
            </g>

            <!-- Median Income -->
            <g transform="translate(0, 40)" on:click={toggleMedianIncome} style="cursor: pointer;">
                <circle cx="0" cy="5" r="7" fill="lightgray" />
                <text x="10" y="10" font-size="16px">Median Income</text>
            </g>
        </g>
    </svg>
</div>

<style>
    .y2-axis text {
        fill: darkgreen;
    }
    .tick line {
        stroke: #e2e2e2;
        stroke-dasharray: 2;
    }
</style>

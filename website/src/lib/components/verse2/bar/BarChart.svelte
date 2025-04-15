<!-- @component
Bar chart used in verse 2 for comparing median housing value to median income
 -->
<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale";
    import { under25Data, type CountyUnder25 } from "$lib/data";
    import { Info, Title } from "$lib/components/chart-common";
    import {
        proportionState as showProportionState,
        focusHomeState,
        focusIncomeState,
        setFocusHome,
        setFocusIncome
    } from "../bubble/store.svelte";

    // Chart info
    const width = 800;
    const height = 640;
    /* padding between svg and axes */
    const padding = { top: 40, right: 60, bottom: 40, left: 50 };

    // Data
    let data: CountyUnder25[] = under25Data;

    // Axes
    const xTicks = ["ATL", "BALT", "NYC", "SF", "DC"];
    const yTickValues = [0, 200000, 400000, 600000, 800000, 1000000];

    // x-axis scale for horizontal placement
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

    let barWidth = $derived(xScale.bandwidth() / 2);

    // state attributes
    let focusHome = $derived(focusHomeState[0]);
    let focusIncome = $derived(focusIncomeState[0]);
    let showProportion = $derived(showProportionState[0]);
    let compare = $derived(focusHome && focusIncome);
</script>

<div class="bg-moon-light/95 relative flex flex-col overflow-x-clip rounded-md font-bold">
    <Title title="Median Income vs. Median Home Value by Metro Area" />

    <!-- info tooltip -->
    <Info
        tooltip="Click on the legend to change the focused data! Data collected from US Census Bureau, censusreporter.org, and Logan et al.'s Longitudinal Tract Data Base (2000) and compiled on Kaggle."
    />

    <!-- TODO: use attribute select component -->

    <svg {width} {height}>
        <!-- Axes -->
        <g>
            {#each yTickValues as tick, i (i)}
                <g transform="translate(3, {yScale(tick)})">
                    <line x2="100%" style="stroke: var(--color-moon-dark); stroke-dasharray: 2;" />
                    <text y="-4" class="text-xs">{`$${tick.toLocaleString("en-US")}`}</text>
                </g>
            {/each}
        </g>
        <g>
            {#each xTicks as tick, i (i)}
                <g class="tick" transform="translate({xScale(tick)}, {height})">
                    <text class="text-start text-sm" x={barWidth - 25} y="-20">
                        {tick}
                    </text>
                </g>
            {/each}
        </g>
        <!-- x-axis label -->
        <text
            x={width / 2}
            y={height - padding.bottom + 35}
            text-anchor="middle"
            class="text-center text-xs"
        >
            Metro Area
        </text>

        <!-- Bars -->
        <g class="bars">
            {#each data as point, i (i)}
                <g>
                    <!-- median home value bar -->
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 0}
                        y={yScale(point.median_home_value)}
                        width={barWidth * 0.9}
                        height={yScale(0) - yScale(point.median_home_value)}
                        fill={focusHome ? "var(--color-midnight)" : "var(--color-moon)"}
                        style="transition: fill 0.5s;"
                    />
                    <!-- median income bar -->
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 1}
                        y={yScale(point.median_income)}
                        width={barWidth * 0.9}
                        height={yScale(0) - yScale(point.median_income)}
                        style="transition: fill 0.5s;"
                        fill={focusIncome ? "var(--color-moon-crater)" : "var(--color-moon)"}
                        stroke="var(--color-moon-dark)"
                        stroke-width="1"
                        stroke-opacity={showProportion ? 1 : 0}
                    />

                    <!-- stacked rectangles on median income bar to match with median home value height -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(Math.floor(point.median_home_value / point.median_income) - 1).fill(0) as _, index (index)}
                        <rect
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_income) -
                                (index + 1) * (yScale(0) - yScale(point.median_income))}
                            width={barWidth * 0.9}
                            height={yScale(0) - yScale(point.median_income)}
                            fill="var(--color-moon-crater)"
                            stroke="var(--color-moon-dark)"
                            stroke-width="1"
                            style={`transition: fill 0.5s, opacity 0.5s; transition-delay: ${showProportion ? (index + 1) * 0.15 + "s" : "0s"};`}
                            opacity={showProportion ? 1 : 0}
                        />
                    {/each}
                    <!-- remainder -->
                    {#if (point.median_home_value / point.median_income) % 1 !== 0}
                        <rect
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_income) -
                                (point.median_home_value / point.median_income - 1) *
                                    (yScale(0) - yScale(point.median_income))}
                            width={barWidth * 0.9}
                            height={(yScale(0) - yScale(point.median_income)) *
                                ((point.median_home_value / point.median_income) % 1)}
                            fill="var(--color-moon-crater)"
                            stroke="var(--color-moon-dark)"
                            stroke-width="1"
                            style={`transition: fill 0.5s, opacity 0.5s; transition-delay: ${showProportion ? Math.floor(point.median_home_value / point.median_income) * 0.15 + "s" : "0s"};`}
                            opacity={showProportion ? 1 : 0}
                        />
                    {/if}

                    <!-- comparison text -->
                    {#if compare}
                        <text
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_home_value) - 45}
                            text-anchor="middle"
                            font-size="12px"
                            fill="var(--color-midnight)"
                            style="transition: opacity 0.5s;"
                            opacity="1"
                        >
                            <tspan font-size="14px">Median Housing is </tspan>
                        </text>
                        <text
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_home_value) - 20}
                            text-anchor="middle"
                            font-size="12px"
                            fill="black"
                            style="transition: opacity 0.5s;"
                            opacity="1"
                        >
                            <tspan font-size="24px"
                                >{(point.median_home_value / point.median_income).toFixed(1)}</tspan
                            ><tspan font-size="14px">x</tspan>
                        </text>
                        <text
                            x={Number(xScale(xTicks[i])) + barWidth * 1}
                            y={yScale(point.median_home_value) - 5}
                            text-anchor="middle"
                            font-size="12px"
                            fill="black"
                            style="transition: opacity 0.5s;"
                            opacity="1"
                        >
                            <tspan font-size="14px">Median Income</tspan>
                        </text>
                    {/if}
                </g>
            {/each}
        </g>

        <!-- Legend -->
        <!-- svelte-ignore a11y_click_events_have_key_events -->
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
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g transform="translate(0, 20)" onclick={() => setFocusHome()} style="cursor: pointer;">
                <circle cx="0" cy="5" r="7" fill="black" />
                <text x="10" y="10" font-size="16px">Median Housing Value</text>
            </g>

            <!-- Median Income -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g
                transform="translate(0, 40)"
                onclick={() => setFocusIncome()}
                style="cursor: pointer;"
            >
                <circle cx="0" cy="5" r="7" fill="lightgray" />
                <text x="10" y="10" font-size="16px">Median Income</text>
            </g>
        </g>
    </svg>
</div>

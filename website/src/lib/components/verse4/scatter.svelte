<script lang="ts">
    import { attributeMap, data, type CountyRaces, type MapKeys } from "$lib/data";
    import { extent, scaleSqrt, scaleLinear } from "d3";
    import { fade } from "svelte/transition";
    import { AttributeSelect, Info, Title } from "$lib/components/shared";

    // Chart Data
    const width = 800;
    const height = 640;
    /* margin b/t svg and chart start */
    const margins = { top: 10, right: 10, left: 10, bottom: 10 };

    const chartWidth = width - margins.right - margins.left;
    const chartHeight = height - margins.top - margins.bottom;
    /* margin between svg and axes */
    const chartMargins = { top: 20, left: 90, bottom: 28, right: 20 };
    const races: MapKeys[] = [
        "white_alone",
        "black_alone",
        "native_alone",
        "asian_alone",
        "native_hawaiian_pacific_islander",
        "some_other_race_alone",
        "two_or_more",
        "hispanic_or_latino"
    ];

    // Transformed Data used by Scatterplot
    type GraphValue = {
        race: MapKeys;
        median_housing: number;
        race_percent: number;
        county_name: string;
        city_name: string;
    };
    let graphValues: GraphValue[] = $state([]);
    $effect(() => {
        if (data) {
            const tmp = [];
            // for each race, add the race, median housing, race_percent
            for (const county of data.values()) {
                for (const county_race of races) {
                    tmp.push({
                        race: county_race,
                        median_housing: county.median_home_value,
                        race_percent:
                            (county[county_race as CountyRaces] / county["total_population"]) * 100,
                        county_name: county.county,
                        city_name: county.city
                    });
                }
            }
            graphValues = tmp;
        }
    });

    // Race Filtering
    let filter_race: MapKeys | "" = $state("");
    const filterBy = (race: MapKeys) => {
        if (filter_race === race) {
            filter_race = "";
        } else {
            filter_race = race;
        }
    };

    // Scales
    const yTicks = [0, 86500, 246500, 406500, 566500, 726500, 886500, 1100000];
    let yScale = $derived(
        scaleLinear()
            .domain([yTicks[0], yTicks[yTicks.length - 1]])
            .range([chartHeight - chartMargins.bottom, chartMargins.top])
    );

    let xExtent = $derived.by(() => {
        const graphValues_filtered = graphValues.filter((d) => {
            if (filter_race !== "") {
                return d.race === filter_race;
            } else {
                return true;
            }
        });

        let xExtent;
        if (filter_race === "") {
            xExtent = [0, 100];
        } else {
            xExtent = extent(graphValues_filtered, (d) => d.race_percent) as [number, number];
        }

        return xExtent;
    });
    let xTicks = $derived.by(() => {
        const interval = (xExtent[1] - xExtent[0]) / 5;
        return [
            xExtent[0],
            xExtent[0] + interval,
            xExtent[0] + interval * 2,
            xExtent[0] + interval * 3,
            xExtent[0] + interval * 4,
            xExtent[1]
        ];
    });
    let xScale = $derived(
        scaleSqrt()
            .domain(xExtent)
            .range([chartMargins.left, chartWidth - chartMargins.right])
    );

    // point being hovered
    let hover: GraphValue | null = $state(null);
    let raceLine: SVGTextElement | null = $state(null);
    let countyStateLine: SVGTextElement | null = $state(null);
    let popProportionLine: SVGTextElement | null = $state(null);
    let homeCostLine: SVGTextElement | null = $state(null);
    const textYOffset = 20;
    const lineHeight = 20;
    const textMargins = { top: 22, left: 10, bottom: 22, right: 10 };
    let hoverHeight = $state(100);
    let hoverWidth = $state(230);

    $effect(() => {
        if (hover && raceLine && countyStateLine && popProportionLine && homeCostLine) {
            const lines = 4;
            hoverHeight = (lineHeight * lines) / 1.7 + textMargins.top + textMargins.bottom;
            hoverWidth =
                Math.max(
                    raceLine.getBBox().width,
                    countyStateLine.getBBox().width,
                    popProportionLine.getBBox().width,
                    homeCostLine.getBBox().width
                ) +
                textMargins.left +
                textMargins.right;
        }
    });
</script>

<div
    class="relative flex flex-col overflow-x-clip rounded-md border-2 border-[gray] bg-white font-bold"
>
    <!-- title -->
    <Title title="Impact of Racial Demographic on Housing Value" />

    <!-- graph -->
    <svg
        width={width + margins.left + margins.right}
        height={height + margins.top + margins.bottom}
    >
        <!-- Grid Lines (x & Y) -->
        {#each yTicks as y_val, idx (idx)}
            <g transform="translate(0, {yScale(y_val)})">
                {#if idx != 0}
                    <line
                        x1={chartMargins.left}
                        x2={chartWidth - chartMargins.right}
                        stroke="#d4d4d4"
                        style="stroke-dasharray: 2;"
                    />
                {/if}
            </g>
        {/each}
        {#each xTicks as x_val, idx (idx)}
            <g transform="translate({xScale(x_val)}, 0)">
                {#if idx != 0}
                    <line
                        y1={chartMargins.top}
                        y2={chartHeight - chartMargins.bottom}
                        stroke="#d4d4d4"
                        style="stroke-dasharray: 2;"
                        transition:fade={{ duration: 500 }}
                    />
                {/if}
            </g>
        {/each}

        <!-- X-Axis -->
        <g>
            <line
                x1={chartMargins.left}
                y1={chartHeight - chartMargins.bottom}
                x2={chartWidth - chartMargins.right}
                y2={chartHeight - chartMargins.bottom}
                stroke="black"
                stroke-width="3"
            />
            <text
                x={chartWidth / 2}
                y={chartHeight + chartMargins.bottom / 3}
                font-size="15px"
                text-anchor="middle"
            >
                Percent of Total Population (%)
            </text>
            {#each xTicks as x_val, idx (idx)}
                <g transform="translate({xScale(x_val)}, {chartHeight - chartMargins.bottom})">
                    <text
                        font-weight="lighter"
                        font-size="15px"
                        y="18"
                        x="-7"
                        transition:fade={{ duration: 500 }}
                    >
                        {x_val.toFixed(2)}
                    </text>
                </g>
            {/each}
        </g>

        <!-- Y-Axis -->
        <g>
            <line
                x1={chartMargins.left}
                y1={chartMargins.top}
                x2={chartMargins.left}
                y2={chartHeight - chartMargins.bottom}
                stroke="black"
                stroke-width="3"
            />
            <text
                transform="rotate(-90)"
                x={-chartHeight / 2}
                y={chartMargins.left / 5}
                font-size="15px"
                text-anchor="middle"
            >
                Median Home Cost ($)
            </text>
            {#each yTicks as y_val, idx (idx)}
                <g transform="translate({chartMargins.left}, {yScale(y_val)})">
                    <text font-size="15px" font-weight="lighter" x="-8" y="7" text-anchor="end">
                        {yTicks[idx].toLocaleString("en-US")}
                    </text>
                </g>
            {/each}
        </g>

        <!-- Draw Circle for Each Point -- Y-Value = Median Income & X = Func Call  -->
        {#each graphValues as data_point, idx (idx)}
            {#if filter_race === "" || data_point.race === filter_race}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <circle
                    cursor="pointer"
                    cx={xScale(data_point.race_percent)}
                    cy={yScale(data_point.median_housing)}
                    r="5"
                    fill={attributeMap[data_point.race].color[1]}
                    opacity="1"
                    transition:fade={{ duration: 500 }}
                    onmouseover={() => {
                        hover = data_point;
                    }}
                    onmouseleave={() => {
                        hover = null;
                    }}
                />
            {/if}
        {/each}

        <!-- data point hover tooltip -->
        {#if hover}
            <!-- todo: heuristic length, shift left if overflow -->
            <g class="pointer-events-none">
                <rect
                    x={xScale(hover.race_percent)}
                    y={yScale(hover.median_housing) + textYOffset}
                    width={hoverWidth}
                    height={hoverHeight}
                    stroke="gray"
                    stroke-width="2px"
                    fill="white"
                    rx="0.375rem"
                />
                <text
                    x={xScale(hover.race_percent) + textMargins.left}
                    y={yScale(hover.median_housing) + textMargins.top + textYOffset}
                    text-anchor="left"
                    font-size="22px"
                    fill="black"
                    bind:this={raceLine}
                >
                    {attributeMap[hover.race].tag}
                </text>
                <text
                    x={xScale(hover.race_percent) + textMargins.left}
                    y={yScale(hover.median_housing) + textMargins.top + textYOffset + lineHeight}
                    text-anchor="left"
                    font-size="16px"
                    fill="black"
                    bind:this={countyStateLine}
                >
                    {hover.county_name}, {hover.city_name}
                </text>
                <text
                    x={xScale(hover.race_percent) + textMargins.left}
                    y={yScale(hover.median_housing) +
                        textMargins.top +
                        textYOffset +
                        lineHeight * 2}
                    text-anchor="left"
                    font-size="16px"
                    fill="black"
                    bind:this={popProportionLine}
                >
                    {attributeMap[hover.race].tickFormat(hover.race_percent / 100)} of county population
                </text>
                <text
                    x={xScale(hover.race_percent) + textMargins.left}
                    y={yScale(hover.median_housing) +
                        textMargins.top +
                        textYOffset +
                        lineHeight * 3}
                    text-anchor="left"
                    font-size="16px"
                    fill="black"
                    bind:this={homeCostLine}
                >
                    Median Home Cost: ${hover.median_housing.toLocaleString("en-US", {
                        minimumFractionDigits: 2
                    })}
                </text>
            </g>
        {/if}
    </svg>

    <!-- Chart Legend -->
    <AttributeSelect attributes={races} setAttribute={filterBy} selected={filter_race} />

    <!-- Chart Tooltip -->
    <Info
        tooltip="Select races from legend to toggle filters, and hover over data points for more in-depth info. Data collected from US Census Bureau, censusreporter.org, and Logan et al.'s Longitudinal Tract Data Base (2000) and compiled on Kaggle."
    />
</div>

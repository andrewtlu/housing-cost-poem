<script lang="ts">
    import { attributeMap, data, type CountyRaces, type MapKeys } from "$lib/data";
    import { extent, scaleSqrt, scaleLinear } from "d3";
    import { fade } from "svelte/transition";
    import { AttributeSelect, Info, Title } from "$lib/components/shared";

    // Chart Data
    const width = 790;
    const height = 580;
    const chartMargins = { top: 30, right: -15, bottom: 20, left: 110 };
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
    let graphValues: {
        race: MapKeys;
        median_housing: number;
        race_percent: number;
        county_name: string;
        city_name: string;
    }[] = $state([]);
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
            .range([height - chartMargins.bottom, chartMargins.top])
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
            .range([chartMargins.left, width - chartMargins.right])
    );

    // Hovering State (For Data Point Tooltips)
    let hover = $state(-1);
</script>

<div
    class="relative flex flex-col items-center rounded-md border-2 border-[gray] bg-white font-bold"
>
    <!-- title -->
    <Title title="Impact of Racial Demographic on Housing Value" />

    <!-- graph -->
    <svg
        width={width + chartMargins.left + chartMargins.right}
        height={height + chartMargins.top + chartMargins.bottom}
    >
        <!-- X-Axis -->
        <g class="axis x-axis">
            <line
                x1={chartMargins.left}
                y1={height - chartMargins.bottom}
                x2={width - chartMargins.right}
                y2={height - chartMargins.bottom}
                stroke="black"
                stroke-width="3"
            />
            <text
                class="x-axis_label"
                x={width / 2}
                y={height + 30}
                font-size="15px"
                text-anchor="middle"
            >
                Percent of Total Population (%)
            </text>
            {#each xTicks as x_val, idx (idx)}
                <g transform="translate({xScale(x_val)}, {height - chartMargins.bottom})">
                    <text class="x-axis-tick" y="20" x="-6" transition:fade={{ duration: 500 }}>
                        {x_val.toFixed(2)}
                    </text>
                </g>
            {/each}
        </g>

        <!-- Grid Lines (x & Y) -->
        {#each yTicks as y_val, idx (idx)}
            <g transform="translate(0, {yScale(y_val)})">
                {#if idx != 0}
                    <line
                        x1={chartMargins.left}
                        x2={width - chartMargins.right}
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
                        y2={height - chartMargins.bottom}
                        stroke="#d4d4d4"
                        style="stroke-dasharray: 2;"
                        transition:fade={{ duration: 500 }}
                    />
                {/if}
            </g>
        {/each}

        <!-- Draw Circle for Each Point -- Y-Value = Median Income & X = Func Call  -->
        {#each graphValues as data_point, idx (idx)}
            {#if filter_race === "" || data_point.race === filter_race}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <!-- svelte-ignore a11y_no_static_element_interactions -->
                <circle
                    class="data_point"
                    cursor="pointer"
                    cx={xScale(data_point.race_percent)}
                    cy={yScale(data_point.median_housing)}
                    r="5"
                    fill={attributeMap[data_point.race].color[1]}
                    opacity="1"
                    transition:fade={{ duration: 500 }}
                    onmouseover={() => {
                        hover = idx;
                    }}
                    onmouseleave={() => {
                        hover = -1;
                    }}
                />
            {/if}
        {/each}

        <!-- Data Points Hoverable -->
        {#if hover != -1}
            <g class="pointer-events-none">
                <rect
                    x={xScale(graphValues[hover].race_percent)}
                    y={yScale(graphValues[hover].median_housing)}
                    width="230"
                    height="50"
                    stroke="black"
                    stroke-width="2"
                    fill="white"
                />
                <text
                    x={xScale(graphValues[hover].race_percent) + 5}
                    y={yScale(graphValues[hover].median_housing) + 15}
                    text-anchor="left"
                    font-size="12"
                    fill="black"
                >
                    Race: {attributeMap[graphValues[hover].race].textLabel}
                </text>
                <text
                    x={xScale(graphValues[hover].race_percent) + 5}
                    y={yScale(graphValues[hover].median_housing) + 30}
                    text-anchor="left"
                    font-size="12"
                    fill="black"
                >
                    Population %: {graphValues[hover].race_percent.toFixed(2)}
                </text>
                <text
                    x={xScale(graphValues[hover].race_percent) + 5}
                    y={yScale(graphValues[hover].median_housing) + 45}
                    text-anchor="left"
                    font-size="12"
                    fill="black"
                >
                    Median Housing $: {graphValues[hover].median_housing}
                </text>
            </g>
        {/if}

        <!-- Y-Axis -->
        <g class="axis y-axis">
            <line
                x1={chartMargins.left}
                y1={chartMargins.top}
                x2={chartMargins.left}
                y2={height - chartMargins.bottom}
                stroke="black"
                stroke-width="3"
            />
            <text
                class="y-axis_label"
                transform="rotate(-90)"
                x={-height / 2}
                y={chartMargins.left - 95}
                font-size="15px"
                text-anchor="middle"
            >
                Median House Value ($)
            </text>
            {#each yTicks as y_val, idx (idx)}
                <g transform="translate(0, {yScale(y_val)})">
                    <text class="y-axis-tick" x="100" y="10" text-anchor="end">
                        {yTicks[idx].toLocaleString("en-US")}
                    </text>
                </g>
            {/each}
        </g>
    </svg>

    <!-- Chart Legend -->
    <AttributeSelect attributes={races} setAttribute={filterBy} />

    <!-- Chart Tooltip -->
    <Info
        tooltip="Select races from legend to toggle filters, and hover over data points for more in-depth info. Data collected from US Census Bureau, censusreporter.org, and Logan et al.'s Longitudinal Tract Data Base (2000) and compiled on Kaggle."
    />
</div>

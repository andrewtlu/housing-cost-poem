<script lang="ts">
    import { data, type CountyRaces } from "$lib/data";
    import { extent, scaleLog, scaleSqrt, scaleOrdinal } from "d3";

    // chart data
    const width = 700;
    const height = 500;
    const chartMargins = { top: 20, right: 5, bottom: 20, left: 110 };
    const racesLegend = [
        "White",
        "Black",
        "Native Indian or Alaska Native",
        "Asian",
        "Native Hawaiian or Pacific Islander",
        "Other Race Alone",
        "Two or More Races",
        "Hispanic or Latino"
    ];
    const racesDataAttr = [
        "white_alone",
        "black_alone",
        "native_alone",
        "asian_alone",
        "native_hawaiian_pacific_islander",
        "some_other_race_alone",
        "two_or_more",
        "hispanic_or_latino"
    ];

    // transformed data used by scatterplot
    let graphValues: {
        race: string;
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
                for (const county_race of racesDataAttr) {
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

    // scales
    let yExtent = $derived(
        extent(graphValues, (d) => {
            return d.median_housing;
        }) as [number, number]
    );
    let yRange = $derived(yExtent[1] - yExtent[0]);
    let yTicks = $derived([
        Math.round(yExtent[0]),
        Math.round(yExtent[0] + yRange * 0.2),
        Math.round(yExtent[0] + yRange * 0.4),
        Math.round(yExtent[0] + yRange * 0.6),
        Math.round(yExtent[0] + yRange * 0.8),
        Math.round(yExtent[1])
    ]);
    let yScale = $derived(
        scaleLog()
            .domain(yExtent)
            .range([height - chartMargins.bottom, chartMargins.top])
    );
    const xTicks = [0, 20, 40, 60, 80, 100];
    const xScale = scaleSqrt()
        .domain([0, 100])
        .range([chartMargins.left, width - chartMargins.right]);

    // color
    const point_colors = scaleOrdinal<string, string, never>()
        .range([
            "#1f77b4",
            "#ff7f03",
            "#2ca02c",
            "#d62728",
            "#9467bd",
            "#8c564b",
            "#e377c2",
            "#7f7f7f"
        ])
        .domain(racesLegend);

    // race filtering
    let filter_race = $state("");

    function raceFiltering(race : string) {
        if (filter_race === race) {
            filter_race = "";
        } else {
            filter_race = race;
        }
    }

</script>

<div class="flex items-center gap-2">
    <svg
        width={width + chartMargins.left + chartMargins.right}
        height={height + chartMargins.top + chartMargins.bottom}
    >
    <!-- Draw Circle for Each Point -- Y-Value = Median Income & X = Func Call  -->
        {#each graphValues as data_point, idx (idx)}
            {#if filter_race === "" || data_point.race === filter_race}
                <circle
                    cx={xScale(data_point.race_percent)}
                    cy={yScale(data_point.median_housing)}
                    r="5"
                    fill={point_colors(data_point.race)}
                    opacity="1"
                />
            {/if}
        {/each}

        <!-- Adding Axis -->
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
                    <text class="x-axis-tick" y="20" x="-6">
                        {x_val}
                    </text>
                </g>
            {/each}
        </g>
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
                    <text class="y-axis-tick" x="35" y="0">
                        {y_val}
                    </text>
                </g>
            {/each}
        </g>
    </svg>

    <!-- Chart Legend -->
    <div class="-ml-20 pr-5">
        <ul class="flex flex-col gap-1.25">
            {#each racesLegend as race, idx (idx)}
                <li>
                    <button class="flex items-center cursor-pointer" onclick={() => raceFiltering(racesDataAttr[idx])} >
                        <div
                            class="mr-2 h-4 w-4 shrink-0 rounded-full"
                            style="background-color: {point_colors(race)};"
                        ></div>
                        <text class="">{race}</text>
                    </button>
                </li>
            {/each}
        </ul>
    </div>
</div>

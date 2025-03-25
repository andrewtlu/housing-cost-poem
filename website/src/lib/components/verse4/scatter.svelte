<script lang="ts">
    import { data, type County, type CountyRaces } from "$lib/data";
    import { extent, scaleLog, scaleSqrt, scaleOrdinal } from "d3";
    import { onMount } from "svelte";

    let graph_values: {
        race: string;
        median_housing: number;
        race_percent: number;
        county_name: string;
        city_name: string;
    }[] = $state([]);

    // chart data
    const chartWidth = 700;
    const chartHeight = 500;
    const chartMargins = { top: 20, right: 5, bottom: 20, left: 110 };
    const races_legend = [
        "White",
        "Black",
        "Native Indian or Alaska Native",
        "Asian",
        "Native Hawaiian or Pacific Islander",
        "Other Race Alone",
        "Two or More Races",
        "Hispanic or Latino"
    ];
    const races_data_attr = [
        "white_alone",
        "black_alone",
        "native_alone",
        "asian_alone",
        "native_hawaiian_pacific_islander",
        "some_other_race_alone",
        "two_or_more",
        "hispanic_or_latino"
    ];
    const centroid_values: {
        race: string;
        avg_median_housing: number;
        avg_race_percent: number;
    }[] = $derived(
        // Populates 'centroid_values'
        (() => {
            const centroids = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ];
            const race_tallies = [0, 0, 0, 0, 0, 0, 0, 0];
            // Iterate Graph Values & Populate Totals (used to calculate centroids)

            for (const data_point of graph_values) {
                const race = races_data_attr.indexOf(data_point.race);
                race_tallies[race]++; // increment
                centroids[race][0] += data_point.median_housing;
                centroids[race][1] += data_point.race_percent;
            }

            return centroids.map((centroid, idx) => ({
                race: races_legend[idx],
                avg_median_housing: centroid[0] / race_tallies[idx],
                avg_race_percent: centroid[1] / race_tallies[idx]
            }));
        })()
    );

    let y_extent = $derived(
        extent(graph_values, (d) => {
            return Number(d.median_housing);
        }) as [number, number]
    );

    let y_range = $derived(y_extent[1] - y_extent[0]);

    let y_scale = $derived([
        Math.round(y_extent[0]),
        Math.round(y_extent[0] + y_range * 0.2),
        Math.round(y_extent[0] + y_range * 0.4),
        Math.round(y_extent[0] + y_range * 0.6),
        Math.round(y_extent[0] + y_range * 0.8),
        Math.round(y_extent[1])
    ]);

    let x_scale = [0, 20, 40, 60, 80, 100];

    // Calculate Race Percentages
    const race_percent_calc = (county: County, trait: CountyRaces) => {
        return (county[trait] / county["total_population"]) * 100;
    };

    // Populates 'graph_values'
    onMount(() => {
        if (data) {
            const temp_graph_values = [];
            // for each race, add the race, median housing, race_percent
            for (const county of data.values()) {
                for (const county_race of races_data_attr) {
                    temp_graph_values.push({
                        race: county_race,
                        median_housing: county.median_home_value,
                        race_percent: race_percent_calc(county, county_race),
                        county_name: county.county,
                        city_name: county.city
                    });
                }
            }
            graph_values = temp_graph_values;
        }
    });

    // Scale Functions (X & Y)
    const xScale = scaleSqrt()
        .domain([0, 100])
        .range([chartMargins.left, chartWidth - chartMargins.right]);

    let yScale = scaleLog();

    $effect(() => {
        yScale = scaleLog()
            .domain(y_extent)
            .range([chartHeight - chartMargins.bottom, chartMargins.top]);
    });

    // Sets Data Point Color Scale
    const point_colors = scaleOrdinal()
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
        .domain(races_legend);
</script>

<div class="flex items-center gap-2">
    <svg
        width={chartWidth + chartMargins.left + chartMargins.right}
        height={chartHeight + chartMargins.top + chartMargins.bottom}
    >
        <!-- Draw Circle for Each Point -- Y-Value = Median Income & X = Func Call  -->
        {#each graph_values as data_point, idx (idx)}
            <circle
                cx={xScale(data_point.race_percent)}
                cy={yScale(data_point.median_housing)}
                r="5"
                fill={point_colors(data_point.race)}
                opacity="0.4"
            />
        {/each}

        <!-- Adding Axis -->
        <g class="axis x-axis">
            <line
                x1={chartMargins.left}
                y1={chartHeight - chartMargins.bottom}
                x2={chartWidth - chartMargins.right}
                y2={chartHeight - chartMargins.bottom}
                stroke="black"
                stroke-width="3"
            />
            <text
                class="x-axis_label"
                x={chartWidth / 2}
                y={chartHeight + 30}
                font-size="15px"
                text-anchor="middle"
            >
                Percent of Total Population (%)
            </text>
            {#each x_scale as x_val, idx (idx)}
                <g transform="translate({xScale(x_val)}, {chartHeight - chartMargins.bottom})">
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
                y2={chartHeight - chartMargins.bottom}
                stroke="black"
                stroke-width="3"
            />
            <text
                class="y-axis_label"
                transform="rotate(-90)"
                x={-chartHeight / 2}
                y={chartMargins.left - 95}
                font-size="15px"
                text-anchor="middle"
            >
                Median House Value ($)
            </text>
            {#each y_scale as y_val, idx (idx)}
                <g transform="translate(0, {yScale(y_val)})">
                    <text class="y-axis-tick" x="35" y="0">
                        {y_val}
                    </text>
                </g>
            {/each}
        </g>

        <!-- Draw Centroids -->
        {#each centroid_values as centroid_points, idx (idx)}
            <circle
                cx={xScale(centroid_points.avg_race_percent)}
                cy={yScale(centroid_points.avg_median_housing)}
                r="10"
                fill={point_colors(centroid_points.race)}
                stroke="black"
                stroke-width="2"
                opacity="0.75"
            />
        {/each}
    </svg>

    <!-- Chart Legend -->
    <div style="margin-left: -90px; padding-right: 20px; width: 250px; margin-top: -250px">
        <ul class="w-30 text-sm">
            {#each races_legend as race, idx (idx)}
                <li class="flex items-start">
                    <div
                        class="rounded-full"
                        style="background-color: {point_colors(
                            race
                        )}; width: 15px; height: 15px; margin-right: 10px; flex-shrink: 0;"
                    ></div>
                    <text style="white-space: nowrap">{race}</text>
                </li>
            {/each}
        </ul>
    </div>
</div>

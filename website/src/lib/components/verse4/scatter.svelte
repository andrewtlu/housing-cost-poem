<!-- TODO: 
    - Make Data Points Hoverable (2)
    - xTICKS (3)
    - Grey Out Legend...?
    - Line of Best Fit (4)

    - Transitions?
    - Console Errors?
-->

<script lang="ts">
    import { data, type CountyRaces } from "$lib/data";
    import { extent, scaleLog, scaleSqrt, scaleOrdinal, filter } from "d3";

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

    // race filtering
    let filter_race = $state("");

    function raceFiltering(race : string) {
        if (filter_race === race) {
            filter_race = "";
        } else {
            filter_race = race;
        }
    }

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

    let xScale = $derived((() => {
        const graphValues_filtered = graphValues.filter( (d) => {
            if (filter_race !== "") {
                return d.race === filter_race;
            } else {
                return true;
            }
         });

        let xExtent;
        if (filter_race === "") {
            xExtent = [0,100];
        } else {
            xExtent = extent(graphValues_filtered, (d) => d.race_percent) as [number, number];
        }
        
        return scaleSqrt()
            .domain(xExtent)
            .range([chartMargins.left, width - chartMargins.right]);
    })());

    // const xScale = scaleSqrt()
    //     .domain([0,100])
    //     .range([chartMargins.left, width - chartMargins.right]);

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

</script>

<div class="relative flex items-center gap-2">
    <svg
        width={width + chartMargins.left + chartMargins.right}
        height={height + chartMargins.top + chartMargins.bottom}
    >
    <!-- Draw Circle for Each Point -- Y-Value = Median Income & X = Func Call  -->
        {#each graphValues as data_point, idx (idx)}
            {#if filter_race === "" || data_point.race === filter_race}
                <!-- <div> -->
                    <circle
                        cx={xScale(data_point.race_percent)}
                        cy={yScale(data_point.median_housing)}
                        r="5"
                        fill={point_colors(data_point.race)}
                        opacity="1"
                    />
                <!-- </div> -->
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
        {#if filter_race === ""}
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
        {:else}
            {#each racesLegend as race, idx (idx)}
                    <li>
                        <button 
                            class="flex items-center cursor-pointer" 
                            style="opacity: {filter_race === racesDataAttr[idx]  || filter_race === "" ? 1 : 0.4};" 
                            onclick={() => raceFiltering(racesDataAttr[idx])} > 
                            <div
                                class="mr-2 h-4 w-4 shrink-0 rounded-full"
                                style="background-color: {point_colors(race)};"
                            ></div>
                            <text class="">{race}</text>
                        </button>
                    </li>       
            {/each}
        {/if}
        </ul>
    </div>

    <!-- Chart Tooltip -->
    <div 
        class="tooltip tooltip-left absolute bottom-5 right-5 rounded-full hover:cursor-pointer" 
        data-tip=
        {
            "Select Races from Legend to Filter the Graph." +
            "\nSelect the Same Race Again to Return Graph to Original State (Showing All Races)"
        }
        > 
        
        <svg  
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
            width="25px"
            height="25px"
            viewBox="0 0 488.484 488.484"
            xml:space="preserve"
        >
        <g>
            <g>
                <path
                    d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244
                c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619
                c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375
                C413.627,337.641,337.637,413.619,244.236,413.619z"
                />
                <path
                    d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735
                c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z"
                />
                <path
                    d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092
                c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z"
                />
            </g>
        </g>
    </svg>
    </div>
</div>

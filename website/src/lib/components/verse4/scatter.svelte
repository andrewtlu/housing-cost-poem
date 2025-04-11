<!-- TODO: 
    (Text Andrew - ToolTip Text, Legend, Dark Mode, Make Nav Triangle Larger (easier to navigate with), Sunrise on Last Verse (No Graph, Center Style Text))
-->

<script lang="ts">
    import { data, type CountyRaces } from "$lib/data";
    import { extent, scaleSqrt, scaleOrdinal, scaleLinear } from "d3";
    import { fade } from "svelte/transition";

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
    const yTicks = [0, 86500, 246500, 406500, 566500, 726500, 886500, 1100000];
    const yTicks_formatted = ["0", "86,500", "246,500", "406,500", "566,500", "726,500", "886,500", "1,100,000"];
    let yScale = $derived(
        scaleLinear()
            .domain([0, 1100000])
            .range([height - chartMargins.bottom, chartMargins.top])
    );

    let xExtent = $derived.by(() => {
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

        return xExtent;
    })

    let xTicks = $derived.by(() => {
        const tickScale = scaleLinear().domain(xExtent).range([chartMargins.left, width - chartMargins.right])
        const interval = (xExtent[1] - xExtent[0]) / 5
        return [xExtent[0], xExtent[0]+interval, xExtent[0]+interval*2, xExtent[0]+interval*3, xExtent[0]+interval*4, xExtent[1]]
    });

    let xScale = $derived(scaleSqrt()
            .domain(xExtent)
            .range([chartMargins.left, width - chartMargins.right]));

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

    // hovering state
    let hover = $state(-1);
</script>


<div class="relative flex items-center gap-2">
    <svg
        width={width + chartMargins.left + chartMargins.right}
        height={height + chartMargins.top + chartMargins.bottom}
    >
        <!-- x-axis -->
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
                    <text class="x-axis-tick" y="20" x="-6" transition:fade ={{duration: 500}}>
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
                        y2={height-chartMargins.bottom}
                        stroke="#d4d4d4" 
                        style="stroke-dasharray: 2;" 
                        transition:fade ={{duration: 500}}
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
                        fill={point_colors(data_point.race)}
                        opacity="1"
                        transition:fade ={{duration: 500}}
                        onmouseover={
                            () => {
                                hover=idx;
                            }
                        }
                        onmouseleave={
                            () => {
                                hover=-1;
                            }
                        }
                    />
            {/if}
        {/each}
    
        {#if hover != -1}
            <g>
                <rect
                    x={xScale(graphValues[hover].race_percent)} 
                    y={yScale(graphValues[hover].median_housing)}
                    width=230
                    height=50
                    stroke="black"
                    stroke-width=2
                    fill="white"
                />
                <text
                    x={xScale(graphValues[hover].race_percent) + 5} 
                    y={yScale(graphValues[hover].median_housing) + 15}
                    text-anchor="left"
                    font-size=12
                    fill="black"
                >
                    Race: {racesLegend[racesDataAttr.indexOf(graphValues[hover].race)]}
                </text>
                <text
                    x={xScale(graphValues[hover].race_percent) + 5} 
                    y={yScale(graphValues[hover].median_housing) + 30}
                    text-anchor="left"
                    font-size=12
                    fill="black"
                >
                    Population %: {graphValues[hover].race_percent.toFixed(2)}
                </text>
                <text
                    x={xScale(graphValues[hover].race_percent) + 5} 
                    y={yScale(graphValues[hover].median_housing) + 45}
                    text-anchor="left"
                    font-size=12
                    fill="black"
                >
                    Median Housing $: {graphValues[hover].median_housing}
                </text>
            </g>
        {/if}
    

        <!-- y axis -->
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
                        {yTicks_formatted[idx]}
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
            "\nSelect the Same Race Again to Return Graph to Original State (Showing All Races)." + 
            "\n Hover Over Data Points for More In-Depth Information"
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

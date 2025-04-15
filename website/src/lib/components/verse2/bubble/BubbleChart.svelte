<script lang="ts">
    import { scaleLinear, scaleOrdinal } from "d3-scale";
    import { educationData, type MetroEducation } from "$lib/data";
    import { arc, ascending, extent, pie, type PieArcDatum } from "d3";
    import { Info, Title } from "$lib/components/chart-common";
    import { Tween } from "svelte/motion";
    import { duration } from "$lib/navListeners";
    import { cubicInOut } from "svelte/easing";
    import { onMount } from "svelte";
    import { hoverState, setHover } from "./store.svelte";

    let data: MetroEducation[] = educationData;
    // helper function to query info given a metro area
    const popFromMetro = (area: string) => {
        const idx = data.findIndex((v) => v.metro_area == area);
        return data[idx].total_population;
    };
    const homeFromMetro = (area: string) => {
        const idx = data.findIndex((v) => v.metro_area == area);
        return data[idx].median_home_value;
    };
    const incomeFromMetro = (area: string) => {
        const idx = data.findIndex((v) => v.metro_area == area);
        return data[idx].median_income;
    };

    // prepped data for the pie charts
    // value field should be out of 100
    type PieData = {
        metro_area: string;
        median_home_value: number;
        median_income: number;
        total_population: number;
        education_type: string;
        value: number;
    };
    // [0] is without, [1] is with
    const educationTypes = ["W/out College Degree", "W College Degree"];

    // animate tween property
    const openAnimationPercentage = new Tween(0, {
        duration: duration * 4,
        easing: cubicInOut
    });
    onMount(() => {
        openAnimationPercentage.set(2 * Math.PI);
    });

    // graph properties
    const width = 820;
    const height = 660;
    /* padding between svg and axes */
    const padding = { top: 50, right: 50, bottom: 50, left: 50 };

    // axes
    const xTicks = [0, 200000, 400000, 600000, 800000];
    const yTicks = [0, 50000, 100000];

    // scales
    // note to future: this is jank, but we precalculate xTicks and yTicks :(
    const xScale = scaleLinear()
        .domain(extent(xTicks) as [number, number])
        .range([padding.left, width - padding.right]);
    const yScale = scaleLinear()
        .domain(extent(yTicks) as [number, number])
        .range([height - padding.bottom, padding.top]);
    const rScale = scaleLinear()
        .domain(extent([0, ...data.map((d) => d.total_population)]) as [number, number])
        .range([5, 80]);
    const pieColor = scaleOrdinal<string>()
        .domain(educationTypes)
        .range(["var(--color-sun-inner)", "var(--color-sun-outer)"]); // 4-year degree vs. not

    const pieGenerator = pie<PieData>()
        .value((d) => d.value)
        .sort((a, b) => ascending(a.education_type, b.education_type));
    let metroPieData = $derived.by(() => {
        // key is the metro area, value is the pieGenerator
        const pieDataPerMetro: { [key: string]: PieArcDatum<PieData>[] } = {};

        // load prepped data
        const dataPrepped = [];
        for (const education of data) {
            dataPrepped.push(
                {
                    metro_area: education.metro_area,
                    median_home_value: education.median_home_value,
                    median_income: education.median_income,
                    total_population: education.total_population,
                    education_type: educationTypes[1],
                    value: education.education_attainment
                },
                {
                    metro_area: education.metro_area,
                    median_home_value: education.median_home_value,
                    median_income: education.median_income,
                    total_population: education.total_population,
                    education_type: educationTypes[0],
                    value: 100 - education.education_attainment
                }
            );
        }

        // create pie generator for each metro area
        for (const point of data) {
            const pieData = dataPrepped.filter((d) => d.metro_area == point.metro_area);
            pieDataPerMetro[point.metro_area] = pieGenerator(pieData);
        }
        return pieDataPerMetro;
    });
    const arcGenerator = arc<PieArcDatum<PieData>>()
        .innerRadius(0)
        .outerRadius((d) => rScale(d.data.total_population));

    // hover handling
    let hover = $derived(hoverState[0]);
    const onHover = (metro: string) => setHover(metro);
</script>

<div class="bg-moon-light/95 relative flex flex-col overflow-x-clip rounded-md font-bold">
    <Title title="Proportion of Metro Area w/ College Degree or Equivalent" />
    <Info
        tooltip="Mouse over a pie chart to view specific stats!  Data collected from US Census Bureau, censusreporter.org, and Logan et al.'s Longitudinal Tract Data Base (2000) and compiled on Kaggle."
        top={true}
    />

    <svg id="bubble-chart" {width} {height}>
        <!-- axes -->
        <g>
            {#each yTicks as tick, i (i)}
                <g transform="translate(30, {yScale(tick)})">
                    <line
                        x1="0"
                        x2={xScale(xTicks[xTicks.length - 1]) - 30}
                        style="stroke: var(--color-moon-dark); stroke-dasharray: 2;"
                    />
                    <text y="-4" class="text-center text-sm"
                        >{`$${tick.toLocaleString("en-US")}`}</text
                    >
                </g>
            {/each}
        </g>
        <g>
            {#each xTicks as tick, i (i)}
                <g transform="translate({xScale(tick)}, {height - padding.bottom})">
                    <line y2="6" style="stroke: var(--color-moon-dark); stroke-dasharray: 2;" />
                    <line
                        y1="0"
                        y2="-{height - padding.bottom - padding.top}"
                        style="stroke: var(--color-moon-dark); stroke-dasharray: 2;"
                    />
                    <text x="0" y="20" text-anchor="middle" class="text-center text-sm"
                        >{`$${tick.toLocaleString("en-US")}`}</text
                    >
                </g>
            {/each}
        </g>
        <!-- labels (don't ask me why this works but it does) -->
        <text
            x={-height / 2}
            y={padding.left / 2}
            text-anchor="middle"
            transform="rotate(-90)"
            class="text-center text-sm"
        >
            Median Income ($)
        </text>
        <text
            x={width / 2 - padding.right}
            y={height - padding.bottom + 40}
            class="text-center text-sm"
        >
            Median Housing Value ($)
        </text>

        <!-- legend -->
        <g class="legend" transform="translate({width / 2 + padding.left}, {height / 2})">
            <g transform="translate(55, 100)">
                <!-- bg rectangle -->
                <rect
                    x="-8"
                    y="-5"
                    width="145"
                    height="133"
                    fill="var(--color-moon-light)"
                    stroke="var(--color-midnight)"
                    stroke-width="1"
                    rx="5"
                    ry="5"
                />
                <circle cx="0" cy="5" r="5" fill="var(--color-sun-inner)" />
                <text x="10" y="10" font-size="12px">
                    <tspan x="10" dy="0">Population without</tspan>
                    <tspan x="10" dy="15">a 4 Year College</tspan>
                    <tspan x="10" dy="15">Degree or Equivalent</tspan>
                    <tspan x="10" dy="15">by Metro Area</tspan>
                </text>
                <circle cx="0" cy="70" r="5" fill="var(--color-sun-outer)" />
                <text x="10" y="75" font-size="12px">
                    <tspan x="10" dy="0">Population with 4 Year</tspan>
                    <tspan x="10" dy="15">College Degree Or</tspan>
                    <tspan x="10" dy="15">Equivalent by Metro</tspan>
                    <tspan x="10" dy="15">Area</tspan>
                </text>
            </g>
        </g>

        <!-- masks for intro opening animation -->
        <!-- <defs>
            {#each Object.keys(metroPieData) as key, idx (idx)}
                {#each metroPieData[key] as data, idx (idx)}
                    <mask id="mask-{idx}">
                        <circle r={rScale(data.data.value)} fill="white" />
                        <path rx={rScale(data.data.value)} fill="black" transform="rotate(-90)" />
                    </mask>
                {/each}
            {/each}
        </defs> -->

        <!-- bubbles -->
        {#each Object.keys(metroPieData) as key, idx (idx)}
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <g
                transform="translate({xScale(homeFromMetro(key))}, {yScale(incomeFromMetro(key))})"
                onmouseenter={() => onHover(key)}
                onmouseleave={() => onHover("")}
                style="transition: all .4s ease"
                opacity={hover == "" || hover == key ? "1" : "0.25"}
            >
                {#each metroPieData[key] as data, idx (idx)}
                    <path
                        pointer-events="all"
                        cursor="pointer"
                        d={arcGenerator(data)}
                        stroke="none"
                        stroke-width="2"
                        style="transition: all .4s ease"
                        fill={pieColor(data.data.education_type)}
                        transform={hover == key && data.data.education_type == educationTypes[1]
                            ? `translate(${rScale(data.data.total_population) / 10}, -${rScale(data.data.total_population) / 10})`
                            : ""}
                    />
                    {#if hover == key && data.data.education_type == educationTypes[1]}
                        <text
                            x={rScale(data.data.total_population) + 25}
                            y={0.6 * -rScale(data.data.total_population) + 8}
                            text-anchor="middle"
                            class="text-sm font-bold"
                        >
                            {data.data.value.toLocaleString("en-US")}%
                        </text>
                        <text
                            x={rScale(data.data.total_population) + 25}
                            y={0.6 * -rScale(data.data.total_population) - 8}
                            text-anchor="middle"
                            cursor="default"
                            class="text-sm font-light"
                        >
                            {Math.round(
                                (data.data.total_population * data.data.value) / 100
                            ).toLocaleString("en-US")}
                        </text>
                    {/if}
                {/each}
                <text
                    y={rScale(popFromMetro(key)) + 15}
                    x="0"
                    text-anchor="middle"
                    cursor="default"
                    class="text-sm font-light"
                >
                    {key}
                </text>
                {#if hover == key}
                    <text
                        y={rScale(popFromMetro(key)) + 32}
                        x="0"
                        text-anchor="middle"
                        cursor="default"
                        class="text-sm font-light"
                    >
                        Population: {popFromMetro(key).toLocaleString("en-US")}
                    </text>
                {/if}
            </g>
        {/each}
    </svg>
</div>

<script lang="ts">
    import { scaleLinear } from "d3-scale";
    import { educationData, type MetroEducation } from "$lib/data";
    import { arc, extent, pie, type PieArcDatum } from "d3";
    import { Info, Title } from "$lib/components/chart-common";
    import { onMount } from "svelte";

    let data: MetroEducation[] = educationData;

    // prepped data for the pie charts
    // value field should be out of 100
    type PieData = {
        metro_area: string;
        total_population: number;
        education_type: string;
        value: number;
    };
    let dataPrepped = $state<PieData[]>([]);

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
        .range([0, 80]);
    // const pieColor = d3.scaleLinear<string>().domain([0, 1]).range(["lightgray", "darkgreen"]); // 4-year degree vs. not

    // TODO: all data is being conglomerated into the same pie shart, need a separate pieData for each metro area
    const pieGenerator = pie<PieData>().value((d) => d.value);
    let pieData = $derived(pieGenerator(dataPrepped));
    const arcGenerator = arc<PieArcDatum<PieData>>()
        .innerRadius(0)
        .outerRadius((d) => rScale(d.data.total_population));

    // $inspect(pieData).with(console.log);

    onMount(() => {
        dataPrepped = [];
        for (const education of data) {
            dataPrepped.push(
                {
                    metro_area: education.metro_area,
                    total_population: education.total_population,
                    education_type: "W/ College Degree",
                    value: education.education_attainment
                },
                {
                    metro_area: education.metro_area,
                    total_population: education.total_population,
                    education_type: "W/out College Degree",
                    value: 100 - education.education_attainment
                }
            );
        }
    });
</script>

<div class="bg-moon-light/95 relative flex flex-col overflow-x-clip rounded-md font-bold">
    <Title title="Proportion of Metro Area w/ College Degree or Equivalent" />
    <Info tooltip="todo" top={true} />

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
                    height="100"
                    fill="white"
                    stroke="black"
                    stroke-width="1"
                    rx="5"
                    ry="5"
                />
                <circle cx="0" cy="5" r="5" fill="steelblue" />
                <text x="10" y="10" font-size="12px">
                    <tspan x="10" dy="0">Population by Metro</tspan>
                    <tspan x="10" dy="15">Area </tspan>
                </text>
                <circle cx="0" cy="40" r="5" fill="darkgreen" />
                <text x="10" y="40" font-size="12px">
                    <tspan x="10" dy="0">Population with 4 Year</tspan>
                    <tspan x="10" dy="15"> College Degree Or</tspan>
                    <tspan x="10" dy="15"> Equivalent by Metro</tspan>
                    <tspan x="10" dy="15"> Area</tspan>
                </text>
            </g>
        </g>

        {#if dataPrepped.length > 0}
            <g transform="translate({width / 2}, {height / 2})">
                <path
                    pointer-events="all"
                    cursor="pointer"
                    d={arcGenerator(pieData[4])}
                    stroke="none"
                    stroke-width="2"
                    fill="#FFF84A"
                />
            </g>
        {/if}

        <!-- {#each pieData as data, idx (idx)}
            <path
                pointer-events="all"
                cursor="pointer"
                d={arcGenerator(data.data.)}
                stroke="none"
                stroke-width="2"
                fill={pieColor(data.)}
            />
            <text
                x="0"
                y="0"
                text-anchor="middle"
                font-size="0.8em"
                class="fill-gray-100"
                transform="translate({labelArcs.centroid(d).join(' ')})"
                >{d.data.type}
            </text>
            <text
                x="0"
                y="1.2em"
                text-anchor="middle"
                font-size="0.8em"
                font-weight="700"
                class="fill-gray-100"
                transform="translate({labelArcs.centroid(d).join(' ')})"
                >{d.data.value + " kg"}
            </text>
        {/each} -->
    </svg>
</div>

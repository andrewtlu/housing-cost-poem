<script lang="ts">
    import { scaleLinear } from "d3-scale";

    // 1. Basic Setup: Get the data
    let points = $state([
        { year: 1990, birthrate: 6.7 },
        { year: 1995, birthrate: 4.6 },
        { year: 2000, birthrate: 14.4 },
        { year: 2005, birthrate: 18 },
        { year: 2010, birthrate: 7 },
        { year: 2015, birthrate: 12.4 },
        { year: 2020, birthrate: 17 },
        { year: 2025, birthrate: 10.9 },
        { year: 2030, birthrate: 8 },
        { year: 2035, birthrate: 12.9 }
    ]);

    // 2. Dimensions, Margins & Scales
    const yTicks = [0, 5, 10, 15, 20];
    const padding = { top: 20, right: 15, bottom: 20, left: 25 };

    let width = $state(500);
    let height = 350;

    let xScale = $derived(
        scaleLinear()
            .domain([0, points.length])
            .range([padding.left, width - padding.right])
    );

    let yScale = scaleLinear()
        .domain([0, Math.max.apply(null, yTicks)])
        .range([height - padding.bottom, padding.top]);

    let innerWidth = $derived(width - (padding.left + padding.right));
    let barWidth = $derived(innerWidth / points.length);

    // 3. Functions needed to create the Data elements or Helper functions, e.g d3.line d3.arc when needed
    function formatMobile(tick: number) {
        return "'" + tick.toString().slice(-2);
    }

    // 4. Create the main data elements (usually by iteration, using svelte each blocks)
</script>

<div class="bg-gray-400" bind:clientWidth={width}>
    <svg {width} {height}>
        <!-- 4. Design the bars -->
        <g class="bars">
            {#each points as point, i}
                <rect
                    x={xScale(i) + 2}
                    y={yScale(point.birthrate)}
                    width={barWidth * 0.9}
                    height={yScale(0) - yScale(point.birthrate)}
                />

                <!-- Circle showing the start of each Bar -->
                <circle cx={xScale(i) + 2} cy={yScale(point.birthrate)} fill="white" r="5" />
            {/each}
        </g>
        <!-- Design y axis -->
        <g class="axis y-axis">
            {#each yTicks as tick}
                <g class="tick tick-{tick}" transform="translate(0, {yScale(tick)})">
                    <line x2="100%" />
                    <text y="-4">{tick} {tick === 20 ? " per 1,000 population" : ""}</text>
                </g>
            {/each}
        </g>

        <!-- Design x axis -->
        <g class="axis x-axis">
            {#each points as point, i}
                <g class="tick" transform="translate({xScale(i)}, {height})">
                    <text x={barWidth / 2} y="-4">
                        {width > 380 ? point.year : formatMobile(point.year)}</text
                    >
                </g>
            {/each}
        </g>
    </svg>
</div>

<style>
    /* Note: for specifically styling graph elements, it may be easier to use plain CSS for better control */
    .x-axis .tick text {
        text-anchor: middle;
        color: white;
    }

    .bars rect {
        fill: #fcd34d;
        stroke: none;
    }

    .tick {
        font-family: Poppins, sans-serif;
        font-size: 0.725em;
        font-weight: 200;
        color: white;
    }

    .tick text {
        fill: white;
        text-anchor: start;
        color: white;
    }

    .tick line {
        stroke: #fcd34d;
        stroke-dasharray: 2;
        opacity: 1;
    }

    .tick.tick-0 line {
        display: inline-block;
        stroke-dasharray: 0;
    }
</style>

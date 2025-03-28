<script lang="ts">
    import { scaleBand, scaleLinear } from "d3-scale";
    import points from "./verse1_data.json";

    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];

    let data: {
        metro_area: string;
        median_housing_price: number;
        median_income: number;
        median_home_value_to_income: number;
        proportion_under_25: number;
    }[] = points;

    const xTicks = ["ATL", "BALT", "NYC", "SF", "DC"];
    const yTicks = ["$0", "$200,000", "$400,000", "$600,000", "$800,000", "$1,000,000"];
    const yTickValues = [0, 200000, 400000, 600000, 800000, 1000000];
    const y2Ticks = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]; // For percentage scale
    const padding = { top: 20, right: 50, bottom: 40, left: 50 };

    let width = $state(500);
    let height = 350;

    // scales
    let xScale = $derived(
        scaleBand()
            .domain(xTicks)
            .range([padding.left, width - padding.right])
            .padding(0.1)
    );
    // y-axis scale for the main bars (housing, income, home value)
    let yScale = scaleLinear()
        .domain([0, 1000000])
        .range([height - padding.bottom, padding.top]);
    // y2-axis scale for the "proportion_under_25" data
    let y2Scale = scaleLinear()
        .domain([0, 100])
        .range([height - padding.bottom, padding.top]);

    let barWidth = $derived(xScale.bandwidth() / 3);

    function formatMobile(tick: string) {
        return "'" + tick.slice(-2);
    }
</script>

<ul class="">
    {#each lines as line, index (index)}
        <li>
            {line}
        </li>
    {/each}
</ul>

<div class="bg-gray-100" bind:clientWidth={width}>
    <svg {width} {height}>
        <!-- Left Y-axis -->
        <g class="axis">
            {#each yTickValues as tick, i (i)}
                <g class="tick tick-{tick}" transform="translate(17, {yScale(tick)})">
                    <line x2="100%" />
                    <text y="-4" class="text-xs">{yTicks[i]}</text>
                    <!-- Display string tick from yTicks -->
                </g>
            {/each}
        </g>

        <!-- Right Y-axis for proportion_under_25 -->
        <g class="axis y2-axis" transform="translate({width - padding.right}, 0)">
            {#each y2Ticks as tick (tick)}
                <g class="tick tick-{tick}" transform="translate(0, {y2Scale(tick)})">
                    <line x2="100%" />
                    <text x="4" y="4" class="text-start text-xs text-green-700">{tick}%</text>
                </g>
            {/each}
        </g>

        <!-- X-axis -->
        <g class="axis x-axis">
            {#each xTicks as tick, i (i)}
                <g class="tick" transform="translate({xScale(tick)}, {height})">
                    <text class="text-start text-sm" x={barWidth} y="-20">
                        {width > 380 ? tick : formatMobile(tick)}
                    </text>
                </g>
            {/each}
        </g>
        <!-- Bars -->
        <g class="bars">
            {#each data as point, i (i)}
                <g>
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 0}
                        y={yScale(point.median_housing_price)}
                        width={barWidth * 0.9}
                        height={yScale(0) - yScale(point.median_housing_price)}
                    />
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 1}
                        y={yScale(point.median_income)}
                        width={barWidth * 0.9}
                        height={yScale(0) - yScale(point.median_income)}
                        fill="orange"
                    />
                    <rect
                        x={Number(xScale(xTicks[i])) + barWidth * 2}
                        y={y2Scale(point.proportion_under_25)}
                        width={barWidth * 0.9}
                        height={y2Scale(0) - y2Scale(point.proportion_under_25)}
                        fill="green"
                    />
                </g>
            {/each}
        </g>
        <!-- X-Axis Label -->
        <text
            x={width / 2}
            y={height - padding.bottom + 35}
            text-anchor="middle"
            class="text-center text-xs"
        >
            Metro Area
        </text>

        <!-- Y-Axis Label -->
        <text
            x={-height / 2}
            y={padding.left - 40}
            transform="rotate(-90)"
            text-anchor="middle"
            class="text-center text-xs"
        >
            Median Housing Price ($), Median Income ($)
        </text>

        <!-- Y2-Axis Label -->
        <text
            x={-height / 2}
            y={width - padding.right + 40}
            transform="rotate(-90)"
            text-anchor="middle"
            class="y2-label text-center text-xs"
        >
            Proportion Under 25 (%)
        </text>

        <!-- Legend -->
        <g class="legend" transform="translate({width - padding.right - 150}, {padding.top})">
            <!-- Proportion Under 25 -->
            <g transform="translate(0, 0)">
                <circle cx="0" cy="5" r="5" fill="green" />
                <text x="10" y="10" font-size="14px">Proportion Under 25</text>
            </g>

            <!-- Median Housing Price -->
            <g transform="translate(0, 20)">
                <circle cx="0" cy="5" r="5" fill="black" />
                <text x="10" y="10" font-size="14px">Median Housing Price</text>
            </g>

            <!-- Median Income -->
            <g transform="translate(0, 40)">
                <circle cx="0" cy="5" r="5" fill="orange" />
                <text x="10" y="10" font-size="14px">Median Income</text>
            </g>
        </g>
    </svg>
</div>

<style>
    .y2-axis text {
        fill: darkgreen;
    }
    .tick line {
        stroke: #e2e2e2;
        stroke-dasharray: 2;
    }
</style>

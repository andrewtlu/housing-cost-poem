<script lang="ts">
    import { scaleLinear, type ScaleLinear } from "d3-scale";
    import { onMount } from "svelte";

    let {
        color,
        width
    }: {
        color: ScaleLinear<string, string, never>;
        width: number;
    } = $props();
    let margin = { top: 5, left: 20, bottom: 5, right: 20 };

    let legendWidth = 150;
    let legendHeight = 60;
    let boxHeight = 15;

    let tickValues: { value: string; offset: number }[] = $state([]);
    let gradientStops: { offset: number; color: string }[] = $state([]);

    onMount(() => {
        const domain = color.domain();
        const range = color.range();
        gradientStops = range.map((color, i) => ({
            offset: (i / (range.length - 1)) * 100,
            color
        }));

        const scale = scaleLinear().domain(domain).range([0, width]);
        const ticks = [...scale.ticks(4)];
        ticks[0] = domain[0];
        ticks[ticks.length - 1] = domain[1];

        tickValues = ticks.map((tick) => ({
            value: `$${Math.round(tick / 1000)}k`,
            offset: (scale(tick) / width) * 100
        }));
    });
</script>

<svg
    fill="#000000"
    width={legendWidth + margin.left + margin.right}
    height={legendHeight + margin.top + margin.bottom}
>
    <!-- Gradient  -->
    <defs>
        <linearGradient id="gradient">
            {#each gradientStops as stop}
                <stop offset="{stop.offset}%" stop-color={stop.color} />
            {/each}
        </linearGradient>
    </defs>

    <!-- Axis -->
    <g transform="translate({margin.left}, {(legendHeight - boxHeight + margin.top) / 2})">
        <text dy="2.5em" text-anchor="start" fill="currentColor" class="font-medium"
            >Median House Value</text
        >
        <rect
            x="0"
            y="0"
            width={legendWidth}
            height={boxHeight}
            fill="url(#gradient)"
            class="gradient"
        />
        {#each tickValues as tick}
            <g transform="translate({(tick.offset * legendWidth) / 100}, -20)">
                <line y1="18" y2="15" stroke="gray" />
                <text
                    dy="1em"
                    text-anchor="middle"
                    font-size="12px"
                    fill="currentColor"
                    class="font-medium">{tick.value}</text
                >
            </g>
        {/each}
    </g>
</svg>

<!-- @component
legend for the map component; displays attribute name, color gradient, and gradient ticks
 -->
<script lang="ts">
    import { scaleLinear, type ScaleLinear } from "d3-scale";
    import { attributeMap, attributeState } from "./store.svelte";

    let {
        color,
        width
    }: {
        color: ScaleLinear<string, string, never>;
        width: number;
    } = $props();

    // svg info
    let margin = { top: 5, left: 20, bottom: 5, right: 20 };
    let legendWidth = $state(180);
    let legendHeight = 60;
    let boxHeight = 15;
    let tickValues: { value: string; offset: number }[] = $state([]);
    let gradientStops: { offset: number; color: string }[] = $state([]);

    const attribute = $derived(attributeState[0]);

    $effect(() => {
        // heuristic legend width
        legendWidth = 7 * attributeMap[attribute].textLabel.length + 10;

        const domain = color.domain();
        const range = color.range();
        gradientStops = range.map((color, i) => ({
            offset: (i / (range.length - 1)) * 100,
            color
        }));

        const scale = scaleLinear().domain(domain).range([0, width]);
        const interval = (domain[1] - domain[0]) / 3;
        const ticks = [domain[0], domain[0] + interval, domain[0] + interval * 2, domain[1]];

        tickValues = ticks.map((tick) => ({
            value: attributeMap[attribute].tickFormat(tick),
            offset: (scale(tick) / width) * 100
        }));
    });
</script>

{#key attribute}
    <div class="w-fit rounded-md border-2 border-[gray] bg-white/80 px-2">
        <svg
            fill="#000000"
            width={legendWidth + margin.left + margin.right}
            height={legendHeight + margin.top + margin.bottom}
        >
            <!-- gradient  -->
            <defs>
                <linearGradient id="gradient">
                    {#each gradientStops as stop (stop.offset)}
                        <stop offset="{stop.offset}%" stop-color={stop.color} />
                    {/each}
                </linearGradient>
            </defs>

            <!-- axis -->
            <g transform="translate({margin.left}, {(legendHeight - boxHeight + margin.top) / 2})">
                <!-- label -->
                <text
                    dy="2.5em"
                    transform="translate({legendWidth / 2}, 0)"
                    text-anchor="middle"
                    fill="currentColor"
                    class="font-medium">{attributeMap[attribute].textLabel}</text
                >

                <!-- color gradient -->
                <rect
                    x="0"
                    y="0"
                    width={legendWidth}
                    height={boxHeight}
                    fill="url(#gradient)"
                    class="gradient"
                />

                <!-- gradient markers -->
                {#each tickValues as tick (tick)}
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
    </div>
{/key}

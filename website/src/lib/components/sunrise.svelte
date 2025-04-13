<script lang="ts">
    import { getFramesCount, keyframe } from "$lib/keyframe.svelte";
    import { scalePow } from "d3";

    let container: Element | null = $state(null);

    // ending positions for sun
    let xPos = $state(0);
    let yPos = $state(0);

    $effect(() => {
        if (container) {
            xPos = container.clientWidth / 2;
            yPos = container.clientHeight / 4;
            rise = scalePow()
                .domain([0, getFramesCount() - 1])
                .range([container.clientHeight, 0])
                .exponent(4);
            size = scalePow()
                .domain([0, getFramesCount() - 1])
                .range([1, 2.5])
                .exponent(5);
        }
    });

    // sunrise
    let rise = $state(
        scalePow()
            .domain([0, getFramesCount() - 1])
            .range([0, 0])
    );
    let translateY = $derived(rise(keyframe.value));

    // refraction optical illusion size
    let size = $state(
        scalePow()
            .domain([0, getFramesCount() - 1])
            .range([0, 0])
    );
    let transformScale = $derived(size(keyframe.value));
</script>

<div
    class="pointer-events-none absolute top-0 z-40 h-screen w-screen overflow-hidden"
    bind:this={container}
>
    <!-- TODO: gradient background (dark blue to orange) -->
    <!-- palette: sunrise https://coolors.co/palette/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08 -->
    <!-- palette: sky https://coolors.co/palette/00072d-001c55-0a2472-0e6ba8-a6e1fa -->

    {#if container}
        <svg width={container.clientWidth} height={container.clientHeight}>
            <g
                transform={`translate(${xPos}, ${yPos + translateY}) scale(${transformScale})`}
                style="transition: all .5s ease;"
            >
                <circle fill="red" cx="0" cy="0" r={24}> </circle>
                <circle fill="orange" cx="0" cy="0" r={20}> </circle>
            </g>
        </svg>
    {/if}
</div>

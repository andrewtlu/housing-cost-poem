<script lang="ts">
    import { getFramesCount, keyframe } from "$lib/keyframe.svelte";
    import { interpolateRgbBasis, scaleLinear, scalePow } from "d3";

    // svg sizing
    let container: Element | null = $state(null);
    let width = $derived.by(() => {
        return container === null ? Infinity : container.clientWidth;
    });
    let height = $derived.by(() => {
        return container === null ? Infinity : container.clientHeight;
    });

    // helper variables
    let xPos = $state(0);
    let yPos = $state(0);
    const sunRadius = 40;
    const totalFrames = getFramesCount();
    const nonEndingFrameCount = totalFrames - getFramesCount(4);

    // sky color
    // 2 scales for more fine-grained control over color
    let sunDown = $state(interpolateRgbBasis(["#0e6ba8", "#030436"]));
    const sunDownScale = $state(
        scaleLinear()
            .domain([0, nonEndingFrameCount - 1])
            .range([0, 1])
    );
    let sunUp = $state(interpolateRgbBasis(["#030436", "#43afca", "#a6e1fa"]));
    const sunUpScale = $state(
        scaleLinear()
            .domain([nonEndingFrameCount, totalFrames - 1])
            .range([0, 1])
    );
    let skyColor = $derived.by(() => {
        if (keyframe.value < nonEndingFrameCount) return sunDown(sunDownScale(keyframe.value));
        else return sunUp(sunUpScale(keyframe.value));
    });

    // sunrise
    let rise = $state(
        scalePow()
            .domain([0, getFramesCount() - 1])
            .range([0, 0])
    );
    let translateY = $derived(rise(keyframe.value));

    // refraction optical illusion size
    const size = $state(
        scalePow()
            .domain([0, totalFrames - 1])
            .range([1, 2.5])
            .exponent(5)
    );
    let transformScale = $derived(size(keyframe.value));

    $effect(() => {
        if (container) {
            const styles = window.getComputedStyle(document.body);

            xPos = container.clientWidth / 2;
            yPos = container.clientHeight / 4;

            sunDown = interpolateRgbBasis([
                styles.getPropertyValue("--color-twilight"),
                styles.getPropertyValue("--color-midnight")
            ]);
            sunUp = interpolateRgbBasis([
                styles.getPropertyValue("--color-midnight"),
                styles.getPropertyValue("--color-dawn"),
                styles.getPropertyValue("--color-sunrise")
            ]);

            rise = scalePow()
                .domain([0, totalFrames - 1])
                .range([container.clientHeight, 0])
                .exponent(4);
        }
    });
</script>

<div
    class="pointer-events-none absolute top-0 -z-60 h-screen w-screen overflow-hidden"
    bind:this={container}
>
    <svg {width} {height}>
        <rect fill={skyColor} width="100%" height="100%" style="transition: all .5s ease;"> </rect>

        <!-- if statement prevents circle spawning in top left corner on page load -->
        {#if container}
            <g
                transform={`translate(${xPos}, ${yPos + translateY}) scale(${transformScale})`}
                style="transition: all .5s ease;"
            >
                <circle fill="var(--color-sun-outer)" cx="0" cy="0" r={sunRadius * 3}> </circle>
                <circle fill="var(--color-sun-mid)" cx="0" cy="0" r={sunRadius * 2}> </circle>
                <circle fill="var(--color-sun-inner)" cx="0" cy="0" r={sunRadius}> </circle>
            </g>
        {/if}
    </svg>
</div>

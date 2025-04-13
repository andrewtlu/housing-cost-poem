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
    let sunMoonRadius = $state(0);
    const transitionStyle = "transition: all .5s ease;";
    const sunRadius = 40;
    const moonRadius = 38;
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
    let sunUp = $state(interpolateRgbBasis(["#43afca", "#a6e1fa"]));
    const sunUpScale = $state(
        scaleLinear()
            .domain([nonEndingFrameCount, totalFrames - 1])
            .range([0, 1])
    );
    let skyColor = $derived.by(() => {
        if (keyframe.value < nonEndingFrameCount) return sunDown(sunDownScale(keyframe.value));
        else return sunUp(sunUpScale(keyframe.value));
    });

    // sun-moon rotation
    const nightRotateScale = $state(
        scaleLinear()
            .domain([0, nonEndingFrameCount - 1])
            .range([60, 160])
    );
    const dayRotateScale = $state(
        scaleLinear()
            .domain([nonEndingFrameCount, totalFrames - 1])
            .range([180, 240])
    );
    let rotate = $derived.by(() => {
        if (keyframe.value < nonEndingFrameCount) return nightRotateScale(keyframe.value);
        else return dayRotateScale(keyframe.value);
    });

    // grow sun on sunrise
    const size = $state(
        scalePow()
            .domain([0, totalFrames - 1])
            .range([1, 2.5])
            .exponent(5)
    );
    let transformScale = $derived.by(() => {
        if (keyframe.value < nonEndingFrameCount) return 0;
        else return size(keyframe.value);
    });

    $effect(() => {
        if (container) {
            const styles = window.getComputedStyle(document.body);

            xPos = container.clientWidth / 2;
            yPos = (container.clientHeight * 3) / 4;
            sunMoonRadius = (container.clientHeight * 3) / 4;

            sunDown = interpolateRgbBasis([
                styles.getPropertyValue("--color-twilight"),
                styles.getPropertyValue("--color-midnight")
            ]);
            sunUp = interpolateRgbBasis([
                styles.getPropertyValue("--color-dawn"),
                styles.getPropertyValue("--color-sunrise")
            ]);
        }
    });
</script>

<div
    class="pointer-events-none absolute top-0 -z-60 h-screen w-screen overflow-hidden"
    bind:this={container}
>
    <svg {width} {height}>
        <rect fill={skyColor} width="100%" height="100%" style={transitionStyle}> </rect>

        <!-- if statement prevents circle spawning in top left corner on page load -->
        {#if container}
            <g
                transform={`translate(${xPos}, ${yPos}) rotate(${rotate})`}
                style={transitionStyle}
                width={sunMoonRadius * 2}
                height={sunRadius}
            >
                <!-- sun -->
                <g
                    transform={`scale(${transformScale}) translate(${sunMoonRadius / 3}, 0)`}
                    style={transitionStyle}
                >
                    <circle fill="var(--color-sun-outer)" cx="0" cy="0" r={sunRadius * 3}> </circle>
                    <circle fill="var(--color-sun-mid)" cx="0" cy="0" r={sunRadius * 2}> </circle>
                    <circle fill="var(--color-sun-inner)" cx="0" cy="0" r={sunRadius}> </circle>
                </g>

                <!-- moon -->
                <g
                    transform={`translate(-${sunMoonRadius}, 0) ${keyframe.value >= nonEndingFrameCount ? "scale(0)" : "scale(1)"}`}
                    style={transitionStyle}
                >
                    <defs>
                        <mask id="moon">
                            <circle fill="white" cx="0" cy="0" r={moonRadius}> </circle>
                            <circle
                                fill="black"
                                cx={-moonRadius / 1.5}
                                cy={-moonRadius / 3}
                                r={moonRadius}
                            >
                            </circle>
                        </mask>
                    </defs>
                    <circle
                        fill="var(--color-moon)"
                        cx="0"
                        cy="0"
                        r={moonRadius}
                        mask="url(#moon)"
                        style={transitionStyle}
                        transform={`rotate(-${rotate})`}
                    >
                    </circle>
                </g>
            </g>
        {/if}
    </svg>
</div>

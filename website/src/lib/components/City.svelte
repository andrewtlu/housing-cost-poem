<!-- @component
Parallax component, used to render the city skyline in the background of the poem
 -->
<script lang="ts">
    import { base } from "$app/paths";
    import { getFramesCount, keyframe } from "$lib/keyframe.svelte";
    import { scaleLinear } from "d3";

    // simple logic: translate to however far in the poem the current keyframe is
    const translatePercentage = scaleLinear()
        .domain([0, getFramesCount() - 1])
        .range([0, 1]);
    // trust me the math works
    let translateXPercentage = $derived(25 - translatePercentage(keyframe.value) * 50);
</script>

<div class="absolute top-0 -z-50 h-screen w-screen overflow-hidden">
    <img
        src={`${base}/city.png`}
        alt="background parallax city"
        class="absolute bottom-0 left-0 -translate-y-1/2 scale-200"
        style={`transform: translateX(${translateXPercentage}%); transition: all .5s ease`}
    />
</div>

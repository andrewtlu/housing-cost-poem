<script lang="ts">
    import { Lines } from "$lib/components";
    import { selectedGraphState } from "./keyframe.svelte";

    let lines = [
        "Plans of school, moving downtown",
        "cut short. Finding no space within,",
        "they plea: “Just earn your pension!”",
        "For what? To be kept trapped therein?"
    ];

    let SelectedGraph = $derived(selectedGraphState[0]);
</script>

<Lines {lines} />

{#key SelectedGraph}
    {#if SelectedGraph}
        <SelectedGraph />
    {/if}
{/key}

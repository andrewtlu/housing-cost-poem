<script lang="ts">
    import { Lines } from "$lib/components";
    import { selectedGraphState } from "./keyframe.svelte";

    // dashes are em dashes and quotations are curled :)
    let lines = [
        "First, redlining carved us up;",
        "now, though, housing builds gaps—",
        "funny—our fathers’ missteps",
        "make funding fortune perhaps..."
    ];

    let SelectedGraph = $derived(selectedGraphState[0]);
</script>

<Lines {lines} />

<!-- TODO: maybe use snippets to wrap both graphs and shared elements so that less rerendering happens -->
{#key SelectedGraph}
    {#if SelectedGraph}
        <SelectedGraph />
    {/if}
{/key}

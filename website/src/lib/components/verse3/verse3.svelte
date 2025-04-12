<script lang="ts">
    import { getFrame, keyframe } from "$lib";
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

<ul>
    {#each lines as line, index (index)}
        <li
            title={line}
            class={`opacity-50 transition-all ${getFrame(keyframe.value).bolded.includes(index) ? "font-bold opacity-100" : ""}`}
        >
            {line}
        </li>
    {/each}
</ul>

{#key SelectedGraph}
    {#if SelectedGraph}
        <SelectedGraph />
    {/if}
{/key}

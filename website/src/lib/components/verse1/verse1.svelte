<script lang="ts">
    import { getFrame, keyframe } from "$lib/keyframe.svelte";
    import { fade } from "svelte/transition";
    import Example from "./example.svelte";
    import Example2 from "./example2.svelte";
    import { selectedGraph } from "./keyframe.svelte";

    // dashes are em dashes, and quotations are curled :)
    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];

    let graphs = [Example, Example2];
</script>

<ul class="">
    {#each lines as line, index (index)}
        <li
            title={line}
            class={`transition-all ${getFrame(keyframe.value).bolded.includes(index) ? "font-bold" : ""}`}
        >
            {line}
        </li>
    {/each}
</ul>

<div>
    {#each graphs as Graph, index (index)}
        {#if index == selectedGraph.value}
            <!-- ideally we'd use crossfade https://svelte.dev/tutorial/svelte/deferred-transitions and transition instead of just in -->
            <div in:fade>
                <Graph />
            </div>
        {/if}
    {/each}
</div>

<!-- https://stackoverflow.com/questions/5687035/css-bolding-some-text-without-changing-its-containers-size -->
<!-- may be better to make all text bold, and reduce opacity of non-emphasized text -->
<style>
    li::after {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 1px;
        color: transparent;
        overflow: hidden;
        visibility: hidden;
    }
</style>

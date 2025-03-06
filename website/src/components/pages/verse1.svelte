<script lang="ts">
    import type { Keyframes } from "$lib/keyframe";
    import Example from "../graphs/example.svelte";

    let { keyframe }: { keyframe: number } = $props();
    let keyframes: Keyframes = {
        frames: []
    };

    // dashes are em dashes, and quotations are curled :)
    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];
</script>

<ul>
    {#each lines as line, index}
        <li>{line}</li>
    {/each}
</ul>

<Example />

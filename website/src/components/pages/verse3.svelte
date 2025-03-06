<script lang="ts">
    import type { Keyframes } from "$lib/keyframe";

    let { keyframe }: { keyframe: number } = $props();
    let keyframes: Keyframes = {
        frames: []
    };

    // dashes are em dashes and quotations are curled :)
    let lines = [
        "First, redlining carved us up;",
        "now, though, housing builds gaps—",
        "funny—our fathers’ missteps",
        "make funding fortune perhaps..."
    ];
</script>

<ul>
    {#each lines as line, index}
        <li>{line}</li>
    {/each}
</ul>

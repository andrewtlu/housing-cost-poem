<script lang="ts">
    import type { Keyframes } from "$lib/keyframe";

    let { keyframe }: { keyframe: number } = $props();
    let keyframes: Keyframes = {
        frames: []
    };

    // quotations are curled :)
    let lines = [
        "...hopeless. Yet, hopes still remain.",
        "Though fate curses us to roam,",
        "shouldn’t we defy this harm,",
        "make plausible a path home?"
    ];
</script>

<ul>
    {#each lines as line, index}
        <li>{line}</li>
    {/each}
</ul>

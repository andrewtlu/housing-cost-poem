<script lang="ts">
    import type { Keyframes } from "$lib/keyframe";

    let { keyframe }: { keyframe: number } = $props();
    let keyframes: Keyframes = {
        frames: []
    };

    // quotations are curled :)
    let lines = [
        "Plans of school, moving downtown",
        "cut short. Finding no space within,",
        "they plea: “Just earn your pension!”",
        "For what? To be kept trapped therein?"
    ];
</script>

<ul>
    {#each lines as line, index}
        <li>{line}</li>
    {/each}
</ul>

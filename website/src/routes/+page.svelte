<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { getFrame, keyframe, overrideScroll } from "$lib";
    import { verses, Parallax, Nav } from "$lib/components";

    /** Main content DOM element */
    let content: Element | null = $state(null);

    let CurrentVerse = $derived(verses[getFrame(keyframe.value).verse as 0 | 1 | 2 | 3 | 4]);

    onMount(() => {
        return overrideScroll(content!);
    });
</script>

<Parallax />

<Nav />

<div
    class="relative flex h-screen flex-row overflow-x-hidden bg-gray-50/90"
    id="content"
    bind:this={content}
>
    <div
        class="flex h-screen w-screen shrink-0 snap-center flex-row items-center justify-center gap-24"
    >
        <CurrentVerse />
    </div>
</div>

<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { overrideScroll } from "$lib";
    import { Title, Verse1, Verse2, Verse3, Verse4, Parallax, Nav } from "$lib/components";

    /** Main content DOM element */
    let content: Element | null = $state(null);
    /** Tweened page scroll position value */
    let scrollPosition: ReturnType<typeof overrideScroll>["scrollPosition"];
    /** Unmount for scroll listener */
    let unmount: ReturnType<typeof overrideScroll>["unmount"];

    let verses = [Title, Verse1, Verse2, Verse3, Verse4];

    onMount(() => {
        // when mounted, content will not be null
        let override = overrideScroll(content!);
        scrollPosition = override.scrollPosition;
        unmount = override.unmount;

        return unmount;
    });

    // update content's scroll with scrollPosition, content won't be null
    $effect(() => {
        content!.scrollLeft = scrollPosition.current;
    });
</script>

{#if content}
    <Parallax scrollContainer={content} />
{/if}

<Nav />

<!-- Each element within this div MUST have w-screen due to the tweened scroll positioning -->
<div
    class="relative flex h-screen flex-row overflow-x-hidden bg-gray-50/90"
    id="content"
    bind:this={content}
>
    {#each verses as Verse, index (index)}
        <div
            class="flex h-screen w-screen shrink-0 snap-center flex-row items-center justify-center gap-24"
            id={index == 0 ? "title" : `verse${index}`}
        >
            <Verse />
        </div>
    {/each}
</div>

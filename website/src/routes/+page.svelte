<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { overrideScroll } from "$lib";
    import { Verse1, Verse2, Verse3, Verse4, Parallax } from "$lib/components";

    /** Main content DOM element */
    let content: Element | null = $state(null);
    /** Tweened page scroll position value */
    let scrollPosition: ReturnType<typeof overrideScroll>["scrollPosition"];
    /** Unmount for scroll listener */
    let unmount: ReturnType<typeof overrideScroll>["unmount"];

    let verses = [Verse1, Verse2, Verse3, Verse4];
    let keyframe = 0;

    onMount(() => {
        // when mounted, content will not be null
        let override = overrideScroll(content!, { keyframe });
        scrollPosition = override.scrollPosition;
        unmount = override.unmount;

        return unmount;
    });

    // update content's scroll with scrollPosition, content won't be null
    $effect(() => {
        content!.scrollLeft = scrollPosition.current;
    });

    // TODO: add scroll (button) bar
    // TODO: image scale may be broken on chrome, make sure to check
</script>

{#if content}
    <Parallax scrollContainer={content} />
{/if}

<!-- Each element within this div MUST have w-screen due to the tweened scroll positioning -->
<div
    class="relative flex h-screen flex-row overflow-x-hidden bg-gray-50/50"
    id="content"
    bind:this={content}
>
    <div class="flex h-screen w-screen shrink-0 flex-col items-center justify-center" id="title">
        <h1>Affording an Abode: Affordable Housing in Urban America</h1>
    </div>

    {#each verses as Verse, index (index)}
        <div
            class="flex h-screen w-screen shrink-0 snap-center flex-row items-center justify-center gap-24"
            id={`verse${index}`}
        >
            <Verse {keyframe} />
        </div>
    {/each}
</div>

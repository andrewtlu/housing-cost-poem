<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { duration, getFrame, keyframe, mountNav } from "$lib";
    import { verses, City, Sunrise, Navbar } from "$lib/components";
    import { quadInOut } from "svelte/easing";
    import { fly } from "svelte/transition";

    /** Main content DOM element */
    let content: Element | null = $state(null);

    let CurrentVerse = $derived(verses[getFrame(keyframe.value).verse as 0 | 1 | 2 | 3 | 4]);

    // mount navigation
    onMount(() => {
        return mountNav(content!);
    });
</script>

<!-- background elements -->
<City />
<Sunrise />

<!-- navigation bar -->
<Navbar />

<div
    class="relative grid h-screen w-screen place-items-center overflow-hidden"
    id="content"
    bind:this={content}
>
    <!-- jumping fix: https://pita.tech/transitioning-multiple-svelte-elements-on-the-same-spot/ -->
    {#key getFrame(keyframe.value).verse}
        <div
            class="col-[1] row-[1] flex flex-row items-center justify-center gap-12"
            in:fly={{
                x: keyframe.direction * content.clientWidth,
                easing: quadInOut,
                duration: duration
            }}
            out:fly={{
                x: keyframe.direction * -content.clientWidth,
                easing: quadInOut,
                duration: duration
            }}
        >
            <CurrentVerse />
        </div>
    {/key}
</div>

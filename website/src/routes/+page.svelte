<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import { duration, getFrame, keyframe, mountNav } from "$lib";
    import { verses, City, Sunrise, Nav } from "$lib/components";
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
<Nav />

<div
    class="relative flex h-screen w-screen shrink-0 flex-row items-center justify-center overflow-hidden bg-white/25"
    id="content"
    bind:this={content}
>
    <!-- jumping fix: https://pita.tech/transitioning-multiple-svelte-elements-on-the-same-spot/ -->
    <div class="grid place-items-center">
        {#key getFrame(keyframe.value).verse}
            <div
                class="col-[1] row-[1] flex flex-row items-center justify-center gap-24"
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
</div>

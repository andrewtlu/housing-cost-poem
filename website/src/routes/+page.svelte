<script lang="ts">
    import { onMount } from "svelte";
    import "../app.css";
    import Verse1 from "../components/pages/verse1.svelte";
    import Verse2 from "../components/pages/verse2.svelte";
    import Verse3 from "../components/pages/verse3.svelte";
    import Verse4 from "../components/pages/verse4.svelte";

    /** DOM element of scroll */
    let content: Element;
    let scrollLeft = 0,
        maxScroll = 1;
    let verses = [Verse1, Verse2, Verse3, Verse4];
    let keyframe = 0;

    // TODO: fix keyframing (tie to scroll position and pass to verse as prop)
    // TODO: add scroll (button) bar

    const handleScroll = () => {
        scrollLeft = content.scrollLeft;
        console.log(-(scrollLeft / maxScroll) * 100);
    };

    const updateMaxScroll = () => {
        maxScroll = content.scrollWidth - content.clientWidth;
    };

    onMount(() => {
        updateMaxScroll();
        content.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", updateMaxScroll);
        return () => {
            // make sure listeners are cleaned up
            content.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateMaxScroll);
        };
    });
</script>

<div class="absolute -z-50 h-screen w-screen overflow-hidden">
    <img
        src="/city.png"
        alt="background parallax city"
        class="scale-200 absolute bottom-0 left-0 -translate-y-1/2"
        style={`transform: translateX(${25 - (scrollLeft / maxScroll) * 50}%)`}
    />
</div>

<div
    class="relative flex h-screen snap-x snap-mandatory flex-row overflow-x-scroll bg-gray-50/50"
    bind:this={content}
>
    <div class="flex h-screen w-screen shrink-0 snap-center items-center justify-center" id="title">
        <h1>Affording an Abode: Affordable Housing in Urban America</h1>
    </div>

    {#each verses as verse, index}
        <div
            class="flex h-screen w-screen shrink-0 snap-center flex-row items-center justify-center gap-24"
            id={`verse${index}`}
        >
            <svelte:component this={verse} {keyframe} />
        </div>
    {/each}
</div>

<script lang="ts">
    import "../app.css";
    import Verse1 from "../components/pages/verse1.svelte";
    import Verse2 from "../components/pages/verse2.svelte";
    import Verse3 from "../components/pages/verse3.svelte";
    import Verse4 from "../components/pages/verse4.svelte";

    let verses = [Verse1, Verse2, Verse3, Verse4];
    let keyframe = 0;

    // TODO: fix keyframing (tie to scroll position and pass to verse as prop)
    // TODO: add scroll (button) bar
</script>

<div class="flex h-screen snap-x snap-mandatory flex-row overflow-x-scroll">
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

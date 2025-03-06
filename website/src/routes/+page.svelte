<script lang="ts">
    import "../app.css";
    import Verse1 from "../components/pages/verse1.svelte";
    import Verse2 from "../components/pages/verse2.svelte";
    import Verse3 from "../components/pages/verse3.svelte";
    import Verse4 from "../components/pages/verse4.svelte";

    let verses = [Verse1, Verse2, Verse3, Verse4];
    let keyframe = 0;

    // TODO: fix keyframing (tie to scroll position and pass to verse as prop)
    // TODO: add scroll bar
</script>

<div class="h-screen snap-y snap-mandatory overflow-y-scroll">
    <div class="flex h-screen snap-center items-center justify-center" id="title">
        <h1>Affording an Abode: Affordable Housing in Urban America</h1>
    </div>

    {#each verses as verse, index}
        <div
            class="flex h-screen snap-center flex-row items-center justify-center gap-24"
            id={`verse${index}`}
        >
            <svelte:component this={verse} {keyframe} />
        </div>
    {/each}
</div>

<script lang="ts">
    import Scatter from "./scatter.svelte";

    // quotations are curled :)
    let lines = [
        "...hopeless. Yet, hopes still remain.",
        "Though fate curses us to roam,",
        "shouldn’t we defy this harm,",
        "make plausible a path home?"
    ];
</script>

<ul>
    {#each lines as line, index (index)}
        <li>{line}</li>
    {/each}
</ul>

<div class="bg-white">
    <h2 class="mb-2.5 text-center text-2xl font-bold">
        Impact of Racial Demographic on Housing Value
    </h2>
    <Scatter />
</div>

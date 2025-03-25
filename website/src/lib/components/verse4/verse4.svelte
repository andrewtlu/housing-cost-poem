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

<div class="scatter_box">
    <h2 class="scatter_title">Impact of Racial Demographic on Housing Value</h2>
    <Scatter />
</div>

<style>
    .scatter_title {
        font-size: 25px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
    }

    .scatter_box {
        background-color: beige;
    }
</style>

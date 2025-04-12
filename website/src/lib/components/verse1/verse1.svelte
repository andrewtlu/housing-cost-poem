<script lang="ts">
    import { getFrame, keyframe } from "$lib";
    import WordChart from "./word_chart.svelte";

    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];
</script>

<ul class="">
    {#each lines as line, index (index)}
        <li
            title={line}
            class={`opacity-50 transition-all ${getFrame(keyframe.value).bolded.includes(index) ? "font-bold opacity-100" : ""}`}
        >
            {line}
        </li>
    {/each}
</ul>

<WordChart />

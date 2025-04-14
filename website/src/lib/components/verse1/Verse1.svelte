<script lang="ts">
    import { Lines } from "$lib/components";
    import WordChart from "./WordChart.svelte";

    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];
</script>

<Lines {lines} />

<WordChart />

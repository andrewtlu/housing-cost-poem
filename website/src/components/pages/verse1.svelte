<script lang="ts">
    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one's room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];
</script>

<ul>
    {#each lines as line}
        <li>{line}</li>
    {/each}
</ul>

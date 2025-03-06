<script lang="ts">
    let lines = [
        "First, redlining carved us up;",
        "now, though, housing builds gaps—",
        "funny—our fathers' missteps",
        "make funding fortune perhaps..."
    ];
</script>

<ul>
    {#each lines as line}
        <li>{line}</li>
    {/each}
</ul>

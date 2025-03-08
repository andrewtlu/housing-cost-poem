<script lang="ts">
    let keyframe = $props();

    // dashes are em dashes and quotations are curled :)
    let lines = [
        "First, redlining carved us up;",
        "now, though, housing builds gaps—",
        "funny—our fathers’ missteps",
        "make funding fortune perhaps..."
    ];
</script>

<ul>
    {#each lines as line, index}
        <li>{line}</li>
    {/each}
</ul>

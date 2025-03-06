<script lang="ts">
    let lines = [
        "...hopeless. Yet, hopes still remain.",
        "Though fate curses us to roam,",
        "shouldn't we defy this harm,",
        "make plausible a path home?"
    ];
</script>

<ul>
    {#each lines as line}
        <li>{line}</li>
    {/each}
</ul>

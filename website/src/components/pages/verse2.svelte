<script lang="ts">
    let lines = [
        "Plans of school, moving downtown",
        "cut short. Finding no space within,",
        'they plea: "Just earn your pension!"',
        "For what? To be kept trapped therein?"
    ];
</script>

<ul>
    {#each lines as line}
        <li>{line}</li>
    {/each}
</ul>

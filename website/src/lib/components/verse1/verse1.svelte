<script lang="ts">
    import Example from "./example.svelte";
    import Example2 from "./example2.svelte";

    // dashes are em dashes, and quotations are curled :)
    let lines = [
        "Home—yes, four walls to keep warm",
        "and safe refuge in one’s room—",
        "a haven for kin to form",
        "and our childhood dreams to bloom:"
    ];
</script>

<ul>
    {#each lines as line, index (index)}
        <li>{line}</li>
    {/each}
</ul>

<Example />

<Example2 />

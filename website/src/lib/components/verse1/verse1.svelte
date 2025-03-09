<script lang="ts">
    import { getFrame, keyframe } from "$lib/keyframe.svelte";
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
        <li title={line} class={getFrame(keyframe.value).bolded.includes(index) ? "font-bold" : ""}>
            {line}
        </li>
    {/each}
</ul>

<div>
    <Example />
    <Example2 />
</div>

<!-- https://stackoverflow.com/questions/5687035/css-bolding-some-text-without-changing-its-containers-size -->
<!-- may be better to make all text bold, and reduce opacity of non-emphasized text -->
<style>
    li::after {
        display: block;
        content: attr(title);
        font-weight: bold;
        height: 1px;
        color: transparent;
        overflow: hidden;
        visibility: hidden;
    }
</style>

<script lang="ts">
    import { getFrame, keyframe } from "$lib";

    // dashes are em dashes and quotations are curled :)
    let lines = [
        "First, redlining carved us up;",
        "now, though, housing builds gaps—",
        "funny—our fathers’ missteps",
        "make funding fortune perhaps..."
    ];
</script>

<ul>
    {#each lines as line, index (index)}
        <li
            title={line}
            class={`transition-all ${getFrame(keyframe.value).bolded.includes(index) ? "font-bold" : ""}`}
        >
            {line}
        </li>
    {/each}
</ul>

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

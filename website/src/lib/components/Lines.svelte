<script lang="ts">
    import { getFrame, keyframe } from "$lib";

    let { lines }: { lines: string[] } = $props();
</script>

<ul class="bg-moon-light/90 border-twilight rounded-md border-2 px-5 py-3">
    {#each lines as line, index (index)}
        <li
            title={line}
            class={`opacity-50 transition-all ${getFrame(keyframe.value).bolded.includes(index) ? "font-bold opacity-100" : ""}`}
        >
            {line}
        </li>
    {/each}
</ul>

<!-- @component
title for graph
 -->
<script lang="ts">
    import { attributeMap, attributeState } from "./store.svelte";

    let attribute = $derived(attributeState[0]);
</script>

<!-- title -->
<div
    class="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-md bg-white/70 text-center text-xl"
>
    {attributeMap[attribute].textLabel} Compared to Metro Area Maximum
</div>

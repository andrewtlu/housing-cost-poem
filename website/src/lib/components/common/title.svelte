<!-- @component
title for graph
 -->
<script lang="ts">
    const { title }: { title: string } = $props();
</script>

<!-- title -->
<div
    class="absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-md bg-white/70 text-center text-xl"
>
    {title}
</div>

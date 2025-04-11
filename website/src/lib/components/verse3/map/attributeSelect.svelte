<!-- @component
attribute select component
 -->
<script lang="ts">
    import { fly } from "svelte/transition";
    import { attributeMap, setAttribute, attributes } from "./store.svelte";
    import { quadInOut } from "svelte/easing";
    let hover = $state(false);
</script>

<div
    class="pointer-events-none absolute top-1/2 right-5 flex -translate-y-1/2 flex-col p-2 transition-all"
>
    {#each attributes as attribute (attribute)}
        <div class="flex h-7 flex-row items-center justify-end overflow-hidden">
            {#if hover}
                <div
                    transition:fly={{ duration: 250, x: 200, easing: quadInOut }}
                    class="cursor-pointer rounded-sm bg-white/70 p-1 text-base leading-2"
                >
                    {attributeMap[attribute].tag}
                </div>
            {/if}

            <div
                class="pointer-events-auto z-20 h-7 pl-1"
                role="group"
                onmouseenter={() => {
                    hover = true;
                }}
                onmouseleave={() => {
                    hover = false;
                }}
            >
                <button
                    class="btn btn-circle pointer-events-auto h-5 w-5 border-0 p-0"
                    aria-label={attribute}
                    onclick={() => {
                        setAttribute(attribute);
                    }}
                    style="background-color: {attributeMap[attribute].color[1]};"
                ></button>
            </div>
        </div>
    {/each}
</div>

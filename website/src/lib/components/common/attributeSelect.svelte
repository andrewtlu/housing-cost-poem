<!-- @component
attribute select component
 -->
<script lang="ts">
    import { fly } from "svelte/transition";
    import { quadInOut } from "svelte/easing";
    import { attributeMap, type MapKeys } from "$lib/data";

    let {
        selected,
        attributes,
        setAttribute
    }: { selected: MapKeys | ""; attributes: MapKeys[]; setAttribute: (arg0: MapKeys) => void } =
        $props();
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

            <!-- hacky blank background to hide text flying out -->
            <div
                class="pointer-events-auto z-20 flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl bg-white"
                role="group"
                onmouseenter={() => {
                    hover = true;
                }}
                onmouseleave={() => {
                    hover = false;
                }}
            >
                <button
                    class="btn btn-circle pointer-events-auto h-5 w-5 border-0 p-0 transition-opacity duration-300"
                    style={`background-color: ${attributeMap[attribute].color[1]}; opacity: ${attribute === selected || selected === "" || hover ? 1 : 0.4};`}
                    aria-label={attribute}
                    onclick={() => {
                        setAttribute(attribute);
                    }}
                ></button>
            </div>
        </div>
    {/each}
</div>

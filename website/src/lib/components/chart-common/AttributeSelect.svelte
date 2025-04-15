<!-- @component
attribute select component, to enable multiselect setAttribute and selected have to handle multiselect instead of toggle 
 -->
<script lang="ts">
    import { fly } from "svelte/transition";
    import { quadInOut } from "svelte/easing";
    import { attributeMap, type MapKeys } from "$lib/data";

    let {
        selected,
        canDeselect = false, // should only be true if setAttribute/selected can also be "", not just mapkeys
        attributes,
        setAttribute,
        colorOverrides = {}
    }: {
        selected: (MapKeys | "")[];
        canDeselect?: boolean;
        attributes: MapKeys[];
        setAttribute: (arg0: MapKeys | "") => void;
        colorOverrides: {
            [K in MapKeys]?: string;
        };
    } = $props();
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
                    class="bg-moon-light/70 cursor-pointer rounded-sm p-1 text-base leading-2"
                >
                    {attributeMap[attribute].tag}
                </div>
            {/if}

            <!-- hacky blank background to hide text flying out -->
            <div
                class="bg-moon-light pointer-events-auto z-20 flex h-7 w-7 items-center justify-center overflow-hidden rounded-xl"
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
                    style={`background-color: ${attribute in colorOverrides ? colorOverrides[attribute] : attributeMap[attribute].color[1]}; opacity: ${selected.includes(attribute) || hover ? 1 : 0.4};`}
                    aria-label={attribute}
                    onclick={() => {
                        if (!canDeselect || !selected.includes(attribute)) setAttribute(attribute);
                        else setAttribute("");
                    }}
                ></button>
            </div>
        </div>
    {/each}
</div>

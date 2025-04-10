<!-- @component
attribute select component
 -->
<script lang="ts">
    import { fly } from "svelte/transition";
    import { attributeMap, setAttribute, type MapKeys } from "./store.svelte";
    import { quadInOut } from "svelte/easing";

    let attributes: MapKeys[] = [
        "white_alone",
        "black_alone",
        "native_alone",
        "asian_alone",
        "native_hawaiian_pacific_islander",
        "some_other_race_alone",
        "two_or_more",
        "hispanic_or_latino"
    ];
    let hover = $state(false);
</script>

<div class="pointer-events-none absolute top-1/2 right-5 flex -translate-y-1/2 flex-col p-2">
    {#each attributes as attribute}
        <div class="flex h-7 flex-row items-center justify-end gap-2 overflow-hidden">
            {#if hover}
                <div
                    transition:fly={{ duration: 400, x: 200, easing: quadInOut }}
                    class="cursor-pointer rounded-sm bg-white/70 p-1 text-base leading-2"
                >
                    {attributeMap[attribute].tag}
                </div>
            {/if}

            <div
                class="pointer-events-auto z-20 h-7"
                role="group"
                onmouseenter={() => {
                    hover = true;
                }}
                onmouseleave={() => {
                    hover = false;
                }}
            >
                <button
                    class="btn btn-secondary pointer-events-auto h-5 w-5 p-0"
                    aria-label={attribute}
                    onclick={() => {
                        setAttribute(attribute);
                    }}
                ></button>
            </div>
        </div>
    {/each}
</div>

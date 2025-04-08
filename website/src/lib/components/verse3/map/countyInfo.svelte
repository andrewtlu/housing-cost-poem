<script lang="ts">
    import type { County } from "$lib/data";
    import { fly } from "svelte/transition";
    import { attribute as selectedAttribute } from "./store.svelte";

    const { hovered_county }: { hovered_county: County | null } = $props();

    // check what is being analyzed
    let attribute = $derived(selectedAttribute[0]);
</script>

{#if hovered_county}
    <div
        class="w-fit rounded-md border-2 border-[gray] bg-white/80 px-5"
        transition:fly={{ x: -500, duration: 700 }}
    >
        <ul>
            <li>{hovered_county.county}</li>
            <li>Median Home Value: ${hovered_county.median_home_value}</li>
            <li>
                % Pop w/ College Degree: {Math.round(
                    (hovered_county.educational_attainment / hovered_county.total_population) * 100
                )}%
            </li>
        </ul>
    </div>
{/if}

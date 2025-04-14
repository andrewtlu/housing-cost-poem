<!-- @component
hover county info; displays specific locale string value and area's education level
 -->
<script lang="ts">
    import { attributeMap, type County } from "$lib/data";
    import { fly } from "svelte/transition";
    import { attributeState } from "./store.svelte";

    const attribute = $derived(attributeState[0]);
    const { hovered_county }: { hovered_county: County | null } = $props();
</script>

{#if hovered_county}
    <div class="bg-moon/90 w-fit rounded-md px-5" transition:fly={{ x: -500, duration: 700 }}>
        <ul>
            <li>{hovered_county.county}</li>
            <li>
                {attributeMap[attribute].textLabel}: {attributeMap[attribute].textValue(
                    hovered_county
                )}
            </li>
            <li>
                % Pop w/ College Degree: {Math.round(
                    (hovered_county.educational_attainment / hovered_county.total_population) * 100
                )}%
            </li>
        </ul>
    </div>
{/if}

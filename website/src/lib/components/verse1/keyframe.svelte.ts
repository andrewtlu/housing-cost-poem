import { type Keyframe } from "$lib/keyframe.svelte";

let verse = 1;
export let selectedGraph = $state({ value: -1 });

/**
 * The keyframes for verse 1.
 */
export const verse1Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [],
        toRun: [() => (selectedGraph.value = -1)]
    },
    {
        verse: verse,
        bolded: [0, 1],
        toRun: [() => (selectedGraph.value = 0)]
    },
    {
        verse: verse,
        bolded: [2, 3],
        toRun: [() => (selectedGraph.value = 1)]
    }
];

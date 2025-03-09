import { type Keyframe } from "$lib/keyframe.svelte";

let verse = 1;

/**
 * The keyframes for verse 1.
 */
export const verse1Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [],
        toRun: []
    },
    {
        verse: verse,
        bolded: [0, 1],
        toRun: []
    },
    {
        verse: verse,
        bolded: [2, 3],
        toRun: []
    }
]

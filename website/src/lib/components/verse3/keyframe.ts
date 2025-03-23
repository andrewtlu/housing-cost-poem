import { type Keyframe } from "$lib/keyframe.svelte";

let verse = 3;

/**
 * The keyframes for verse 3.
 */
export const verse3Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [0],
        toRun: []
    },
    {
        verse: verse,
        bolded: [1, 2, 3],
        toRun: []
    }
];

import { type Keyframe } from "$lib/keyframe.svelte";
import { colorByState } from "./map/store.svelte";

const verse = 3;

/**
 * The keyframes for verse 3.
 */
export const verse3Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [0],
        toRun: [
            () => {
                colorByState[0] = "black_alone";
            }
        ]
    },
    {
        verse: verse,
        bolded: [1, 2, 3],
        toRun: [
            () => {
                colorByState[0] = "median_home_value";
            }
        ]
    }
];

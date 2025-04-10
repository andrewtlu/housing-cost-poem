import { type Keyframe } from "$lib/keyframe.svelte";
import { attributes, attributeState, setAttributes, type MapKeys } from "./map/store.svelte";

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
                setAttributes([
                    "white_alone",
                    "black_alone",
                    "native_alone",
                    "asian_alone",
                    "native_hawaiian_pacific_islander",
                    "some_other_race_alone",
                    "two_or_more",
                    "hispanic_or_latino"
                ]);
                attributeState[0] = "black_alone";
            }
        ]
    },
    {
        verse: verse,
        bolded: [1, 2, 3],
        toRun: [
            () => {
                setAttributes(["median_income", "median_home_value"]);
                attributeState[0] = "median_home_value";
            }
        ]
    }
];

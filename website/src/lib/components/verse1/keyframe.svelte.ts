import { type Keyframe } from "$lib/keyframe.svelte";

const verse = 1;
export const defaultWords = $state([""]);

/**
 * The keyframes for verse 1.
 */
export const verse1Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [0],
        toRun: [
            () => {
                defaultWords.length = 0;
                defaultWords.push("shelter", "abode");
            }
        ]
    },
    {
        verse: verse,
        bolded: [1],
        toRun: [
            () => {
                defaultWords.length = 0;
                defaultWords.push("refuge", "sanctuary");
            }
        ]
    },
    {
        verse: verse,
        bolded: [2],
        toRun: [
            () => {
                defaultWords.length = 0;
                defaultWords.push("haven", "family");
            }
        ]
    },
    {
        verse: verse,
        bolded: [3],
        toRun: [
            () => {
                defaultWords.length = 0;
                defaultWords.push(
                    "foundation",
                    "beginning",
                    "stability",
                    "comfort",
                    "hope",
                    "future"
                );
            }
        ]
    }
];

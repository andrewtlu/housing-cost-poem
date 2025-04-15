import { type Keyframe } from "$lib/keyframe.svelte";
import type { Component } from "svelte";

const verse = 2;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const selectedGraphState: [Component<Record<string, never>, {}, ""> | null] = $state([null]);

/**
 * The keyframes for verse 2.
 */
export const verse2Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [],
        toRun: []
    }
];

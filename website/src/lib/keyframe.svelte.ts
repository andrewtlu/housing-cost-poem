import { writable } from "svelte/store";

/**
 * Keyframe contains info on:
 * - bolded lines
 * - functions to run
 */
export type Keyframe = {
    verse: number;
    bolded: number[]; // lines to be bolded
    toRun: (() => void)[];
};

/**
 * The keyframes for the poem.
 * Not automatically sorted, but can be easily implemented with .toSorted()
 */
export const keyframes: Keyframe[] = [
    {
        verse: 0,
        bolded: [],
        toRun: []
    },
    {
        verse: 1,
        bolded: [],
        toRun: []
    },
    {
        verse: 1,
        bolded: [0, 1],
        toRun: []
    },
    {
        verse: 1,
        bolded: [2, 3],
        toRun: []
    },
    {
        verse: 2,
        bolded: [],
        toRun: []
    },
    {
        verse: 3,
        bolded: [],
        toRun: []
    },
    {
        verse: 4,
        bolded: [],
        toRun: []
    }
];

/**
 * Internal keyframe state
 */
let _keyframe = $state(0);

/**
 * Exported state wrapped with helper functions.
 */
export const keyframe = {
    /**
     * Get the current keyframe.
     * @returns current keyframe
     */
    get() {
        return _keyframe;
    },
    /**
     * Set the current keyframe.
     * @param frame frame to set to
     */
    set(frame: number) {
        _keyframe = frame;
    },
    /**
     * Increment the current keyframe.
     * @param count count to increment, or default 1
     */
    increment(count?: number) {
        if (count != undefined) {
            _keyframe += count;
        } else {
            _keyframe++;
        }
    },
    /**
     * Decrement the current keyframe.
     * @param count count to decrement, or default 1
     */
    decrement(count?: number) {
        if (count != undefined) {
            _keyframe -= count;
        } else {
            _keyframe--;
        }
    }
};

/**
 * Gets the total # of frames in a poem or a verse.
 * @param verse verse to count, otherwise count all frames
 * @returns count of frames in a verse
 */
export function getFramesCount(verse?: number) {
    if (verse !== undefined) {
        let count = 0;
        for (const keyframe of keyframes) {
            if (keyframe.verse == verse) count++;
        }
        return count;
    } else {
        return keyframes.length;
    }
}

/**
 * Gets the actual keyframe given the keyframe number.
 * @param index keyframe to fetch
 * @returns fetched keyframe
 */
export function getFrame(index: number): Keyframe {
    return keyframes[index];
}

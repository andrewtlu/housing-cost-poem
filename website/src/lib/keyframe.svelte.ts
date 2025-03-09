import {
    titleKeyframes,
    verse1Keyframes,
    verse2Keyframes,
    verse3Keyframes,
    verse4Keyframes
} from "./components";
import { updateScroll } from "./scroll-override";

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
    ...titleKeyframes,
    ...verse1Keyframes,
    ...verse2Keyframes,
    ...verse3Keyframes,
    ...verse4Keyframes
];

/**
 * The website's keyframe state.
 * Automatically updates the tweened scrollPosition if provided methods are used to update state.
 */
export const keyframe = $state({
    /**
     * The current keyframe.
     *
     * **SHOULD NOT BE DIRECTLY SET! IF DIRECTLY SET, WILL NOT PROPERLY UPDATE SCROLL! USE set() INSTEAD!**
     */
    value: 0,
    /**
     * Helper function to make sure keyframe is in bounds.
     * Should be called before accessing keyframe (ie, before updateScroll())
     */
    clean() {
        if (this.value >= getFramesCount() - 1) this.value = getFramesCount() - 1;
        else if (this.value < 0) keyframe.set(0);
    },
    /**
     * Set the current keyframe.
     * @param frame frame to set to
     */
    set(frame: number) {
        this.value = frame;
        this.clean();
        updateScroll();
    },
    /**
     * Increment the current keyframe.
     * @param count count to increment, or default 1
     */
    increment(count?: number) {
        if (count != undefined) {
            this.value += count;
        } else {
            this.value++;
        }
        this.clean();
        updateScroll();
    },
    /**
     * Decrement the current keyframe.
     * @param count count to decrement, or default 1
     */
    decrement(count?: number) {
        if (count != undefined) {
            this.value -= count;
        } else {
            this.value--;
        }
        this.clean();
        updateScroll();
    }
});

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

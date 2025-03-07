/**
 * Keyframe contains info on:
 * - bolded lines
 * - functions to run
 */
export type Keyframe = {
    bolded: (0 | 1 | 2 | 3)[]; // lines to be bolded
    toRun: Function[];
};

/**
 * Stores a list of keyframes for a specific verse
 */
export type Keyframes = {
    frames: Keyframe[];
};

/**
 * Frames within verse 1
 */
export const verse1Frames: Keyframes = {
    frames: [
        {
            bolded: [0, 1],
            toRun: []
        },
        {
            bolded: [2, 3],
            toRun: []
        }
    ]
};

/**
 * Frames within verse 2
 */
export const verse2Frames: Keyframes = {
    frames: []
};

/**
 * Frames within verse 3
 */
export const verse3Frames: Keyframes = {
    frames: []
};

/**
 * Frames within verse 4
 */
export const verse4Frames: Keyframes = {
    frames: []
};

export const keyframes: Keyframes[] = [verse1Frames, verse2Frames, verse3Frames, verse4Frames];

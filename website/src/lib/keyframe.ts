/**
 * Keyframe contains info on:
 * - bolded lines
 * - functions to run
 */
export type Keyframe = {
    bolded: (1 | 2 | 3 | 4)[]; // lines to be bolded
    toRun: CallableFunction[];
};

/**
 * Stores a list of keyframes for a specific verse
 */
export type Keyframes = {
    frames: Keyframe[];
};

/**
 * Keyframe contains info on:
 * - bolded lines
 * - functions to run
 */
export type Keyframe = {
    bolded: (0 | 1 | 2 | 3)[]; // lines to be bolded
    toRun: (() => void)[];
};

/**
 * Stores a list of keyframes for a specific verse
 * frames[] must contain at least 1 frame (default)
 */
export type Keyframes = {
    frames: [Keyframe, ...Keyframe[]];
};


/**
 * Frames within title
 */
export const titleFrames: Keyframes = {
    frames: [
        {
            bolded: [],
            toRun: []
        },
    ]
}

/**
 * Frames within verse 1
 */
export const verse1Frames: Keyframes = {
    frames: [
        {
            bolded: [],
            toRun: []
        },
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
    frames: [
        {
            bolded: [],
            toRun: []
        }
    ]
};

/**
 * Frames within verse 3
 */
export const verse3Frames: Keyframes = {
    frames: [
        {
            bolded: [],
            toRun: []
        }
    ]
};

/**
 * Frames within verse 4
 */
export const verse4Frames: Keyframes = {
    frames: [
        {
            bolded: [],
            toRun: []
        }
    ]
};

export const keyframes: Keyframes[] = [titleFrames, verse1Frames, verse2Frames, verse3Frames, verse4Frames];

export function getFramesCount(keyframe: Keyframes) {
    return keyframe.frames.length;
}

export function getTotalFramesCount() {
    let count = 0;
    keyframes.forEach((frame: Keyframes) => (count += frame.frames.length));
    return count;
}

export function getFrame(keyframe: number): Keyframe {
    let index = keyframe;
    // traverse frames
    for (let verseFrames of keyframes) {
        if (index >= getFramesCount(verseFrames)) {
            index -= getFramesCount(verseFrames);
        } else {
            return verseFrames.frames[index];
        }
    }

    throw Error(
        `Tried accessing keyframe ${keyframe + 1}, but there are only ${getTotalFramesCount()} frames!`
    );
}

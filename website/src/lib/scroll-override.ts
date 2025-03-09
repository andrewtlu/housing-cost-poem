import { quadOut } from "svelte/easing";
import { Tween } from "svelte/motion";
import { getFrame, getFramesCount, keyframe } from "$lib";

/** Master scroll duration */
export const duration = 500;

/** Tweened scrollLeft value */
export const scrollPosition = new Tween(0, {
    duration: duration,
    easing: quadOut
});

/**
 * Helper function to update the scroll value.
 */
export function updateScroll(instant: boolean = false) {
    if (!instant)
        // add verse change * width of screen
        scrollPosition.target = getFrame(keyframe.value).verse * window.innerWidth;
    else scrollPosition.set(getFrame(keyframe.value).verse * window.innerWidth, { duration: 0 });
}

/**
 * Overrides default behavior and returns a tweened scrollPosition value to use for transform instead.
 * Scroll updates keyframes & derives scroll position
 * @param content the content that is scrolling
 * @param keyframe the keyframe index
 * @returns unmount functions
 */
export function overrideScroll(content: Element) {
    /** TS doesn't allow wheelevent in addEventListener callback, so we assert type */
    let wheelEvent: WheelEvent;
    /** Track debounce */
    let timer: number | null;

    const debouncedScrollOverride = (event: Event) => {
        if (!timer) {
            event.preventDefault();
            wheelEvent = event as WheelEvent;

            // update keyframe
            const sign = Math.sign(wheelEvent.deltaX + wheelEvent.deltaY);
            if (keyframe.value + sign >= getFramesCount() - 1) keyframe.set(getFramesCount() - 1);
            else if (keyframe.value + sign < 0) keyframe.set(0);
            else keyframe.increment(sign);

            timer = setTimeout(() => {
                timer = null;
            }, duration / 2);
        }
    };

    const handleResize = () => {
        updateScroll(true);
    };

    // yes wheel event is not widely supported but this will have to do
    // to have wide support we can instead listen to mwheel/trackpad/touch
    content.addEventListener("wheel", debouncedScrollOverride);
    window.addEventListener("resize", handleResize);

    return {
        scrollPosition: scrollPosition,
        unmount: () => {
            content.removeEventListener("wheel", debouncedScrollOverride);
            window.removeEventListener("resize", handleResize);
        }
    };
}

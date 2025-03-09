import { quadOut } from "svelte/easing";
import { Tween } from "svelte/motion";
import { getFrame, getFramesCount, keyframe } from "$lib";

/**
 * Overrides default behavior and returns a tweened scrollPosition value to use for transform instead.
 * Scroll updates keyframes & derives scroll position
 * @param content the content that is scrolling
 * @param keyframe the keyframe index
 * @returns unmount functions
 */
export function overrideScroll(content: Element) {
    /** Master scroll duration */
    const duration = 500;
    /** TS doesn't allow wheelevent in addEventListener callback, so we assert type */
    let wheelEvent: WheelEvent;
    /** Track debounce */
    let timer: number | null;

    /** Tweened scrollLeft value */
    const scrollPosition = new Tween(0, {
        duration: duration,
        easing: quadOut
    });

    const debouncedScrollOverride = (event: Event) => {
        if (!timer) {
            event.preventDefault();
            wheelEvent = event as WheelEvent;

            // update keyframe
            keyframe.increment(Math.sign(wheelEvent.deltaX + wheelEvent.deltaY));
            if (keyframe.value >= getFramesCount() - 1) keyframe.set(getFramesCount() - 1);
            else if (keyframe.value < 0) keyframe.set(0);

            // add verse change * width of screen
            scrollPosition.target = getFrame(keyframe.value).verse * window.innerWidth;
            timer = setTimeout(() => {
                timer = null;
            }, duration / 2);
        }
    };

    const handleResize = () => {
        scrollPosition.set(
            Math.round(scrollPosition.current / window.innerWidth) * window.innerWidth,
            { duration: 0 }
        );
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

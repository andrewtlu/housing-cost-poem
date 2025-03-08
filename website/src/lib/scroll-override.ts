import { quadOut } from "svelte/easing";
import { Tween } from "svelte/motion";
import { getFramesCount, getTotalFramesCount, keyframes } from "./keyframe";

/**
 * Overrides default behavior and returns a tweened scrollPosition value to use for transform instead.
 * Scroll updates keyframes, and the verse & scroll position derived from keyframe
 */
export function overrideScroll(content: Element, { verse, keyframe }: { verse: number, keyframe: number }) {
    /** Master scroll duration */
    let duration = 500;
    /** TS doesn't allow wheelevent in addEventListener callback, so we assert type */
    let wheelEvent: WheelEvent;
    /** Track debounce */
    let timer: number | null;

    /** Tweened scrollLeft value */
    let scrollPosition = new Tween(0, {
        duration: duration,
        easing: quadOut
    });

    const debouncedScrollOverride = (event: Event) => {
        if (!timer) {
            event.preventDefault();
            wheelEvent = event as WheelEvent;
            let totalFramesCount = getTotalFramesCount();
            let countUpToVerse = getTotalFramesCount(verse);
            let verseFramesCount = getFramesCount(keyframes[verse]);

            // update keyframe
            keyframe += Math.sign(wheelEvent.deltaX + wheelEvent.deltaY);
            if (keyframe >= totalFramesCount - 1) keyframe = totalFramesCount - 1;
            else if (keyframe < 0) keyframe = 0;

            // if new verse update verse
            if (keyframe >= countUpToVerse) verse++;
            else if (keyframe < countUpToVerse - verseFramesCount) verse--;

            // add verse change * width of screen
            scrollPosition.target = verse * window.innerWidth;
            timer = setTimeout(() => { timer = null }, duration / 2)
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

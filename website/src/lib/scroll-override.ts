import { quadOut } from "svelte/easing";
import { Tween } from "svelte/motion";
import { getTotalFramesCount } from "./keyframe";

// NOW THAT KEYFRAMES ARE CONNECTED, NEED TO MAKE SURE THEY'RE STILL CONNECTED TO THE SCROLL POSITION! CURRENTLY VERY FINICKY

/**
 * Overrides default behavior and returns a tweened scrollPosition value to use for transform instead.
 * Automatically updates keyframes.
 * `keyframe` is wrapped in an object so that keyframe in the calling context can be modified
 */
export function overrideScroll(content: Element, { keyframe }: { keyframe: number }) {
    /** Tweened scrollLeft value */
    let scrollPosition = new Tween(0, {
        duration: 500,
        easing: quadOut
    });
    /** TS doesn't allow wheelevent in addEventListener callback, so we assert type */
    let wheelEvent: WheelEvent;
    /** Because current is current at instance target is changed, we need to set scroll target to be from the nearest verse */
    let nearestVerseScroll;

    const scrollOverride = (event: Event) => {
        event.preventDefault();
        wheelEvent = event as WheelEvent;
        nearestVerseScroll =
            Math.round(scrollPosition.current / window.innerWidth) * window.innerWidth;

        if (Math.sign(wheelEvent.deltaX + wheelEvent.deltaY) >= 0) {
            // positive scroll
            scrollPosition.target = Math.min(
                nearestVerseScroll + window.innerWidth,
                content.scrollWidth
            );
            keyframe = keyframe < getTotalFramesCount() - 1 ? keyframe + 1 : getTotalFramesCount() - 1;
        }
        // negative scroll
        else {
            scrollPosition.target = Math.max(nearestVerseScroll - window.innerWidth, 0);
            keyframe = keyframe > 0 ? keyframe - 1 : 0;
        }
        console.log(keyframe);
    };

    const handleResize = () => {
        scrollPosition.set(
            Math.round(scrollPosition.current / window.innerWidth) * window.innerWidth,
            { duration: 0 }
        );
    };

    content.addEventListener("wheel", scrollOverride);
    window.addEventListener("resize", handleResize);

    return {
        scrollPosition: scrollPosition,
        unmount: () => {
            content.removeEventListener("wheel", scrollOverride);
            window.removeEventListener("resize", handleResize);
        }
    };
}

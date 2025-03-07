import { quadOut } from "svelte/easing";
import { Tween } from "svelte/motion";

/** Overrides default behavior and returns a tweened scrollPosition value to use for transform instead */
export function overrideScroll(content: Element) {
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

        if (Math.sign(wheelEvent.deltaX + wheelEvent.deltaY) >= 0)
            // positive scroll
            scrollPosition.target = Math.min(
                nearestVerseScroll + window.innerWidth,
                content.scrollWidth
            );
        // negative scroll
        else scrollPosition.target = Math.max(nearestVerseScroll - window.innerWidth, 0);
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

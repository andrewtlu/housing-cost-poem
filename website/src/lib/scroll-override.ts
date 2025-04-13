import { keyframe } from "$lib";

/** Master debounce duration */
export const duration = 500;

/**
 * Overrides default scroll behavior and returns an unmount function.
 * Scroll updates keyframes.
 * @param content the content that is scrolling
 * @param keyframe the keyframe index
 * @returns unmount functions
 */
export function overrideScroll(content: Element) {
    /** TS doesn't allow wheelevent in addEventListener callback, so we assert type */
    let wheelEvent: WheelEvent;
    /** Track debounce */
    let timer: NodeJS.Timeout | null;

    const debouncedScrollOverride = (event: Event) => {
        if (!timer) {
            event.preventDefault();
            wheelEvent = event as WheelEvent;
            keyframe.increment(Math.sign(wheelEvent.deltaX + wheelEvent.deltaY));
            timer = setTimeout(() => {
                timer = null;
            }, duration);
        }
    };

    // yes wheel event is not widely supported but this will have to do
    // to have wide support we can instead listen to mwheel/trackpad/touch
    content.addEventListener("wheel", debouncedScrollOverride);

    // return unmount function
    return () => {
        content.removeEventListener("wheel", debouncedScrollOverride);
    };
}

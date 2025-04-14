import { keyframe } from "$lib";

/** Master debounce duration */
export const duration = 500;

/**
 * Mounts nav listeners, returns unmount function.
 * @param content the content to listen to
 * @returns unmount functions
 */
export function mountNav(content: Element) {
    /** Track debounce */
    let timer: NodeJS.Timeout | null;

    const debouncedWheelNav = (event: Event) => {
        if (!timer) {
            const wheelEvent = event as WheelEvent;
            keyframe.increment(Math.sign(wheelEvent.deltaX + wheelEvent.deltaY));
            timer = setTimeout(() => {
                timer = null;
            }, duration);
        }
    };

    // yes wheel event is not widely supported but this will have to do
    // to have wide support we can instead listen to mwheel/trackpad/touch
    content.addEventListener("wheel", debouncedWheelNav);

    // return unmount function
    return () => {
        content.removeEventListener("wheel", debouncedWheelNav);
    };
}

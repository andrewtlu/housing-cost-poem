export const hoverState = $state([""]);

export const setHover = (val: string = "") => {
    hoverState[0] = val;
};

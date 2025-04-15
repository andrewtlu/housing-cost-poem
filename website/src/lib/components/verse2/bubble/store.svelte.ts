export const focusHomeState = $state([false]);
export const focusIncomeState = $state([false]);
export const proportionState = $state([false]);

export const setFocusHome = (val?: boolean) => {
    if (val !== undefined) focusHomeState[0] = val;
    else focusHomeState[0] = !focusHomeState[0];
};
export const setFocusIncome = (val?: boolean) => {
    if (val !== undefined) focusIncomeState[0] = val;
    else focusIncomeState[0] = !focusIncomeState[0];
};
export const setProportion = (val?: boolean) => {
    if (val !== undefined) proportionState[0] = val;
    else proportionState[0] = !proportionState[0];
};

export type Attribute = "median_home_value" | "median_income";
export const attributeList: Attribute[] = ["median_home_value", "median_income"];

// overcomplicated focus handling is to allow for playing well with attributeselect component :)
export const focusState = $state<Attribute[]>([]);
export const showProportionState = $state([false]);

export const setFocusHome = (val?: boolean) => {
    const currVal = focusState.includes("median_home_value");
    const target = val === undefined ? !currVal : val;

    // if currVal = target no need to do anything
    if (currVal !== target) {
        if (target) focusState.push("median_home_value");
        else {
            const multiSelected = focusState.length == 2;
            focusState.length = 0;
            if (multiSelected) focusState.push("median_income");
        }
    }
};
export const setFocusIncome = (val?: boolean) => {
    const currVal = focusState.includes("median_income");
    const target = val === undefined ? !currVal : val;

    // if currVal = target no need to do anything
    if (currVal !== target) {
        if (target) focusState.push("median_income");
        else {
            const multiSelected = focusState.length == 2;
            focusState.length = 0;
            if (multiSelected) focusState.push("median_home_value");
        }
    }
};
export const setFocusAttr = (val: Attribute) => {
    const median_home_value = val == "median_home_value";
    if (median_home_value) setFocusHome();
    else setFocusIncome();
};

export const setProportion = (val?: boolean) => {
    if (val !== undefined) showProportionState[0] = val;
    else showProportionState[0] = !showProportionState[0];
};

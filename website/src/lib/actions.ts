import { writable } from "svelte/store";

export const showMedianIncome = writable(false);
export const showMedianHousingPrice = writable(false);
export const showProportion = writable(false);
export const textOpacity = writable(false);
export const showPieChart = writable(false);

export function toggleMedianIncome() {
    showMedianIncome.update((value) => !value);
    console.log("Median Income clicked" + { showMedianIncome });
    showMedianHousingPrice.set(false);
    showProportion.set(false);
}

export function trueMedianIncome() {
    showMedianIncome.update(() => true);
}

export function falseMedianIncome() {
    showMedianIncome.update(() => false);
}

export function toggleHousingPrice() {
    showMedianHousingPrice.update((value) => !value);
    // Use update method to toggle
    console.log("Median Housing Price clicked" + { showMedianHousingPrice });
    showMedianIncome.set(false);
    showProportion.set(false);
}

export function cctrtrueHousingPrice() {
    showMedianHousingPrice.update(() => true);
}

export function falseHousingPrice() {
    showMedianHousingPrice.update(() => false);
}

export function trueProportion() {
    showProportion.update(() => true);
    console.log("showProportion clicked" + { showProportion });
}

export function falseProportion() {
    showProportion.update(() => false);
}

export function toggleProportion() {
    showProportion.update((value) => !value);
    console.log("showProportion clicked" + { showProportion });
}

export function trueTextOpacity() {
    textOpacity.update(() => true);
    console.log("textOpacity clicked" + { textOpacity });
}

export function falseTextOpacity() {
    textOpacity.update(() => false);
    console.log("textOpacity clicked" + { textOpacity });
}

export function trueShowPieChart() {
    showPieChart.update(() => true);
    console.log("showPieChart true" + { textOpacity });
}

import { writable } from 'svelte/store';

export const showMedianIncome = writable(false);
export const showMedianHousingPrice = writable(false);
export const showProportion = writable(false);
export const textOpacity = writable(false);
export const showPieChart = writable(false);

export function toggleMedianIncome() {
    showMedianIncome.update(value => !value);
    console.log("Median Income clicked" + { showMedianIncome });
    showMedianHousingPrice.set(false);
    showProportion.set(false);
}

export function trueMedianIncome() {
    showMedianIncome.update(value => true);
}

export function falseMedianIncome() {
    showMedianIncome.update(value => false);
}

export function toggleHousingPrice() {
    showMedianHousingPrice.update(value => !value);
    // Use update method to toggle
    console.log("Median Housing Price clicked" + { showMedianHousingPrice });
    showMedianIncome.set(false);
    showProportion.set(false);
}

export function trueHousingPrice() {
    showMedianHousingPrice.update(value => true);
}

export function falseHousingPrice() {
    showMedianHousingPrice.update(value => false);
}

export function trueProportion() {
    showProportion.update(value => true);
    console.log("showProportion clicked" + { showProportion });
}

export function falseProportion() {
    showProportion.update(value => false);
}

export function toggleProportion() {
    showProportion.update(value => !value);
    console.log("showProportion clicked" + { showProportion });
}

export function trueTextOpacity() {
    textOpacity.update(value => true);
    console.log("textOpacity clicked" + { textOpacity });
}

export function falseTextOpacity() {
    textOpacity.update(value => false);
    console.log("textOpacity clicked" + { textOpacity });
}

export function trueShowPieChart() {
    showPieChart.update(value => true);
    console.log("showPieChart true" + { textOpacity });
}
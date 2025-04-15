import { writable } from "svelte/store";

export const showPieChart = writable(false);

export function trueShowPieChart() {
    showPieChart.update(() => true);
}

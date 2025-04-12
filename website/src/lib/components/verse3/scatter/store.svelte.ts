// what centroid graph is focused on

import type { MapKeys } from "$lib/data";

// to use selected, do $derived(selectedState[0])
export const selectedState: [MapKeys | ""] = $state([""]);
export const setSelected = (select: MapKeys | "") => {
    selectedState[0] = select;
};

// map/keyframe interactions go here (allows for easy change of what the gradient is)

import { extent, scaleLinear } from "d3";
import { attributeMap, data, type MapKeys } from "$lib/data";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";

// what to color by, list is to work around exporting non-const
// to use attribute, do $derived(attributeState[0])
export const attributeState: [MapKeys] = $state(["median_home_value"]);
export const setAttribute = (attr: MapKeys | "") => {
    if (attr === "") attributeState[0] = "total_population";
    else attributeState[0] = attr;
};
const attribute = $derived(attributeState[0]);

// what centroid graph is focused on
// to use attribute, do $derived(attributeState[0])
export const centroidState: number[] = $state([-1]);
export const setCentroid = (centroid: number) => {
    centroidState[0] = centroid;
};

// list of attributes to allow map to display
export const attributes: MapKeys[] = $state([]);
export const setAttributes = (attrs: MapKeys[]) => {
    attributes.length = 0;
    for (const attr of attrs) attributes.push(attr);
};

// color/color calculation used by map
export const cluster_colors = $state([
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>()
]);
let cluster_ranges: number[][] = [[], [], [], [], []];
export const getColor = (county: Feature<Geometry, GeoJsonProperties>, centroid: number = -1) => {
    const county_data = data.get(county.id as number);
    if (county_data !== undefined) {
        if (centroid == -1 || centroid == county_data.area_cluster)
            return cluster_colors[county_data.area_cluster](
                attributeMap[attribute].value(county_data)
            );
        else return "lightgray";
    }
    return "white";
};

// helper function to allow color reloading in component's effect
export const reloadColors = () => {
    cluster_ranges = [[], [], [], [], []];
    data.values().forEach((county) =>
        cluster_ranges[county.area_cluster].push(attributeMap[attribute].value(county))
    );
    cluster_ranges.forEach((range, idx) => {
        cluster_colors[idx] = scaleLinear<string>()
            .domain(extent(range) as [number, number])
            .range(attributeMap[attribute].color);
    });
};

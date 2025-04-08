// map/keyframe interactions go here (allows for easy change of what the gradient is)

import { extent, scaleLinear } from "d3";
import { data } from "$lib/data";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";

// attribute of aggregate data to color by
type MapKeys =
    | "median_income"
    | "median_home_value"
    | "area_cluster"
    | "total_population"
    | "total_population_25_over"
    | "educational_attainment"
    | "white_alone"
    | "black_alone"
    | "native_alone"
    | "asian_alone"
    | "native_hawaiian_pacific_islander"
    | "some_other_race_alone"
    | "two_or_more"
    | "hispanic_or_latino"
    | "total_population_25_under"
    | "proportion_25_under";

// toggle this when coloring needs to be changed
export const update = $state([false]);

// color/color calculation used by map
export const cluster_colors = $state([
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>()
]);
const cluster_ranges: number[][] = [[], [], [], [], []];
export const getColor = (county: Feature<Geometry, GeoJsonProperties>) => {
    const county_data = data.get(county.id as number);
    if (county_data !== undefined) {
        return cluster_colors[county_data.area_cluster](county_data.median_home_value);
    }
    return "white";
};

// helper function to allow color reloading in component's effect
export const reloadColors = () => {
    data.values().forEach((element) =>
        cluster_ranges[element.area_cluster].push(element.median_home_value)
    );
    cluster_ranges.forEach((range, idx) => {
        cluster_colors[idx] = scaleLinear<string>()
            .domain(extent(range) as [number, number])
            .range(["yellow", "red"]);
    });
}

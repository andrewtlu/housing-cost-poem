// map/keyframe interactions go here (allows for easy change of what the gradient is)

import { extent, scaleLinear } from "d3";
import { data, type County } from "$lib/data";
import type { Feature, GeoJsonProperties, Geometry } from "geojson";

// attribute of aggregate data to color by
type MapKeys =
    | "median_income"
    | "median_home_value"
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

// what to color by, list is to work around exporting non-const
export const colorByState: [MapKeys] = $state(["black_alone"]);
// processed values to use when generating/coloring
const colorByStates = {
    total_population: (county_data: County) => {
        return county_data.total_population;
    },
    total_population_25_over: (county_data: County) => {
        return county_data.total_population_25_over;
    },
    educational_attainment: (county_data: County) => {
        return county_data.educational_attainment;
    },
    median_income: (county_data: County) => {
        return county_data.median_income;
    },
    median_home_value: (county_data: County) => {
        return county_data.median_home_value;
    },
    white_alone: (county_data: County) => {
        return county_data.white_alone / county_data.total_population;
    },
    black_alone: (county_data: County) => {
        return county_data.black_alone / county_data.total_population;
    },
    native_alone: (county_data: County) => {
        return county_data.native_alone / county_data.total_population;
    },
    asian_alone: (county_data: County) => {
        return county_data.asian_alone / county_data.total_population;
    },
    native_hawaiian_pacific_islander: (county_data: County) => {
        return county_data.native_hawaiian_pacific_islander / county_data.total_population;
    },
    some_other_race_alone: (county_data: County) => {
        return county_data.some_other_race_alone / county_data.total_population;
    },
    two_or_more: (county_data: County) => {
        return county_data.two_or_more / county_data.total_population;
    },
    hispanic_or_latino: (county_data: County) => {
        return county_data.hispanic_or_latino / county_data.total_population;
    },
    total_population_25_under: (county_data: County) => {
        return county_data.total_population_25_under;
    },
    proportion_25_under: (county_data: County) => {
        return county_data.proportion_25_under;
    }
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
export const getColor = (county: Feature<Geometry, GeoJsonProperties>) => {
    const county_data = data.get(county.id as number);
    if (county_data !== undefined) {
        return cluster_colors[county_data.area_cluster](
            colorByStates[colorByState[0]](county_data)
        );
    }
    return "white";
};

// helper function to allow color reloading in component's effect
export const reloadColors = () => {
    cluster_ranges = [[], [], [], [], []];
    data.values().forEach((element) =>
        cluster_ranges[element.area_cluster].push(colorByStates[colorByState[0]](element))
    );
    cluster_ranges.forEach((range, idx) => {
        cluster_colors[idx] = scaleLinear<string>()
            .domain(extent(range) as [number, number])
            .range(["yellow", "red"]);
    });
};

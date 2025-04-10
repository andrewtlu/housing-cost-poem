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

// map attribute to different info display elements
// tickFormat is used by legend calculated by scale domain, so value will be value received from self.value() method
export const attributeMap = {
    total_population: {
        textLabel: "Total Population",
        textValue: (county: County) => county.total_population.toLocaleString("en-US"),
        value: (county: County) => county.total_population,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    total_population_25_over: {
        textLabel: "Total Population Over 25",
        textValue: (county: County) => county.total_population_25_over.toLocaleString("en-US"),
        value: (county: County) => county.total_population_25_over,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    educational_attainment: {
        textLabel: "% Pop w/ College Degree",
        textValue: (county: County) =>
            `${Math.round((county.educational_attainment / county.total_population) * 100)}%`,
        value: (county: County) => county.educational_attainment / county.total_population,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    median_income: {
        textLabel: "Median Income",
        textValue: (county: County) => `$${county.median_income.toLocaleString("en-US")}`,
        value: (county: County) => county.median_income,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    median_home_value: {
        textLabel: "Median Home Value",
        textValue: (county: County) => `$${county.median_home_value.toLocaleString("en-US")}`,
        value: (county: County) => county.median_home_value,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    white_alone: {
        textLabel: "% Population White",
        textValue: (county: County) =>
            `${Math.round((county.white_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.white_alone / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    black_alone: {
        textLabel: "% Population Black",
        textValue: (county: County) =>
            `${Math.round((county.black_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.black_alone / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    native_alone: {
        textLabel: "% Population Native",
        textValue: (county: County) =>
            `${Math.round((county.native_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.native_alone / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    asian_alone: {
        textLabel: "% Population Asian",
        textValue: (county: County) =>
            `${Math.round((county.asian_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.asian_alone / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    native_hawaiian_pacific_islander: {
        textLabel: "% Population Native Hawaiian/Pacific Islander",
        textValue: (county: County) =>
            `${Math.round((county.native_hawaiian_pacific_islander / county.total_population) * 100)}%`,
        value: (county: County) =>
            county.native_hawaiian_pacific_islander / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    some_other_race_alone: {
        textLabel: "% Population Other",
        textValue: (county: County) =>
            `${Math.round((county.some_other_race_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.some_other_race_alone / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    two_or_more: {
        textLabel: "% Population Mixed",
        textValue: (county: County) =>
            `${Math.round((county.two_or_more / county.total_population) * 100)}%`,
        value: (county: County) => county.two_or_more / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    hispanic_or_latino: {
        textLabel: "% Population Hispanic/Latino",
        textValue: (county: County) =>
            `${Math.round((county.hispanic_or_latino / county.total_population) * 100)}%`,
        value: (county: County) => county.hispanic_or_latino / county.total_population,
        color: ["steelblue", "red"],
        mutedColor: ["#9facb6", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    total_population_25_under: {
        textLabel: "Total Population Under 25",
        textValue: (county: County) => county.total_population_25_under.toLocaleString("en-US"),
        value: (county: County) => county.total_population_25_under,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    proportion_25_under: {
        textLabel: "% Population Under 25",
        textValue: (county: County) => `${Math.round(county.proportion_25_under * 100)}%`,
        value: (county: County) => county.proportion_25_under,
        color: ["#f9ffba", "red"],
        mutedColor: ["#f4f6d7", "#ff8d8d"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    }
};

// what to color by, list is to work around exporting non-const
// to use attribute, do $derived(attributeState[0])
export const attributeState: [MapKeys] = $state(["median_home_value"]);
const attribute = $derived(attributeState[0]);

// color/color calculation used by map
export const cluster_colors = $state([
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>(),
    scaleLinear<string>()
]);
export const muted_cluster_colors = $state([
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
        else
            return muted_cluster_colors[county_data.area_cluster](
                attributeMap[attribute].value(county_data)
            );
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
        muted_cluster_colors[idx] = scaleLinear<string>()
            .domain(extent(range) as [number, number])
            .range(attributeMap[attribute].mutedColor);
    });
};

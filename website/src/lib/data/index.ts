import type { County } from "./countyData.svelte";

export { data, type County, type CountyRaces } from "./countyData.svelte";
export { data as homeSimilarityData } from "./habitatHomeSimilarity.svelte";
export {
    educationData,
    under25Data,
    type MetroEducation as CountyEducation,
    type MetroHomeVsIncome as CountyUnder25
} from "./metroData.svelte";

// attribute of aggregate data to color by
export type MapKeys =
    | "total_population"
    | "total_population_25_over"
    | "median_income"
    | "median_home_value"
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
        tag: "Population",
        textValue: (county: County) => county.total_population.toLocaleString("en-US"),
        value: (county: County) => county.total_population,
        color: ["azure", "gold"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    total_population_25_over: {
        textLabel: "Total Population Over 25",
        tag: "Over 25",
        textValue: (county: County) => county.total_population_25_over.toLocaleString("en-US"),
        value: (county: County) => county.total_population_25_over,
        color: ["azure", "yellow"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    educational_attainment: {
        textLabel: "% Pop w/ College Degree",
        tag: "% w/ College Degree",
        textValue: (county: County) =>
            `${Math.round((county.educational_attainment / county.total_population) * 100)}%`,
        value: (county: County) => county.educational_attainment / county.total_population,
        color: ["azure", "darkviolet"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    median_income: {
        textLabel: "Median Income",
        tag: "Median Income",
        textValue: (county: County) =>
            `$${county.median_income.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        value: (county: County) => county.median_income,
        color: ["azure", "hotpink"],
        tickFormat: (value: number) => `$${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    median_home_value: {
        textLabel: "Median Home Value",
        tag: "Median Home Value",
        textValue: (county: County) =>
            `$${county.median_home_value.toLocaleString("en-US", { minimumFractionDigits: 2 })}`,
        value: (county: County) => county.median_home_value,
        color: ["azure", "red"],
        tickFormat: (value: number) => `$${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    white_alone: {
        textLabel: "% Population White",
        tag: "White",
        textValue: (county: County) =>
            `${Math.round((county.white_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.white_alone / county.total_population,
        color: ["azure", "#1f77b4"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    black_alone: {
        textLabel: "% Population Black",
        tag: "Black",
        textValue: (county: County) =>
            `${Math.round((county.black_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.black_alone / county.total_population,
        color: ["azure", "#ff7f03"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    native_alone: {
        textLabel: "% Population Native",
        tag: "Native",
        textValue: (county: County) =>
            `${Math.round((county.native_alone / county.total_population) * 1000) / 10}%`,
        value: (county: County) => county.native_alone / county.total_population,
        color: ["azure", "#2ca02c"],
        tickFormat: (value: number) => `${Math.round(value * 1000) / 10}%`
    },
    asian_alone: {
        textLabel: "% Population Asian",
        tag: "Asian",
        textValue: (county: County) =>
            `${Math.round((county.asian_alone / county.total_population) * 100)}%`,
        value: (county: County) => county.asian_alone / county.total_population,
        color: ["azure", "#d62728"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    native_hawaiian_pacific_islander: {
        textLabel: "% Population Native Hawaiian/Pacific Islander",
        tag: "Native Hawaiian/Pacific Islander",
        textValue: (county: County) =>
            `${Math.round((county.native_hawaiian_pacific_islander / county.total_population) * 10000) / 100}%`,
        value: (county: County) =>
            county.native_hawaiian_pacific_islander / county.total_population,
        color: ["azure", "#9467bd"],
        tickFormat: (value: number) => `${Math.round(value * 10000) / 100}%`
    },
    some_other_race_alone: {
        textLabel: "% Population Other",
        tag: "Other",
        textValue: (county: County) =>
            `${Math.round((county.some_other_race_alone / county.total_population) * 1000) / 10}%`,
        value: (county: County) => county.some_other_race_alone / county.total_population,
        color: ["azure", "#8c564b"],
        tickFormat: (value: number) => `${Math.round(value * 1000) / 10}%`
    },
    two_or_more: {
        textLabel: "% Population Mixed",
        tag: "Mixed",
        textValue: (county: County) =>
            `${Math.round((county.two_or_more / county.total_population) * 1000) / 10}%`,
        value: (county: County) => county.two_or_more / county.total_population,
        color: ["azure", "#e377c2"],
        tickFormat: (value: number) => `${Math.round(value * 1000) / 10}%`
    },
    hispanic_or_latino: {
        textLabel: "% Population Hispanic/Latino",
        tag: "Hispanic/Latino",
        textValue: (county: County) =>
            `${Math.round((county.hispanic_or_latino / county.total_population) * 100)}%`,
        value: (county: County) => county.hispanic_or_latino / county.total_population,
        color: ["azure", "#7f7f7f"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    },
    total_population_25_under: {
        textLabel: "Total Population Under 25",
        tag: "Under 25",
        textValue: (county: County) => county.total_population_25_under.toLocaleString("en-US"),
        value: (county: County) => county.total_population_25_under,
        color: ["azure", "goldenrod"],
        tickFormat: (value: number) => `${Math.round(value / 1000).toLocaleString("en-US")}k`
    },
    proportion_25_under: {
        textLabel: "% Population Under 25",
        tag: "% Under 25",
        textValue: (county: County) => `${Math.round(county.proportion_25_under * 100)}%`,
        value: (county: County) => county.proportion_25_under,
        color: ["azure", "darkgoldenrod"],
        tickFormat: (value: number) => `${Math.round(value * 100)}%`
    }
};

import dataRaw from "$lib/data/county_aggregated.json";

export const data = $state(
    new Map(
        dataRaw.map((i) => {
            const { id, ...dataPoint } = i;
            return [id, dataPoint];
        })
    )
);

export type County = Omit<(typeof dataRaw)[number], "id">;
export type CountyRaces =
    | "white_alone"
    | "black_alone"
    | "native_alone"
    | "asian_alone"
    | "native_hawaiian_pacific_islander"
    | "some_other_race_alone"
    | "two_or_more"
    | "hispanic_or_latino";

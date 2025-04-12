import { type Keyframe } from "$lib/keyframe.svelte";
import { attributeState, centroidState, setAttributes, setCentroid } from "./map/store.svelte";
import { selectedState, setSelected } from "./scatter/store.svelte";
import { Map } from "./map";
import { ScatterPlot } from "./scatter";
import type { Component } from "svelte";

const verse = 3;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const selectedGraphState: [Component<Record<string, never>, {}, ""> | null] = $state([null]);

/**
 * The keyframes for verse 3.
 */
export const verse3Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [],
        toRun: [
            () => {
                selectedGraphState[0] = Map;
                setCentroid(-1);
                setAttributes([
                    "total_population",
                    "total_population_25_over",
                    "total_population_25_under",
                    "proportion_25_under",
                    "median_income",
                    "median_home_value",
                    "educational_attainment",
                    "white_alone",
                    "black_alone",
                    "native_alone",
                    "asian_alone",
                    "native_hawaiian_pacific_islander",
                    "some_other_race_alone",
                    "two_or_more",
                    "hispanic_or_latino"
                ]);
                attributeState[0] = "total_population";
            }
        ]
    },
    {
        verse: verse,
        bolded: [0],
        toRun: [
            () => {
                selectedGraphState[0] = Map;
                if (centroidState[0] == -1) setCentroid(2);
                setAttributes([
                    "white_alone",
                    "black_alone",
                    "native_alone",
                    "asian_alone",
                    "native_hawaiian_pacific_islander",
                    "some_other_race_alone",
                    "two_or_more",
                    "hispanic_or_latino"
                ]);
                attributeState[0] = "black_alone";
            }
        ]
    },
    {
        verse: verse,
        bolded: [1],
        toRun: [
            () => {
                selectedGraphState[0] = Map;
                if (centroidState[0] == -1) setCentroid(2);
                setAttributes(["median_income", "median_home_value"]);
                attributeState[0] = "median_home_value";
            }
        ]
    },
    {
        verse: verse,
        bolded: [2],
        toRun: [
            () => {
                selectedGraphState[0] = ScatterPlot;
                setSelected("");
            }
        ]
    },
    {
        verse: verse,
        bolded: [3],
        toRun: [
            () => {
                selectedGraphState[0] = ScatterPlot;
                if (selectedState[0] == "") setSelected("black_alone");
            }
        ]
    }
];

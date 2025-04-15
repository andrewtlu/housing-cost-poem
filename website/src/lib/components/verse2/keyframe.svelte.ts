import { type Keyframe } from "$lib/keyframe.svelte";
import type { Component } from "svelte";
import { BarChart } from "./bar";
import { BubbleChart } from "./bubble";
import {
    falseHousingPrice,
    falseMedianIncome,
    falseProportion,
    falseTextOpacity,
    trueHousingPrice,
    trueMedianIncome,
    trueProportion,
    trueTextOpacity
} from "$lib/components/verse2/actions";

const verse = 2;
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export const selectedGraphState: [Component<Record<string, never>, {}, string> | null] = $state([
    null
]);

/**
 * The keyframes for verse 2.
 */
export const verse2Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [0],
        toRun: [
            () => {
                selectedGraphState[0] = BubbleChart;
            }
        ]
    },
    {
        verse: verse,
        bolded: [1],
        toRun: [
            () => {
                selectedGraphState[0] = BubbleChart;
            }
        ]
    },
    {
        verse: verse,
        bolded: [1],
        toRun: [
            () => {
                selectedGraphState[0] = BarChart;
                trueHousingPrice();
                falseMedianIncome();
                falseProportion();
            }
        ]
    },
    {
        verse: verse,
        bolded: [2],
        toRun: [
            () => {
                selectedGraphState[0] = BarChart;
                falseHousingPrice();
                trueMedianIncome();
                falseProportion();
            }
        ]
    },
    {
        verse: verse,
        bolded: [2],
        toRun: [
            () => {
                selectedGraphState[0] = BarChart;
                falseHousingPrice();
                trueProportion();
                falseTextOpacity();
            }
        ]
    },
    {
        verse: verse,
        bolded: [3],
        toRun: [
            () => {
                selectedGraphState[0] = BarChart;
                trueHousingPrice();
                trueMedianIncome();
                trueProportion();
                trueTextOpacity();
            }
        ]
    }
];

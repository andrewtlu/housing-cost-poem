import { type Keyframe } from "$lib/keyframe.svelte";
import { trueMedianIncome, falseMedianIncome, trueHousingPrice, falseHousingPrice, trueProportion, falseProportion, toggleTextOpacity } from '$lib/actions';

const verse = 1;
/**
 * The keyframes for verse 1.
 */
export const verse1Keyframes: Keyframe[] = [
    {
        verse: verse,
        bolded: [0],
        toRun: [trueHousingPrice, falseMedianIncome, falseProportion]
    },
    {
        verse: verse,
        bolded: [1],
        toRun: [falseHousingPrice, trueMedianIncome, falseProportion]
    },
    {
        verse: verse,
        bolded: [2],
        toRun: [falseHousingPrice, trueProportion]
    },
    {
        verse: verse,
        bolded: [3],
        toRun: [trueHousingPrice, trueMedianIncome, trueProportion, toggleTextOpacity]
    }
];

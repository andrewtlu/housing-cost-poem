import dataRaw from "./habitat-similar-home.json";

export const data = $state(
    new Map(
        dataRaw.map((i) => {
            return [i.word, i.similarity];
        })
    )
);

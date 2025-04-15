import dataRaw from "./habitatHomeSimilarity.json";

export const data = $state(
    new Map(
        dataRaw.map((i) => {
            return [i.word, i.similarity];
        })
    )
);

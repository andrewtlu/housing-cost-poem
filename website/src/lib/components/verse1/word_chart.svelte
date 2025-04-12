<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import { homeSimilarityData } from "$lib/data";
    import { extent, scaleLinear } from "d3";
    import { defaultWords } from "./keyframe.svelte";
    import cloud from "d3-cloud";
    import { fade } from "svelte/transition";
    import { Title, Info } from "$lib/components/shared";

    // chart limits
    const similarityExtent = extent(homeSimilarityData.values()) as [number, number];
    const maxFontSize = 100;
    const wordPadding = 3;

    // graph geometry
    const width = 800;
    const height = 630;
    const margin = { top: 20, left: 10, right: 10, bottom: 10 };
    const wordScale = scaleLinear().domain(similarityExtent).range([10, 100]);

    // interactivity
    let hoveredWord = $state("");

    // data
    type WordPlacement = {
        size: number;
        x: number;
        y: number;
        rotate: number;
        text: string;
    };
    const data = $derived(
        Array.from(
            homeSimilarityData.keys().map((i) => {
                return {
                    text: i,
                    size: Math.round(wordScale(homeSimilarityData.get(i) || similarityExtent[0]))
                };
            })
        ).sort((a, b) => b.size - a.size)
    );
    let cloudWords: WordPlacement[] = [];
    let words: WordPlacement[] = $state([]);

    // layout
    const layout = $derived.by(() => {
        cloudWords = [];

        return cloud()
            .size([width, height])
            .words(data)
            .padding(wordPadding)
            .rotate(0)
            .font("Funnel Sans")
            .fontSize((d) =>
                Math.floor(((d.size as number) / wordScale(similarityExtent[1])) * maxFontSize)
            )
            .on("word", ({ size, x, y, rotate, text }) => {
                cloudWords.push({
                    size: size || 0,
                    x: x || 0,
                    y: y || 0,
                    rotate: rotate || 0,
                    text: text || ""
                });
            });
    });
    $effect(() => {
        layout.start();
        words = cloudWords; // necessary to prevent dependency loop :)
    });
</script>

<div
    class="relative flex flex-col overflow-x-clip rounded-md border-2 border-[gray] bg-white/80 font-bold"
>
    <!-- title -->
    <Title title="What Does Home Mean to You?" />

    <!-- info tooltip -->
    <Info
        tooltip="Hover over a word to see cosine similarity with 'Home'. Words collected from Habitat for Humanity's 'What does home mean to you' page, and cosine similarity calculated using API Ninjas' Text Similarity API."
    />

    <!-- cloud -->
    <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
        class="transition-all duration-700"
        text-anchor="middle"
    >
        <g transform={`translate(0, ${margin.bottom + margin.top})`}>
            {#each words as word, idx (idx)}
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <text
                    transform={`translate(${word.x}, ${word.y})`}
                    font-size={word.size}
                    role="button"
                    style={`transition: fill .4s ease; fill: ${
                        defaultWords.includes(word.text)
                            ? hoveredWord == "" || hoveredWord == word.text
                                ? "#51a2ff"
                                : "#b1c8e5"
                            : hoveredWord == word.text
                              ? "#51a2ff"
                              : "#d1d5dc"
                    }`}
                    class="cursor-default bg-gray-300"
                    tabindex={idx}
                    onmouseover={() => {
                        hoveredWord = word.text;
                    }}
                    onmouseleave={() => {
                        hoveredWord = "";
                    }}
                >
                    {word.text}
                </text>
            {/each}

            {#each words as word, idx (idx)}
                <!-- cosine similarity -->
                {#if hoveredWord != "" && hoveredWord == word.text}
                    <g
                        transform={`translate(${word.x}, ${word.y + 20})`}
                        class="pointer-events-none"
                    >
                        <text
                            class="pointer-events-none absolute bottom-5 left-5 z-10 flex flex-col gap-2 text-xs"
                            transition:fade={{ duration: 300 }}
                        >
                            Similarity to Home: {homeSimilarityData.get(word.text)?.toFixed(4)}
                        </text>
                    </g>
                {/if}
            {/each}
        </g>
    </svg>
</div>

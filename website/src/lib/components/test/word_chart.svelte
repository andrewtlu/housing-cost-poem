<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import { homeSimilarityData } from "$lib/data";
    import { extent, scaleLinear } from "d3";
    import { defaultWords } from "./keyframe.svelte";
    import cloud from "d3-cloud";

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
    let cloudWords: {
        size: number;
        x: number;
        y: number;
        rotate: number;
        text: string;
    }[] = [];
    let words = $state(
        [] as {
            size: number;
            x: number;
            y: number;
            rotate: number;
            text: string;
        }[]
    );

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
    <div
        class="absolute left-1/2 top-0 z-10 -translate-x-1/2 rounded-md bg-white/70 text-center text-xl"
    >
        What Does Home Mean to You?
    </div>

    <!-- info tooltip -->
    <div
        class="tooltip tooltip-left absolute bottom-5 right-5 z-10 h-fit w-fit rounded-full p-0 hover:cursor-pointer"
        data-tip={"Hover over a word to see cosine similarity with 'Home'." +
            "\nWords collected from Habitat for Humanity's 'What does home mean to you' page, and cosine similarity calculated using API Ninjas' Text Similarity API."}
    >
        <svg
            fill="#000000"
            xmlns="http://www.w3.org/2000/svg"
            width="25px"
            height="25px"
            viewBox="0 0 488.484 488.484"
            xml:space="preserve"
        >
            <g>
                <g>
                    <path
                        d="M244.236,0.002C109.562,0.002,0,109.565,0,244.238c0,134.679,109.563,244.244,244.236,244.244
                    c134.684,0,244.249-109.564,244.249-244.244C488.484,109.566,378.92,0.002,244.236,0.002z M244.236,413.619
                    c-93.4,0-169.38-75.979-169.38-169.379c0-93.396,75.979-169.375,169.38-169.375s169.391,75.979,169.391,169.375
                    C413.627,337.641,337.637,413.619,244.236,413.619z"
                    />
                    <path
                        d="M244.236,206.816c-14.757,0-26.619,11.962-26.619,26.73v118.709c0,14.769,11.862,26.735,26.619,26.735
                    c14.769,0,26.62-11.967,26.62-26.735V233.546C270.855,218.778,259.005,206.816,244.236,206.816z"
                    />
                    <path
                        d="M244.236,107.893c-19.949,0-36.102,16.158-36.102,36.091c0,19.934,16.152,36.092,36.102,36.092
                    c19.929,0,36.081-16.158,36.081-36.092C280.316,124.051,264.165,107.893,244.236,107.893z"
                    />
                </g>
            </g>
        </svg>
    </div>

    <!-- cloud -->
    <svg
        width={width + margin.left + margin.right}
        height={height + margin.top + margin.bottom}
        class="transition-all duration-700"
        text-anchor="middle"
    >
        <g transform={`translate(0, ${margin.bottom + margin.top})`}>
            {#each words as word, idx (idx)}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                <text
                    transform={`translate(${word.x}, ${word.y})`}
                    font-size={word.size}
                    role="button"
                    style={`transition: fill .4s ease; fill: ${
                        (hoveredWord == "" && defaultWords.includes(word.text)) ||
                        hoveredWord == word.text
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
        </g>
    </svg>
</div>

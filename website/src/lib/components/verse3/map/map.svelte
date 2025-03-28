<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import { data, type County } from "$lib/data";
    import topo from "$lib/data/us-counties.topojson.json";
    import { geoPath, geoAlbers, scaleLinear, extent, zoomIdentity, ZoomTransform } from "d3";
    import { feature, mesh } from "topojson-client";
    import type { Topology, GeometryObject } from "topojson-specification";
    import type { Feature, FeatureCollection, GeoJsonProperties, Geometry } from "geojson";
    import Legend from "./legend.svelte";
    import { fly } from "svelte/transition";

    // data
    const US = topo as unknown as Topology;

    // graph geometry
    const width = 800;
    const height = 640;
    const margin = { top: 10, left: 10, right: 10, bottom: 10 };

    // map geojson
    const counties = feature(US, US.objects.counties) as FeatureCollection;
    const stateMesh = mesh(US, US.objects.states as GeometryObject, (a, b) => a !== b);
    const countryMesh = mesh(US, US.objects.land as GeometryObject);
    const projection = $derived(
        geoAlbers()
            .fitSize([width * 2, height * 2], counties)
            .translate([width / 2, height / 2])
    );
    const path = $derived(geoPath().projection(projection));
    let centroid = $state(-1);
    // centroid of each cluster on map
    // TODO: may be worth clustering DC & Balti together
    const centroids = $derived(
        (() => {
            const out: [number, number][] = [
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0],
                [0, 0]
            ];
            const cnts: number[] = [0, 0, 0, 0, 0];
            for (const county of counties.features.filter(
                (county) => data.get(county.id as number) !== undefined
            )) {
                const cdata = data.get(county.id as number);
                const cluster = cdata?.area_cluster;
                if (cluster == undefined) continue;
                out[cluster][0] += path.centroid(county)[0];
                out[cluster][1] += path.centroid(county)[1];
                cnts[cluster]++;
            }
            return out.map((cluster, idx) => [cluster[0] / cnts[idx], cluster[1] / cnts[idx]]);
        })()
    );
    const centroidNames = $derived(
        (() => {
            const out: string[] = ["", "", "", "", ""];
            for (const county of counties.features.filter(
                (county) => data.get(county.id as number) !== undefined
            )) {
                const cdata = data.get(county.id as number);
                if (cdata == undefined) continue;
                out[cdata.area_cluster] = cdata.metro_area;
            }
            return out;
        })()
    );

    // color
    let cluster_colors = $state([
        scaleLinear<string>(),
        scaleLinear<string>(),
        scaleLinear<string>(),
        scaleLinear<string>(),
        scaleLinear<string>()
    ]);
    const cluster_ranges: number[][] = [[], [], [], [], []];
    const getColor = (county: Feature<Geometry, GeoJsonProperties>) => {
        let county_data = data.get(county.id as number);
        if (county_data !== undefined) {
            return cluster_colors[county_data.area_cluster](county_data.median_home_value);
        }
        return "white";
    };

    // zoom handling
    // TODO: fix blurryness
    const radius = 30;
    let scale = $state(1);
    let translate = $state([0, 0]);
    let transform: ZoomTransform = $state(zoomIdentity.translate(0, 0));
    const zoomToCluster = (cluster_idx: number) => {
        centroid = cluster_idx;
        scale = width / (radius * 2);
        translate[0] = width / 2 - centroids[centroid][0] + margin.left;
        translate[1] = height / 2 - centroids[centroid][1] + margin.top;

        transform = zoomIdentity.scale(scale).translate(translate[0], translate[1]);
    };
    const resetZoom = () => {
        centroid = -1;
        scale = 1;
        translate = [0, 0];
        transform = zoomIdentity.translate(translate[0], translate[1]).scale(scale);
    };

    // county hovering handling
    let hovered_county: County | null = $state(null);
    const handleHover = (id: number) => {
        const county = data.get(id);
        hovered_county = county !== undefined ? county : null;
    };

    // load variables dependent on data
    $effect(() => {
        if (data) {
            data.values().forEach((element) =>
                cluster_ranges[element.area_cluster].push(element.median_home_value)
            );
            cluster_ranges.forEach((range, idx) => {
                cluster_colors[idx] = scaleLinear<string>()
                    .domain(extent(range) as [number, number])
                    .range(["yellow", "red"]);
            });
        }
    });
</script>

<div
    class="relative flex flex-col overflow-x-clip rounded-md border-2 border-[gray] bg-white/80 font-bold"
>
    <!-- title -->
    <div
        class="absolute top-0 left-1/2 z-10 -translate-x-1/2 rounded-md bg-white/70 text-center text-xl"
    >
        Median Housing Cost Percentage of Metro Area Maximum
    </div>

    <!-- reset zoom button -->
    {#if centroid !== -1}
        <button
            aria-label="reset-zoom"
            class="reset-zoom btn absolute top-5 left-5 z-10 flex h-fit w-fit items-center rounded-full p-0 pr-2 align-middle"
            onclick={resetZoom}
            transition:fly={{ x: -500, duration: 700 }}
        >
            <svg
                fill="#000000"
                width="25px"
                height="25px"
                viewBox="0 0 200 200"
                xmlns="http://www.w3.org/2000/svg"
                ><path
                    d="M100,15a85,85,0,1,0,85,85A84.93,84.93,0,0,0,100,15Zm0,150a65,65,0,1,1,65-65A64.87,64.87,0,0,1,100,165ZM116.5,57.5a9.67,9.67,0,0,0-14,0L74,86a19.92,19.92,0,0,0,0,28.5L102.5,143a9.9,9.9,0,0,0,14-14l-28-29L117,71.5C120.5,68,120.5,61.5,116.5,57.5Z"
                /></svg
            >
            <div class="font-medium">Reset Zoom</div>
        </button>
    {/if}

    {#if centroid !== -1}
        <div
            class="pointer-events-none absolute bottom-5 left-5 z-10 flex flex-col gap-2"
            transition:fly={{ x: -500, duration: 700 }}
        >
            {#key centroid}
                {#if hovered_county}
                    <div
                        class="w-fit rounded-md border-2 border-[gray] bg-white/80 px-5"
                        transition:fly={{ x: -500, duration: 700 }}
                    >
                        <ul>
                            <li>{hovered_county.county}</li>
                            <li>Median Home Value: ${hovered_county.median_home_value}</li>
                            <li>
                                % Pop w/ College Degree: {Math.round(
                                    (hovered_county.educational_attainment /
                                        hovered_county.total_population) *
                                        100
                                )}%
                            </li>
                        </ul>
                    </div>
                {/if}
                <div class="w-fit rounded-md border-2 border-[gray] bg-white/80 px-5">
                    <Legend
                        width={width + margin.left + margin.right}
                        color={cluster_colors[centroid]}
                    />
                </div>
                <div
                    class="text-md w-fit rounded-md border-2 border-[gray] bg-white/80 px-5 text-wrap"
                >
                    Metro Area:
                    {centroidNames[centroid]}
                </div>
            {/key}
        </div>
    {/if}

    <!-- info tooltip -->
    <div
        class="tooltip tooltip-left absolute right-5 bottom-5 z-10 h-fit w-fit rounded-full p-0 hover:cursor-pointer"
        data-tip={"Click on a colored metro area to view details!" +
            "\nData collected from US Census Bureau, censusreporter.org, and Logan et al.’s Longitudinal Tract Data Base (2000) and compiled on Kaggle."}
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

    <!-- graph -->
    <div class="border-gray overflow-hidden rounded-md">
        {#if width}
            <svg
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
                class="transition-all duration-700"
                transform={transform.toString()}
            >
                <!-- double iterator is mad inefficient, but this is the only way to render selected counties over counties with no info -->
                {#each counties.features as county, idx (idx)}
                    {#if data.get(county.id as number) === undefined}
                        <path
                            d={path(county)}
                            fill="white"
                            stroke="whitesmoke"
                            stroke-width="0.2"
                        />
                    {/if}
                {/each}
                {#each counties.features as county, idx (idx)}
                    {#if data.get(county.id as number) !== undefined}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                        <path
                            d={path(county)}
                            fill={getColor(county)}
                            stroke="lightgray"
                            stroke-width="0.2"
                            role="button"
                            class="hover:cursor-pointer"
                            tabindex={idx}
                            onmouseover={() => {
                                handleHover(county.id as number);
                            }}
                            onmouseleave={() => {
                                handleHover(-1);
                            }}
                            onclick={() => {
                                const cty = data.get(county.id as number);
                                if (cty && cty !== undefined) zoomToCluster(cty.area_cluster);
                            }}
                        />
                    {/if}
                {/each}

                {#if stateMesh}
                    <path d={path(stateMesh)} fill="none" stroke="gray" stroke-width="0.2" />
                {/if}

                {#if countryMesh}
                    <path d={path(countryMesh)} fill="none" stroke="gray" stroke-width="0.2" />
                {/if}

                {#each centroids as centroid, idx (idx)}
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- yeah not very accessible but the entire chart is hard to nav without mouse -->
                    <circle
                        cx={centroid[0]}
                        cy={centroid[1]}
                        r={radius}
                        fill="red"
                        class={`opacity-0 ${scale == 1 ? "hover:cursor-pointer" : "pointer-events-none"}`}
                        role="button"
                        tabindex={idx}
                        onclick={() => zoomToCluster(idx)}
                    />
                {/each}

                <!-- TODO: legend, interactive components -->
            </svg>
        {/if}
    </div>
</div>

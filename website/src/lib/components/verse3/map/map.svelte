<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import { attributeMap, data, type County } from "$lib/data";
    import topo from "$lib/data/us-counties.topojson.json";

    import { geoPath, geoAlbers, zoomIdentity, ZoomTransform } from "d3";
    import { feature, mesh } from "topojson-client";
    import type { Topology, GeometryObject } from "topojson-specification";
    import type { FeatureCollection } from "geojson";

    import { untrack } from "svelte";
    import { fly } from "svelte/transition";

    import {
        cluster_colors,
        attributeState,
        getColor,
        reloadColors,
        setCentroid,
        centroidState,
        attributes,
        setAttribute
    } from "./store.svelte";

    import Legend from "./legend.svelte";
    import CountyInfo from "./countyInfo.svelte";
    import { Title, Info, AttributeSelect } from "$lib/components/common";

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
    let centroid = $derived(centroidState[0]);
    // centroid of each cluster on map
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

    // zoom handling
    const radius = 30;
    let scale = $state(1);
    let translate = $state([0, 0]);
    let transform: ZoomTransform = $state(zoomIdentity.translate(0, 0));
    const zoomUpdate = (centroid: number) => {
        if (centroid == -1) {
            scale = 1;
            translate = [0, 0];
            transform = zoomIdentity.translate(translate[0], translate[1]).scale(scale);
        } else {
            scale = width / (radius * 2);
            translate[0] = width / 2 - centroids[centroid][0] + margin.left;
            translate[1] = height / 2 - centroids[centroid][1] + margin.top;

            transform = zoomIdentity.scale(scale).translate(translate[0], translate[1]);
        }
    };
    $effect(() => {
        // for some reason having raw zoomUpdate() without untrack causes infinite effect loop
        if (centroid !== null) untrack(() => zoomUpdate(centroid));
    });

    // county hovering handling
    let hovered_county: County | null = $state(null);
    const handleHover = (id: number) => {
        const county = data.get(id);
        if (county !== undefined && county.area_cluster == centroid) hovered_county = county;
        else hovered_county = null;
    };

    // load variables dependent on data
    const attribute = $derived(attributeState[0]);
    $effect(() => {
        if (data && attribute) {
            reloadColors();
        }
    });
</script>

<div
    class="relative flex flex-col overflow-x-clip rounded-md border-2 border-[gray] bg-white/80 font-bold"
>
    <Title title={`${attributeMap[attribute].textLabel} Compared to Metro Area Maximum`} />

    <!-- reset zoom button -->
    {#if centroid !== -1}
        <button
            aria-label="reset-zoom"
            class="reset-zoom btn absolute top-5 left-5 z-10 flex h-fit w-fit items-center rounded-full p-0 pr-2 align-middle"
            onclick={() => setCentroid(-1)}
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
                <CountyInfo {hovered_county} />
                <Legend
                    width={width + margin.left + margin.right}
                    color={cluster_colors[centroid]}
                />
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
    <Info
        tooltip="Click on a colored metro area to view details, or a dot to change the attribute! Data collected from US Census Bureau, censusreporter.org, and Logan et al.'s Longitudinal Tract Data Base (2000) and compiled on Kaggle."
    />

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
                            fill={getColor(county, centroid)}
                            style="transition: fill .4s ease;"
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
                                if (cty && cty !== undefined) setCentroid(cty.area_cluster);
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
                        onclick={() => setCentroid(idx)}
                    />
                {/each}
            </svg>
        {/if}
    </div>

    <AttributeSelect {attributes} {setAttribute} selected={attribute} />
</div>

<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import dataRaw from "$lib/data/county_aggregated.json";
    import topo from "$lib/data/us-counties.topojson.json";
    import { geoPath, geoAlbers, scaleLinear, extent, zoomIdentity, ZoomTransform } from "d3";
    import { feature, mesh } from "topojson-client";
    import type { Topology, GeometryObject } from "topojson-specification";
    import type { FeatureCollection } from "geojson";

    // data
    const US = topo as unknown as Topology;
    const data = $state(
        new Map(
            dataRaw.map((i) => {
                const { id, ...dataPoint } = i;
                return [id, dataPoint];
            })
        )
    );

    // graph geometry
    let chart: SVGElement | null = $state(null);
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

    // color
    // TODO: color by cluster (ie, not scaled across all counties but just surrounding counties)
    let color = $state(scaleLinear<string>());
    $effect(() => {
        if (data) {
            const values = Array.from(data.values(), (d) => {
                if (d.median_home_value != null) return d.median_home_value;
                return 0;
            });
            color = scaleLinear<string>()
                .domain(extent(values) as [number, number])
                .range(["white", "red"]);
        }
    });

    // zoom handling
    const radius = 30;
    let scale = $state(1);
    let translate = $state([0, 0]);
    let transform: ZoomTransform = $state(zoomIdentity.translate(0, 0));

    const zoomToCluster = (centroid: [number, number]) => {
        scale = width / (radius * 2);
        translate[0] = width / 2 - centroid[0] + margin.left;
        translate[1] = height / 2 - centroid[1] + margin.top;

        transform = zoomIdentity.scale(scale).translate(translate[0], translate[1]);
    };

    const resetZoom = () => {
        scale = 1;
        translate = [0, 0];
        transform = zoomIdentity.translate(translate[0], translate[1]).scale(scale);
    };
</script>

<div class="flex flex-col gap-2">
    <div class="border-gray overflow-hidden rounded-md border-2 border-[gray] bg-white/80">
        {#if width}
            <svg
                width={width + margin.left + margin.right}
                height={height + margin.top + margin.bottom}
                transform={transform.toString()}
                class=""
                bind:this={chart}
            >
                <!-- double iterator is mad inefficient, but this is the only way to render selected counties over counties with no info -->
                {#each counties.features as county}
                    {#if data.get(county.id as number) === undefined}
                        <path
                            d={path(county)}
                            fill="white"
                            stroke="whitesmoke"
                            stroke-width="0.2"
                        />
                    {/if}
                {/each}
                {#each counties.features as county, idx}
                    {#if data.get(county.id as number) !== undefined}
                        <!-- svelte-ignore a11y_click_events_have_key_events -->
                        <!-- svelte-ignore a11y_mouse_events_have_key_events -->
                        <path
                            d={path(county)}
                            fill={data.get(county.id as number)?.median_home_value &&
                            data.get(county.id as number)?.median_home_value !== undefined
                                ? color(data.get(county.id as number)?.median_home_value as number)
                                : "white"}
                            stroke="lightgray"
                            stroke-width="0.2"
                            role="button"
                            class="hover:cursor-pointer"
                            tabindex={idx}
                            onmouseover={() => {
                                const cty = data.get(county.id as number);
                                if (cty && cty !== undefined) console.log(cty.median_home_value);
                            }}
                            onclick={() => {
                                const cty = data.get(county.id as number);
                                if (cty && cty !== undefined)
                                    zoomToCluster(centroids[cty.area_cluster] as [number, number]);
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

                {#each centroids as centroid, idx}
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
                        onclick={() => zoomToCluster(centroid as [number, number])}
                    />
                {/each}

                <!-- TODO: legend, interactive components -->
            </svg>
        {/if}
    </div>

    <button aria-label="reset-zoom" class="btn" onclick={resetZoom}>Reset Zoom</button>
</div>

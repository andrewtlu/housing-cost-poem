<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import dataRaw from "$lib/data/county_aggregated.json";
    import topo from "$lib/data/us-counties.topojson.json";
    import { geoPath, geoAlbers, scaleLinear, extent } from "d3";
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

    // color
    // TODO: color by cluster (ie, not scaled across all counties but just surrounding counties)
    let color = $state(scaleLinear<string>());

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
</script>

<div>
    {#if width}
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
        >
            {#each counties.features as county}
                {#if data.get(county.id as number) !== undefined}
                    <path
                        d={path(county)}
                        fill={data.get(county.id as number)?.median_home_value &&
                        data.get(county.id as number)?.median_home_value !== undefined
                            ? color(data.get(county.id as number)?.median_home_value as number)
                            : "white"}
                        stroke="lightgray"
                        stroke-width="1"
                        role="contentinfo"
                        onfocus={() => {}}
                        onmouseover={() => {
                            const cty = data.get(county.id as number);
                            if (cty && cty !== undefined) console.log(cty.median_home_value);
                        }}
                    />
                {:else}
                    <path d={path(county)} fill="white" stroke="whitesmoke" />
                {/if}
            {/each}

            {#if stateMesh}
                <path d={path(stateMesh)} fill="none" stroke="gray" stroke-width="0.5" />
            {/if}

            {#if countryMesh}
                <path d={path(countryMesh)} fill="none" stroke="gray" stroke-width="0.5" />
            {/if}

            {#each centroids as centroid, idx}
                <!-- svelte-ignore a11y_click_events_have_key_events -->
                <!-- yeah not very accessible but the entire chart is hard to nav without mouse -->
                <circle
                    cx={centroid[0]}
                    cy={centroid[1]}
                    r="25"
                    fill="gray"
                    class="opacity-0 hover:cursor-pointer"
                    role="button"
                    tabindex={idx}
                    onclick={() => {
                        console.log("clicked centroid ", centroid);
                    }}
                />
            {/each}

            <!-- TODO: legend, interactive components -->
            <!-- TODO: adaptive zoom, https://chatgpt.com/c/67e0bd02-e96c-8010-baa7-fcc7425b6edc -->
        </svg>
    {/if}
</div>

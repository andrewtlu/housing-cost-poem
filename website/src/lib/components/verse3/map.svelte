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

    // data loading
    const centroids = $derived(
        counties.features
            .map((county) => ({
                id: county.id as number,
                centroid: path.centroid(county)
            }))
            .filter((county) => data.get(county.id) !== undefined)
    );

    // for each metro area get average center
    const clusterCentroids = "";

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

    $effect(() => {
        console.log(
            "Counties:",
            counties.features,
            "Data:",
            data.size,
            "Centroids:",
            clusterCentroids
        );
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

            <!-- {#each clusterCentroids.centroids as centroid}
                <circle cx={centroid[0]} cy={centroid[1]} r="25" />
            {/each} -->

            {#if stateMesh}
                <path d={path(stateMesh)} fill="none" stroke="gray" stroke-width="0.5" />
            {/if}

            {#if countryMesh}
                <path d={path(countryMesh)} fill="none" stroke="gray" stroke-width="0.5" />
            {/if}

            <!-- TODO: legend, interactive components -->
            <!-- TODO: adaptive zoom, https://chatgpt.com/c/67e0bd02-e96c-8010-baa7-fcc7425b6edc -->
        </svg>
    {/if}
</div>

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
</script>

<div>
    {#if width}
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
        >
            {#each counties.features as county}
                <path d={path(county)} fill={"white"} stroke="lightgray" stroke-width="1" />
            {/each}

            {#if stateMesh}
                <path d={path(stateMesh)} fill="none" stroke="gray" stroke-width="1" />
            {/if}

            {#if countryMesh}
                <path d={path(countryMesh)} fill="none" stroke="gray" stroke-width="1" />
            {/if}

            <!-- TODO: legend, interactive components -->
        </svg>
    {/if}
</div>

<!-- @component
map component used in verse 3 for visualizing geographic data
-->
<script lang="ts">
    import { feature } from "$lib/util";
    import countyGeojson from "$lib/data/map/counties.geo.json";
    import stateGeojson from "$lib/data/map/states.geo.json";
    import { geoPath, geoAlbersUsa } from "d3";

    // graph geometry
    let margin = { top: 10, left: 10, right: 10, bottom: 10 };
    let width = $state(100);
    let height = $derived(width * 0.8);

    // map geojson
    let counties = countyGeojson.features;
    let stateMesh = stateGeojson.features;
    let projection = $derived(
        geoAlbersUsa()
            .fitSize([width, height], feature(counties))
            .translate([width / 2, height / 2])
    );
    let path = $derived(geoPath().projection(projection));

    // color & data
    let color;
    $effect(() => {});
</script>

<div bind:clientWidth={width}>
    {#if width}
        <svg
            width={width + margin.left + margin.right}
            height={height + margin.top + margin.bottom}
        >
        </svg>
    {/if}
</div>

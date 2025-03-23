import type { FeatureCollection, Polygon, MultiPolygon, Feature } from "geojson";

export default function feature(geojsonFeatures: ({
    type: string;
    properties: { id: string };
    geometry: {
        type: string;
        coordinates: number[][][];
    };
} | {
    type: string;
    properties: { id: string };
    geometry: {
        type: string;
        coordinates: number[][][][];
    };
})[]): FeatureCollection<Polygon | MultiPolygon> {
    return {
        type: "FeatureCollection",
        features: geojsonFeatures.map(feature => ({
            type: "Feature",
            properties: feature.properties,
            geometry: {
                type: feature.geometry.type as "Polygon" | "MultiPolygon",
                coordinates: feature.geometry.coordinates,
            }
        }) as Feature<Polygon | MultiPolygon>)
    }
}

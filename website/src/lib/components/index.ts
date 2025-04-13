// place files you want to import through the `$lib/components` alias in this folder.

import Title from "./title/title.svelte";
import Verse1 from "./verse1/verse1.svelte";
import Verse2 from "./verse2/verse2.svelte";
import Verse3 from "./verse3/verse3.svelte";
import Verse4 from "./verse4/verse4.svelte";

export const verses = {
    0: Title,
    1: Verse1,
    2: Verse2,
    3: Verse3,
    4: Verse4
};

export { default as Title } from "./title/title.svelte";
export { default as Verse1 } from "./verse1/verse1.svelte";
export { default as Verse2 } from "./verse2/verse2.svelte";
export { default as Verse3 } from "./verse3/verse3.svelte";
export { default as Verse4 } from "./verse4/verse4.svelte";
export { default as Parallax } from "./parallax.svelte";
export { default as Nav } from "./nav.svelte";

export { titleKeyframes } from "./title/keyframe";
export { verse1Keyframes } from "./verse1/keyframe.svelte";
export { verse2Keyframes } from "./verse2/keyframe";
export { verse3Keyframes } from "./verse3/keyframe.svelte";
export { verse4Keyframes } from "./verse4/keyframe";

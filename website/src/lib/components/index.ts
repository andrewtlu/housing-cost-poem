// place files you want to import through the `$lib/components` alias in this folder.

import { Title } from "./title";
import { Verse1 } from "./verse1";
import { Verse2 } from "./verse2";
import { Verse3 } from "./verse3";
import { Verse4 } from "./verse4";

export const verses = {
    0: Title,
    1: Verse1,
    2: Verse2,
    3: Verse3,
    4: Verse4
};

export { Title } from "./title";
export { Verse1 } from "./verse1";
export { Verse2 } from "./verse2";
export { Verse3 } from "./verse3";
export { Verse4 } from "./verse4";
export { default as City } from "./City.svelte";
export { default as Sunrise } from "./Sunrise.svelte";
export { default as Navbar } from "./Navbar.svelte";
export { default as Lines } from "./Lines.svelte";

export { titleKeyframes } from "./title";
export { verse1Keyframes } from "./verse1";
export { verse2Keyframes } from "./verse2";
export { verse3Keyframes } from "./verse3";
export { verse4Keyframes } from "./verse4";

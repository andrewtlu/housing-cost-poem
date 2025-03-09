<!--@component
Navigation component on the bottom of the screen to navigate keyframes with clicking instead of scrolling.
 -->
<script lang="ts">
    import { keyframes, keyframe } from "$lib";

    const navTo = (i: number) => {
        keyframe.set(i);
    };
</script>

<ul
    class="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 flex-row gap-5 rounded-full bg-white p-2"
>
    {#each keyframes as _, i (i)}
        <li class="flex origin-center items-center align-middle">
            <button
                class={[
                    "h-2 w-2 cursor-pointer overflow-hidden rounded-full bg-black transition-all hover:scale-250",
                    keyframe.value == i ? "scale-200" : ""
                ]}
                aria-label={`${i}`}
                onclick={() => navTo(i)}
            ></button>
        </li>
    {/each}
</ul>

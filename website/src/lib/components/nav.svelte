<!--@component
Navigation component on the bottom of the screen to navigate keyframes with clicking instead of scrolling.
 -->
<script lang="ts">
    import { keyframes, keyframe } from "$lib";

    const navTo = (i: number) => {
        keyframe.set(i);
    };

    const backward = () => {
        keyframe.decrement();
    };

    const forward = () => {
        keyframe.increment();
    };
</script>

<ul
    class="absolute bottom-10 left-1/2 z-50 flex -translate-x-1/2 flex-row items-center gap-5 rounded-full p-2 align-middle"
>
    <li class="flex origin-center items-center align-middle">
        <button
            class="-mr-1.5 origin-center cursor-pointer overflow-hidden transition hover:scale-150"
            onclick={backward}
            aria-label="back arrow"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M6.325 12.85q-.225-.15-.337-.375T5.874 12t.113-.475t.337-.375l8.15-5.175q.125-.075.263-.112T15 5.825q.4 0 .7.288t.3.712v10.35q0 .425-.3.713t-.7.287q-.125 0-.262-.038t-.263-.112z"
                ></path>
            </svg>
        </button>
    </li>
    {#each keyframes as _, i (i)}
        <li class="flex items-center align-middle">
            <button
                class={[
                    "hover:scale-200 -m-0.5 h-3.5 w-3.5 origin-center cursor-pointer p-1 transition-all",
                    keyframe.value == i ? "scale-200" : ""
                ]}
                aria-label={`keyframe ${i}`}
                onclick={() => navTo(i)}
            >
                <div class="h-full w-full rounded-full bg-black"></div>
            </button>
        </li>
    {/each}
    <li class="flex origin-center items-center align-middle">
        <button
            class="-ml-1.5 origin-center cursor-pointer overflow-hidden transition hover:scale-150"
            onclick={forward}
            aria-label="forward arrow"
        >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24">
                <path
                    fill="currentColor"
                    d="M8 17.175V6.825q0-.425.3-.713t.7-.287q.125 0 .263.037t.262.113l8.15 5.175q.225.15.338.375t.112.475t-.112.475t-.338.375l-8.15 5.175q-.125.075-.262.113T9 18.175q-.4 0-.7-.288t-.3-.712"
                ></path>
            </svg>
        </button>
    </li>
</ul>

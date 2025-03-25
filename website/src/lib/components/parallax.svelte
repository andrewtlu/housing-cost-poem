<!-- @component
Parallax component, used to render the city skyline in the background of the poem
 -->
<script lang="ts">
    import { base } from "$app/paths";
    import { onMount } from "svelte";

    /** DOM element of scroll */
    let { scrollContainer }: { scrollContainer: Element } = $props();
    /** The current scroll position */
    let scrollLeft = $state(0);
    /** The maximum scroll position */
    let maxScroll = $state(1);

    /** Update scroll position */
    const handleScroll = () => {
        scrollLeft = scrollContainer.scrollLeft;
    };

    /** Update the maximum scroll position */
    const updateMaxScroll = () => {
        maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
    };

    onMount(() => {
        scrollContainer.addEventListener("scroll", handleScroll);
        window.addEventListener("resize", updateMaxScroll);

        updateMaxScroll();

        return () => {
            // clean listeners when component is unmounted
            scrollContainer.removeEventListener("scroll", handleScroll);
            window.removeEventListener("resize", updateMaxScroll);
        };
    });
</script>

<div class="absolute top-0 -z-50 h-screen w-screen overflow-hidden">
    <!-- trust me the math works -->
    <img
        src={`${base}/city.png`}
        alt="background parallax city"
        class="absolute bottom-0 left-0 -translate-y-1/2 scale-200"
        style={`transform: translateX(${25 - (scrollLeft / maxScroll) * 50}%)`}
    />
</div>

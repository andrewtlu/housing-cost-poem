<script lang="ts">
    var radius = 1;
    var getRadius = () => ++radius;
    let data = $state([
        { x: 180, y: 30, r: 1, fill: "orange" },
        { x: 100, y: 40, r: 0, fill: "red" },
        { x: 170, y: 160, r: 0, fill: "cyan" },
        { x: 120, y: 220, r: 0, fill: "yellow" },
        { x: 30, y: 100, r: 0, fill: "fuchsia" }
    ]);

    function updateState() {
        data[0].r = data[0].r + 4;
    }

    function reset() {
        data = [
            { x: 180, y: 30, r: 1, fill: "orange" },
            { x: 100, y: 40, r: 0, fill: "red" },
            { x: 170, y: 160, r: 0, fill: "cyan" },
            { x: 120, y: 220, r: 0, fill: "yellow" },
            { x: 30, y: 100, r: 0, fill: "fuchsia" }
        ];
        radius = 1;
    }
</script>

<div class="m-1 flex flex-col items-center gap-2 align-middle">
    <svg width="300" height="300" viewBox="0 0 250 250" class="bg-gray-400">
        {#each data as d, i (i)}
            {#if i === 0}
                <circle cx={d.x} cy={d.y} r={d.r + 4} stroke="white" fill="none" />
                <circle cx={d.x} cy={d.y} r={d.r} fill={d.fill} />
            {:else}
                <circle cx={d.x} cy={d.y} r={d.r + getRadius()} fill={d.fill} />
            {/if}
        {/each}
    </svg>
    <div class="flex flex-row gap-2">
        <button class="btn btn-sm" onclick={updateState}>Update</button>
        <button class="btn btn-sm" onclick={reset}>Reset</button>
    </div>
</div>

<style>
    circle {
        transition: all 1s ease;
    }
</style>

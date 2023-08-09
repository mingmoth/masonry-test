<script setup>
import useMasonry from '../hook/masonry';

const { columnCounts } = useMasonry();
</script>

<template>
    <div
        class="masonry"
        :style="{
            'column-count': columnCounts,
        }"
    >
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
// .masonry {
//     column-count: 5;
//     display: grid;
//     grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
//     gap: 1rem;
// }
</style>

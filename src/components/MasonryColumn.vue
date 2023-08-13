<script setup>
import useMasonry from '../hook/masonry';

const { columnCounts } = useMasonry();
</script>

<template>
    <div
        :style="{
            'column-count': columnCounts,
        }"
    >
        <slot></slot>
    </div>
</template>

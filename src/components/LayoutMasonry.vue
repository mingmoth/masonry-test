<script setup>
</script>

<template>
    <div class="masonry">
        <slot></slot>
    </div>
</template>

<style lang="scss" scoped>
.masonry {
    // column-count: 5;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1rem;
}
</style>

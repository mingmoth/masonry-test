<script setup>
import { computed, onBeforeUnmount, onMounted, watch } from 'vue';
import imagesLoaded from 'imagesloaded';

const props = defineProps({
    images: {
        type: Array,
        default: () => ([])
    },
    columnCount: {
        type: Number,
        default: 0
    },
    gap: {
        type: [Number, String],
        default: 12
    }
});

const columnCount = computed(() => {
    return props.columnCount > 0 ? props.columnCount : 'auto-fill';
});

function resizeGridItem (item) {
    const grid = document.getElementsByClassName('masonry-root')[0];
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const rowSpan = Math.round((item.querySelector('.masonry-cell').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllGridItems () {
    const allItems = document.getElementsByClassName('masonry-item');
    for (let x = 0; x < allItems.length; x++) {
        imagesLoaded(allItems[x], resizeInstance);
    }
}

function resizeInstance (instance) {
    const item = instance.elements[0];
    resizeGridItem(item);
}

onMounted(() => {
    window.addEventListener('resize', resizeAllGridItems);
    const allItems = document.getElementsByClassName('masonry-item');
    for (let x = 0; x < allItems.length; x++) {
        imagesLoaded(allItems[x], resizeInstance);
    }
});

watch(
    [() => props.images, () => props.columnCount],
    async () => {
        setTimeout(() => resizeAllGridItems());
    },
    { deep: true }
);

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeAllGridItems);
});

</script>

<template>
    <div
        class="masonry-root"
        :style="{
            '--column-count': columnCount,
            '--gap': `${gap}px`
        }"
    >
        <slot></slot>
    </div>
</template>

<style lang="scss">
.masonry-root {
    display: grid;
    gap: var(--gap);
    grid-template-columns: repeat(var(--column-count), minmax(145px, 1fr));
    grid-auto-rows: 1px;
}
</style>

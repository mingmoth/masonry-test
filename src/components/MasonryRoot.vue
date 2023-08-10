<script setup>
import { onBeforeUnmount, onMounted, watch } from 'vue';
import imagesLoaded from 'imagesloaded';

const props = defineProps({
    images: {
        type: Array,
        default: () => ([])
    }
});

function resizeGridItem (item) {
    const grid = document.getElementsByClassName('masonry-root')[0];
    const rowHeight = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-auto-rows'));
    const rowGap = parseInt(window.getComputedStyle(grid).getPropertyValue('grid-row-gap'));
    const rowSpan = Math.ceil((item.querySelector('.masonry-cell').getBoundingClientRect().height + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = 'span ' + rowSpan;
}

function resizeAllGridItems () {
    const allItems = document.getElementsByClassName('masonry-item');
    for (let x = 0; x < allItems.length; x++) {
        resizeGridItem(allItems[x]);
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
    () => props.images,
    async () => {
        resizeAllGridItems();
    },
    { deep: true }
);

onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeAllGridItems);
});

</script>

<template>
    <div class="masonry-root">
        <slot></slot>
    </div>
</template>

<style lang="scss">
.masonry-root {
    display: grid;
    grid-gap: 12px;
    grid-template-columns: repeat(auto-fill, minmax(145px, 1fr));
    grid-auto-rows: 4px;
}
</style>

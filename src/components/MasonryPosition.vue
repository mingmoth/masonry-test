<script>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

const MASONRY_PATTERN = {
    M: 'm',
    Z: 'z'
};
</script>

<script setup>
const props = defineProps({
    items: {
        type: Array,
        default: () => ([])
    },
    columnCount: {
        type: [Number, String],
        default: 1
    },
    gap: {
        type: [Number, String],
        default: 12
    },
    pattern: {
        type: String,
        default: 'm',
        validator: (val) => Object.values(MASONRY_PATTERN).includes(val)
    }
});

// DOM refs
const masonryRoot = ref(null);
const masonryCell = ref(null);

// Data
const columns = ref([]);
const currentItemCount = ref(0);

// Computed
const itemsCount = computed(() => props.items.length);
const itemsHeightCollection = ref([]);

const columnCount = computed(() => Number(props.columnCount));
const gap = computed(() => Number(props.gap));

// Functions
function initColumns () {
    if (columns.value.length) {
        return;
    }
    columns.value = Array.from({ length: columnCount.value }).map(() => {
        return {
            cells: 0,
            height: 0
        };
    });
}

async function placeFirstRow () {
    for (let idx = 0; idx < columnCount.value; idx++) {
        itemsHeightCollection.value[idx].el.style.top = 0;
        const leftWidth = (itemsHeightCollection.value[idx].el.offsetWidth + gap.value) * (idx);
        itemsHeightCollection.value[idx].el.style.left = `${leftWidth}px`;
        columns.value[idx].height += itemsHeightCollection.value[idx].el.offsetHeight + gap.value;
        columns.value[idx].cells += 1;
        currentItemCount.value++;
    }
}

async function placeSequenceRow () {
    while (currentItemCount.value < itemsCount.value) {
        if (props.pattern === MASONRY_PATTERN.M) {
            placeMasonryOrder();
        } else {
            placeZPatternOrder();
        }
        currentItemCount.value++;
    }
}

function placeMasonryOrder () {
    const heightMap = columns.value.map(column => column.height);
    const minHeight = Math.min(...Object.values(heightMap));
    const minHeightIndex = heightMap.indexOf(minHeight);
    const leftWidth = (itemsHeightCollection.value[currentItemCount.value].el.offsetWidth + gap.value) * (minHeightIndex);
    placeItemPosition(minHeightIndex, leftWidth);
}

function placeZPatternOrder () {
    const heightMap = columns.value.map(column => column.cells);
    const minCell = Math.min(...Object.values(heightMap));
    const minCellIndex = heightMap.indexOf(minCell);
    const leftWidth = (itemsHeightCollection.value[currentItemCount.value].el.offsetWidth + gap.value) * (minCellIndex);
    placeItemPosition(minCellIndex, leftWidth);
}

function placeItemPosition (index, width) {
    itemsHeightCollection.value[currentItemCount.value].el.style.top = `${columns.value[index].height}px`;
    itemsHeightCollection.value[currentItemCount.value].el.style.left = `${width}px`;
    columns.value[index].cells += 1;
    columns.value[index].height += itemsHeightCollection.value[currentItemCount.value].el.offsetHeight + gap.value;
}

function getItemsRef () {
    return masonryCell.value.map(el => {
        return { el };
    });
}

async function layoutDisplay () {
    if (columnCount.value < 1) return;
    initColumns();
    itemsHeightCollection.value = getItemsRef();
    if (currentItemCount.value < columns.value.length) {
        await placeFirstRow();
        await placeSequenceRow();
    } else {
        await placeSequenceRow();
    }
}

async function awaitImagesLoaded () {
    if (columnCount.value < 1) return;
    const images = masonryRoot.value.querySelectorAll('img');
    let imagesLength = images.length;
    for (let i = 0; i < images.length; i++) {
        images[i].onload = function () {
            imagesLength--;
            if (imagesLength === 0) {
                layoutDisplay();
            }
        };
    }
}

async function resetDisplay () {
    if (columnCount.value < 1) return;
    columns.value = [];
    currentItemCount.value = 0;
    setTimeout(() => {
        awaitImagesLoaded();
        layoutDisplay();
    });
}

onMounted(async () => {
    await awaitImagesLoaded();
    window.addEventListener('resize', resetDisplay);
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resetDisplay);
});

watch(
    [() => props.items],
    async () => {
        setTimeout(() => {
            layoutDisplay();
        }, 1000);
    },
    { deep: true }
);

watch(
    [() => props.columnCount, () => props.pattern],
    async () => {
        await resetDisplay();
    }
);
</script>

<template>
    <div
        v-if="columnCount >= 1"
        ref="masonryRoot"
        class="masonry-root"
        :style="{
            '--column-count': columnCount,
            '--gap': `${gap}px`
        }"
    >
        <div
            v-for="item in items"
            :key="item.id"
            ref="masonryCell"
            class="masonry-cell"
        >
            <slot :item="item"></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.masonry-root {
    width: 100%;
    position: relative;
}

.masonry-cell {
    width: calc((100% - ((var(--column-count) - 1) * var(--gap))) / var(--column-count));
    position: absolute;
    height: auto;
}
</style>

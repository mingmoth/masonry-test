<script>
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, watch } from 'vue';
// import { throttle } from '../api/index';

const MASONRY_PATTERN = {
    M: 'm',
    Z: 'z'
};
</script>

<script setup>
const props = defineProps({
    columnCount: {
        type: [Number, String],
        default: 1
    },
    gap: {
        type: [Number, String],
        default: 12
    },
    items: {
        type: Array,
        default: () => ([])
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
const masonryHeight = ref(0);

// Data
const columns = ref([]);
const currentItemCount = ref(0);

// Computed
const columnCount = computed(() => Number(props.columnCount));
const gap = computed(() => Number(props.gap));

const itemsCount = computed(() => props.items.length);
const itemsHeightCollection = ref([]);

// Functions

// 初始化每列物件(內部紀錄 items 總數，及 items + gaps 總高度)
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

// 排第一排
function placeFirstRow () {
    for (let idx = 0; idx < columnCount.value; idx++) {
        itemsHeightCollection.value[idx].el.style.top = 0;
        const leftWidth = (itemsHeightCollection.value[idx].el.offsetWidth + gap.value) * (idx);
        itemsHeightCollection.value[idx].el.style.left = `${leftWidth}px`;
        columns.value[idx].height += itemsHeightCollection.value[idx].el.offsetHeight + gap.value;
        columns.value[idx].cells += 1;
        currentItemCount.value++;
    }
}

// 排後續排數
function placeSequenceRow () {
    while (currentItemCount.value < itemsCount.value) {
        if (props.pattern === MASONRY_PATTERN.M) {
            placeMasonryOrder();
        } else {
            placeZPatternOrder();
        }
        currentItemCount.value++;
    }
}

// 典型瀑布流排列
function placeMasonryOrder () {
    const heightMap = columns.value.map(column => column.height);
    const minHeight = Math.min(...Object.values(heightMap));
    const minHeightIndex = heightMap.indexOf(minHeight);
    const leftWidth = (itemsHeightCollection.value[currentItemCount.value].el.offsetWidth + gap.value) * (minHeightIndex);
    placeItemPosition(minHeightIndex, leftWidth);
}

// Ｚ字流排列
function placeZPatternOrder () {
    const heightMap = columns.value.map(column => column.cells);
    const minCell = Math.min(...Object.values(heightMap));
    const minCellIndex = heightMap.indexOf(minCell);
    const leftWidth = (itemsHeightCollection.value[currentItemCount.value].el.offsetWidth + gap.value) * (minCellIndex);
    placeItemPosition(minCellIndex, leftWidth);
}

// 定義 item 的 position top & left
function placeItemPosition (index, width) {
    itemsHeightCollection.value[currentItemCount.value].el.style.top = `${columns.value[index].height}px`;
    itemsHeightCollection.value[currentItemCount.value].el.style.left = `${width}px`;
    columns.value[index].cells += 1;
    columns.value[index].height += itemsHeightCollection.value[currentItemCount.value].el.offsetHeight + gap.value;
}

// 取得瀑布流 DOM 的 refs
function getItemsRef () {
    return masonryCell.value.map(el => {
        return { el };
    });
}

// 瀑布流排列
function layoutDisplay () {
    if (columnCount.value < 1) return;
    initColumns();
    itemsHeightCollection.value = getItemsRef();
    if (currentItemCount.value < columns.value.length) {
        placeFirstRow();
        placeSequenceRow();
    } else {
        placeSequenceRow();
    }
    const columnHeights = columns.value.map(column => column.height);
    masonryHeight.value = Math.max(...columnHeights);
}

// 等待 多張圖片下載完成
function awaitImagesLoaded () {
    if (columnCount.value < 1) return;
    const images = masonryRoot.value.querySelectorAll('img');
    let imagesLength = images.length;
    console.log('imagesLength', imagesLength);
    for (let i = 0; i < images.length; i++) {
        images[i].onload = function () {
            imagesLength--;
            if (imagesLength === 0) {
                layoutDisplay();
            }
        };
    }
}

// 樣式 props 改變 或 視窗 resize 時重新排列
async function resetDisplay () {
    console.log('reset');
    if (columnCount.value < 1) return;
    columns.value = [];
    currentItemCount.value = 0;
    await awaitImagesLoaded();
    layoutDisplay();
}

onMounted(async () => {
    await awaitImagesLoaded();
    window.addEventListener('resize', resetDisplay);
    // window.addEventListener('scroll', throttle(resetDisplay, 10000));
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resetDisplay);
    // window.removeEventListener('scroll', throttle(resetDisplay, 10000));
});

watch(
    [() => props.items, () => props.columnCount, () => props.pattern],
    () => {
        awaitImagesLoaded();
        setTimeout(() => {
            resetDisplay();
        }, 1000);
    },
    { deep: true }
);

onUpdated(() => {
    console.log('onUpdated');
});

// watch(
//     [() => props.columnCount, () => props.pattern],
//     async () => {
//         await resetDisplay();
//     }
// );
</script>

<template>
    <div
        v-if="columnCount >= 1"
        id="masonryRoot"
        ref="masonryRoot"
        class="masonry-root"
        :style="{
            '--column-count': columnCount,
            '--gap': `${gap}px`,
            'height': `${masonryHeight}px`
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

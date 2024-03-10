<script>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { debounce } from '../api';

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
    gapX: {
        type: [Number, String],
        default: 12
    },
    gapY: {
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

// Data
const columns = ref([]); // 記錄每列 items 總數，及 總高度
const currentItemCount = ref(0); // 紀錄已排列的item數目
const masonryHeight = ref(0); // 包裹瀑布流 items 的 wrapper 高度

// Computed
const children = computed(() => {
    return props.items.map(item => {
        return {
            ...item,
            loaded: emitLoad
        };
    });
});
const columnCount = computed(() => Number(props.columnCount)); // 有幾列
const gapX = computed(() => Number(props.gapX)); // 水平間距
const gapY = computed(() => Number(props.gapY)); // 垂直間距

const itemsCount = computed(() => props.items.length); // items 總數目
const itemsHeightCollection = ref([]); // 取得 masonryCell refs 內各個 DOM 高度的集合

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
        if (!itemsHeightCollection.value[idx]?.el) {
            continue;
        }
        itemsHeightCollection.value[idx].el.style.top = 0;
        const leftWidth = (itemsHeightCollection.value[idx].el.offsetWidth + gapX.value) * (idx);
        itemsHeightCollection.value[idx].el.style.left = `${leftWidth}px`;
        columns.value[idx].height += itemsHeightCollection.value[idx].el.offsetHeight + gapY.value;
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
    const leftWidth = (itemsHeightCollection.value[currentItemCount.value].el.offsetWidth + gapX.value) * (minHeightIndex);
    placeItemPosition(minHeightIndex, leftWidth);
}

// Ｚ字流排列
function placeZPatternOrder () {
    const heightMap = columns.value.map(column => column.cells);
    const minCell = Math.min(...Object.values(heightMap));
    const minCellIndex = heightMap.indexOf(minCell);
    const leftWidth = (itemsHeightCollection.value[currentItemCount.value].el.offsetWidth + gapX.value) * (minCellIndex);
    placeItemPosition(minCellIndex, leftWidth);
}

// 定義 item 的 position top & left
function placeItemPosition (index, width) {
    itemsHeightCollection.value[currentItemCount.value].el.style.top = `${columns.value[index].height}px`;
    itemsHeightCollection.value[currentItemCount.value].el.style.left = `${width}px`;
    columns.value[index].cells += 1;
    columns.value[index].height += itemsHeightCollection.value[currentItemCount.value].el.offsetHeight + gapY.value;
}

// 取得瀑布流 DOM 的 refs
function getItemsRef () {
    return masonryCell.value.map(el => {
        return { el };
    });
}

// 瀑布流排列
async function layoutDisplay () {
    if (columnCount.value < 1) {
        return;
    }
    initColumns();
    // 取得 masonryCell refs 內各個 DOM 高度的集合
    itemsHeightCollection.value = getItemsRef();
    if (currentItemCount.value < columns.value.length) {
        await placeFirstRow();
    }

    await placeSequenceRow();
    const columnHeights = columns.value.map(column => column.height);
    masonryHeight.value = Math.max(...columnHeights);
}

// 樣式 props 改變 或 視窗 resize 時重新排列
async function resetDisplay () {
    if (columnCount.value < 1) {
        return;
    }
    columns.value = [];
    currentItemCount.value = 0;
    console.log('resetDisplay');
    layoutDisplay();
}

const emitLoad = () => {
    debounce(resetDisplay, 0)();
};

onMounted(async () => {
    window.addEventListener('resize', resetDisplay);
    nextTick(() => {
        layoutDisplay();
    });
});

onBeforeUnmount(() => {
    window.removeEventListener('resize', resetDisplay);
});

watch(
    [() => props.columnCount, () => props.items, () => props.pattern],
    () => {
        console.log('nextTick');
        nextTick(() => {
            resetDisplay();
        });
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
            '--column-gap': `${gapX}px`,
            'height': `${masonryHeight}px`
        }"
    >
        <div
            v-for="(item, index) in children"
            :key="item.id"
            ref="masonryCell"
            class="masonry-cell"
        >
            <slot name="item" :item="item" :index="index" :loaded="emitLoad" ></slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.masonry-root {
    width: 100%;
    position: relative;
}

.masonry-cell {
    width: calc((100% - ((var(--column-count) - 1) * var(--column-gap))) / var(--column-count));
    position: absolute;
    height: auto;
}
</style>

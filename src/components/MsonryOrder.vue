<script>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { sleep } from '../api';

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
        type: Number,
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

const columnCount = computed(() => props.columnCount);

// DOM refs
const masonryRoot = ref(null);
const masonryCell = ref(null);

// Data
const columns = ref([]);
const masonryHeight = ref('auto');

// Functions
async function displayMasonryItems () {
    const cells = masonryCell.value.map(el => {
        const { marginTop, marginBottom } = getComputedStyle(el);
        const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
        return { el, outerHeight };
    });
    if (!cells) {
        return;
    }
    if (props.pattern === MASONRY_PATTERN.Z) {
        masonryHeight.value = Math.max(...placeZPatternOrder(cells));
    } else {
        masonryHeight.value = Math.max(...placeMasonryOrder(cells));
    }
}

// 瀑布流：排進較短的 column
function placeMasonryOrder (array) {
    columns.value = Array.from({ length: columnCount.value }).map(item => {
        return {
            cells: [],
            outerHeight: 0
        };
    });
    for (const cell of array) {
        // 排進較短的 column
        const columnItem = columns.value.reduce((prev, curr) => {
            return curr.outerHeight < prev.outerHeight ? curr : prev;
        });
        columnItem.cells.push(cell);
        columnItem.outerHeight += cell.outerHeight + Number(props.gap);
    }
    let order = 0;
    // 調整真實 DOM 的 flex order
    for (const column of columns.value) {
        for (const cell of column.cells) {
            cell.el.style.order = order++;
        }
    }
    // 得出各排高度 array
    return columns.value.map(column => column.outerHeight);
}

// Z 字排
function placeZPatternOrder (array, cols = columnCount.value) {
    columns.value = Array.from({ length: columnCount.value }).map(item => {
        return {
            cells: [],
            outerHeight: 0
        };
    });

    let col = 0;
    // Z 字排
    while (col < cols) {
        for (let i = 0; i < array.length; i += cols) {
            const cell = array[i + col];
            if (cell !== undefined) {
                columns.value[col].cells.push(cell);
                columns.value[col].outerHeight += cell.outerHeight + Number(props.gap);
            }
        }
        col++;
    }

    // 調整真實 DOM 的 flex order
    let order = 0;
    for (const column of columns.value) {
        for (const cell of column.cells) {
            cell.el.style.order = order++;
        }
    }
    // 得出各排高度 array
    return columns.value.map(column => column.outerHeight);
}

onMounted(async () => {
    await sleep(2000);
    displayMasonryItems();
    window.addEventListener('resize', displayMasonryItems);
});

onBeforeUnmount(async () => {
    window.removeEventListener('resize', displayMasonryItems);
});

watch(
    [() => props.items, () => props.columnCount, () => props.pattern, () => props.gap],
    async () => {
        await sleep(2000);
        await displayMasonryItems();
    },
    { deep: true }
);
</script>

<template>
    <div
        ref="masonryRoot"
        class="masonry-root"
        :style="{
            '--max-height': `${masonryHeight}px`,
            '--column-count': columnCount,
            '--gap': `${gap}px`
        }"
    >
        <div
            v-for="item in items"
            :key="item.order"
            ref="masonryCell"
            class="masonry-cell"
        >
            <div class="masonry-item">
                <slot :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.masonry-root {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--gap);
    max-height: var(--max-height);
    overflow-x: hidden;

    .masonry-cell {
        flex: 1;
        flex-basis: 0;
        max-width: calc((100% - (var(--gap) * (var(--column-count) - 1))) / var(--column-count));
    }
}
</style>

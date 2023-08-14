<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { sleep } from '../api';

// const MASONRY_PATTERN = {
//     M: 'm',
//     Z: 'z'
// };

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
        type: Number,
        default: 12
    },
    pattern: {
        type: String,
        default: 'm',
        validator: (val) => ['m', 'z'].includes(val)
    }
});

const columnCount = computed(() => props.columnCount);

// DOM refs
const masonryRoot = ref(null);
const masonryCell = ref(null);

// ref variables
const columns = ref([]);

const masonryHeight = ref('auto');

async function displayMasonryItems () {
    const cells = masonryCell.value.map(el => {
        const { marginTop, marginBottom } = getComputedStyle(el);
        const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
        return { el, outerHeight };
    });
    if (!cells) {
        return;
    }
    if (props.pattern === 'z') {
        masonryHeight.value = Math.max(...placeZPatternOrder(cells));
    } else {
        masonryHeight.value = Math.max(...placeMasonryOrder(cells));
    }
}

function placeMasonryOrder (array) {
    columns.value = Array.from({ length: columnCount.value }).map(item => {
        return {
            cells: [],
            outerHeight: 0
        };
    });
    for (const cell of array) {
        const columnItem = columns.value.reduce((prev, curr) => {
            return curr.outerHeight < prev.outerHeight ? curr : prev;
        });
        columnItem.cells.push(cell);
        columnItem.outerHeight += cell.outerHeight + props.gap;
    }
    let order = 0;
    for (const column of columns.value) {
        for (const cell of column.cells) {
            cell.el.style.order = order++;
        }
    }
    return columns.value.map(column => column.outerHeight);
}

function placeZPatternOrder (array, columns = columnCount.value) {
    const cols = columns;
    let col = 0;
    const result = Array.from({ length: columns }, () => 0);
    let order = 0;
    while (col < cols) {
        for (let i = 0; i < array.length; i += cols) {
            const _val = array[i + col];
            if (_val !== undefined) {
                // Z 字排
                _val.el.style.order = order++;
                result[col] += _val.outerHeight + props.gap;
            }
        }
        col++;
    }
    return result;
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
    () => props.items,
    async () => {
        await sleep(2000);
        await displayMasonryItems();
    },
    { deep: true }
);

watch(
    () => props.columnCount,
    async () => {
        await sleep(2000);
        await displayMasonryItems();
    }
);

watch(
    () => props.pattern,
    async () => {
        await sleep(2000);
        await displayMasonryItems();
    }
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
        max-width: calc((100% - (12px * (var(--column-count) - 1))) / var(--column-count));
    }
}
</style>

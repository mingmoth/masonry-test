<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { sleep } from '../api';
const props = defineProps({
    items: {
        type: Array,
        default: () => ([])
    },
    columnCount: {
        item: {
            type: Number,
            default: 1
        }
    }
});

const columnCount = computed(() => props.columnCount);

// const masonryColumns = computed(() => {
//     const column = new Array(props.columnCount).map(() => ({}));
//     for (let i = 0; i < column.length; i++) {
//         column[i] = {
//             cells: [],
//             outerHeight: 0
//         };
//     }
//     return column;
// });

const masonryRoot = ref(null);
const masonryCell = ref(null);
const masonryHeight = ref('auto');

function redraw () {
    const cells = masonryCell.value.map(el => {
        const { marginTop, marginBottom } = getComputedStyle(el);
        const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
        return { el, outerHeight };
    });
    console.log('cells', cells);

    const heigthCollect = getSortArray(cells, columnCount.value);
    console.log('heigthCollect', heigthCollect);

    masonryHeight.value = Math.max(...heigthCollect);
    console.log('masonryHeight', masonryHeight.value);
}

function getSortArray (array, columns = columnCount.value) {
    const cols = columns;
    let col = 0;
    const result = Array.from({ length: columns }, () => 0);
    console.log('result', result);
    while (col < cols) {
        for (let i = 0; i < array.length; i += cols) {
            const _val = array[i + col];
            if (_val !== undefined) {
                result[col] += 0;
                _val.isLoading = false;
                result[col] += _val.outerHeight;
            }
        }
        col++;
    }
    return result;
}

onMounted(async () => {
    redraw();
    await sleep(2000);
    redraw();
});

watch(
    () => props.items,
    async () => {
        redraw();
        await sleep(1000);
        redraw();
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
            '--column-count': columnCount
        }"
    >
        <div
            v-for="item in props.items"
            :key="item.id"
            ref="masonryCell"
            class="masonry-cell"
        >
            <slot
                :item="item"
                class="masonry-item"
            >
            </slot>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.masonry-root {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: 12px;
    max-height: var(--max-height);

    .masonry-cell {
        flex: 1;
        flex-basis: 0;
        max-width: calc((100% - (12px * (var(--column-count) - 1))) / var(--column-count));
    }
}
</style>

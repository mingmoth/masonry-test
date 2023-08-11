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

const masonryColumns = computed(() => {
    const column = new Array(props.columnCount).map(() => ({}));
    for (let i = 0; i < column.length; i++) {
        column[i] = {
            cells: [],
            outerHeight: 0
        };
    }
    return column;
});

const masonryRoot = ref(null);
const masonryCell = ref(null);
const masonryHeight = ref('auto');

function redraw () {
    console.log('redraw');
    const cells = masonryCell.value?.map(el => {
        const { marginTop, marginBottom, offsetWidth } = getComputedStyle(el);
        el.maxWidth = offsetWidth;
        const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
        return { el, outerHeight };
    });

    for (const cell of cells) {
        const columnItem = masonryColumns.value.reduce((prev, curr) => curr.outerHeight < prev.outerHeight ? curr : prev);
        columnItem.cells.push(cell);
        columnItem.outerHeight += cell.outerHeight;
    }

    const maxTarget = masonryColumns.value.reduce((prev, curr) => curr.outerHeight < prev.outerHeight ? prev : curr);
    masonryHeight.value = maxTarget.outerHeight + 1 + 'px';

    let order = 0;
    for (const column of masonryColumns.value) {
        for (const cell of column.cells) {
            cell.el.style.order = order++;
        }
        column.cells[column.cells.length - 1].el.style.flexBasis =
            column.cells[column.cells.length - 1].el.offsetHeight +
            maxTarget.outerHeight -
            column.outerHeight -
            1 +
            'px';
    }
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
            maxHeight: masonryHeight
        }"
    >
        <div
            v-for="item in props.items"
            :key="item.id"
            ref="masonryCell"
            class="masonry-cell"
            :style="{
                '--column-count': columnCount
            }"
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

    .masonry-cell {
        flex: 1;
        flex-basis: 0;
        max-width: calc((100% - 12px) / var(--column-count));
    }
}
</style>

<template>
    <div
        ref="masonry"
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
            ref="cell"
            class="masonry-cell"
        >
            <div class="masonry-item">
                <slot :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
import { sleep } from '../api';

const MASONRY_PATTERN = {
    M: 'm',
    Z: 'z'
};

export default {
    name: 'OrderMasonry',
    props: {
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
            validator: (val) => Object.values(MASONRY_PATTERN).includes(val)
        }
    },
    watch: {
        items: {
            async handler () {
                console.log('watch');
                if (this.items.length > 0) {
                    this.redraw();
                }
            },
            deep: true
        }
    },
    data () {
        return {
            columns: Array.from({ length: this.columnCount }).map(() => ({
                cells: [],
                outerHeight: 0
            })),
            masonryHeight: 'auto'
        };
    },
    async mounted () {
        await sleep(2000);
        await this.redraw();
    },
    methods: {
        async redraw () {
            const cells = this.$refs.cell?.map(el => {
                const { marginTop, marginBottom } = getComputedStyle(el);
                const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
                return { el, outerHeight };
            });
            if (this.pattern === 'z') {
                this.masonryHeight = Math.max(...this.placeZPatternOrder(cells));
            } else {
                this.masonryHeight = Math.max(...this.placeMasonryOrder(cells));
            }
        },
        placeMasonryOrder (cells) {
            this.columns = Array.from({ length: this.columnCount }).map(() => ({
                cells: [],
                outerHeight: 0
            }));
            for (const cell of cells) {
                const columnItem = this.columns.reduce((prev, curr) => {
                    console.log('prev', prev);
                    console.log('curr', curr);
                    return curr.outerHeight < prev.outerHeight ? curr : prev;
                });
                columnItem.cells.push(cell);
                columnItem.outerHeight += cell.outerHeight + this.gap;
            }
            let order = 0;
            for (const column of this.columns) {
                for (const cell of column.cells) {
                    cell.el.style.order = order++;
                }
                console.log('next--------------');
            }
            return this.columns.map(column => column.outerHeight);
        },
        placeZPatternOrder (array, columns = this.columnCount) {
            const cols = columns;
            let col = 0;
            const result = Array.from({ length: columns }, () => 0);
            let order = 0;
            while (col < cols) {
                for (let i = 0; i <= array.length; i += cols) {
                    const _val = array[i + col];
                    if (_val !== undefined) {
                        // Z 字排
                        _val.el.style.order = order++;
                        result[col] += _val.outerHeight + this.gap;
                    }
                }
                col++;
            }
            return result;
        }
    }
};
</script>

<style lang="scss" scoped>
.masonry-root {
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    gap: var(--gap);
    max-height: var(--max-height);
}
.masonry-cell {
    flex: 1;
    flex-basis: 0;
    max-width: calc((100% - (12px * (var(--column-count) - 1))) / var(--column-count));
}
</style>
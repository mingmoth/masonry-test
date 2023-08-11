<template>
    <div
        ref="masonry"
        class="masonry-root"
        :style="{
            '--max-height': `${masonryHeight}px`,
            '--column-count': columnCount
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
        }
    },
    watch: {
        items: {
            async handler () {
                this.redraw();
                // const cells = this.$refs.cell?.map(el => {
                //     const { marginTop, marginBottom } = getComputedStyle(el);
                //     const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
                //     return { el, outerHeight };
                // });
                // this.masonryHeight = Math.max(...this.getSortArray(cells));
            },
            deep: true,
            immediate: true
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
        // this.redraw();
        await sleep(2000);
        await this.redraw();
        const cells = this.$refs.cell?.map(el => {
            const { marginTop, marginBottom } = getComputedStyle(el);
            const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
            return { el, outerHeight };
        });
        this.masonryHeight = Math.max(...this.getSortArray(cells));
    },
    methods: {
        async redraw () {
            const cells = this.$refs.cell?.map(el => {
                const { marginTop, marginBottom } = getComputedStyle(el);
                const outerHeight = parseInt(marginTop) + el.offsetHeight + parseInt(marginBottom);
                return { el, outerHeight };
            });
            console.log('cells', cells);
            // for (const cell of cells) {
            //     const columnItem = this.columns.reduce((prev, curr) => curr.outerHeight < prev.outerHeight ? curr : prev);
            //     columnItem.cells.push(cell);
            //     columnItem.outerHeight += cell.outerHeight;
            // }

            // const maxTarget = this.columns.reduce((prev, curr) => curr.outerHeight < prev.outerHeight ? prev : curr);

            this.masonryHeight = Math.max(...this.getSortArray(cells));
            // let order = 0;
            // for (const column of this.columns) {
            //     // let count = 0 + order;
            //     for (const cell of column.cells) {
            //         cell.el.style.order = order++;
            //         // cell.el.style.order = cell.el.style.order + order;
            //     }
            //     column.cells[column.cells.length - 1].el.style.flexBasis =
            //         column.cells[column.cells.length - 1].el.offsetHeight +
            //         this.masonryHeight -
            //         column.outerHeight +
            //         1 + 'px';
            //     console.log('next--------------');
            // }
        },
        getSortArray (array, columns = this.columnCount) {
            const cols = columns;
            let col = 0;
            const result = Array.from({ length: columns }, () => 0);
            console.log('result', result);
            while (col < cols) {
                for (let i = 0; i < array.length; i += cols) {
                    const _val = array[i + col];
                    if (_val !== undefined) {
                        result[col] += 0;
                        result[col] += _val.outerHeight;
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
    gap: 12px;
    max-height: var(--max-height);
}
.masonry-cell {
    flex: 1;
    flex-basis: 0;
    max-width: calc((100% - (12px * (var(--column-count) - 1))) / var(--column-count));
}
</style>
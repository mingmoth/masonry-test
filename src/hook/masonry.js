import { computed } from 'vue';
import useBreakPoints from './breakpoints';

export const SCREEN_SIZE_COLUMN_COUNT = {
    xl: 5,
    lg: 4,
    md: 3,
    sm: 2,
    xs: 1
};

export default function useMasonry (array = []) {
    const { screenType } = useBreakPoints();

    const columnCounts = computed(() => SCREEN_SIZE_COLUMN_COUNT[screenType.value]);

    function getSortArray (array, columns = columnCounts.value) {
        const cols = columns;
        let col = 0;
        const result = [];
        while (col < cols) {
            for (let i = 0; i < array.length; i += cols) {
                const _val = array[i + col];
                if (_val !== undefined) {
                    result.push(_val);
                }
            }
            col++;
        }
        return result;
    }

    const masonrySortedItems = computed(() => getSortArray(array, columnCounts.value));

    return {
        columnCounts,
        getSortArray,
        masonrySortedItems
    };
}

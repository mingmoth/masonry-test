import { computed, onMounted, onBeforeUnmount, ref } from 'vue';

export const SCREEN_SIZE = {
    XL: 'xl',
    LG: 'lg',
    MD: 'md',
    SM: 'sm',
    XS: 'xs'
};

export default function useBreakPoints () {
    const windowWidth = ref(window.innerWidth);

    const screenType = computed(() => {
        // desktop
        if (windowWidth.value >= 1280) {
            return SCREEN_SIZE.XL;
        }
        // for-tablet-landscape-up
        if (windowWidth.value >= 900) {
            return SCREEN_SIZE.LG;
        }
        // for-phone-only
        if (windowWidth.value >= 599) {
            return SCREEN_SIZE.MD;
        }
        if (windowWidth.value >= 310) {
            return SCREEN_SIZE.SM;
        }
        return SCREEN_SIZE.XS;
    });

    function onResize () {
        windowWidth.value = window.innerWidth;
    }

    onMounted(() => window.addEventListener('resize', onResize));
    onBeforeUnmount(() => window.removeEventListener('resize', onResize));

    return {
        screenType
    };
}

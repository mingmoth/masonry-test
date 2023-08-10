<script setup>
import { computed } from 'vue';

const props = defineProps({
    card: {
        type: Object
    }
});

const card = computed(() => props.card);
</script>

<template>
    <figure class="card">
        <img
            :src="card.download_url"
            alt="card-url"
            class="card-image"
        >
        <figcaption class="card-desc">
            <b>{{ card.author }}</b>
        </figcaption>
        <div class="card-index">{{ Number(card.id) + 1 }}</div>
    </figure>
</template>

<style lang="scss" scoped>
@import '../style/carditem.scss';

.card {
    &-image {
        border-radius: 8px;
    }
}

</style>
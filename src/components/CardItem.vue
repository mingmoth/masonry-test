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
            @load="$emit('loaded')"
        >
        <figcaption class="card-info">
            <div><b>{{ card.author }}</b></div>
            <span>width: {{ card.width }}</span>
            <span>height: {{ card.height }}</span>
        </figcaption>
        <div class="card-index">{{ Number(card.id) + 1 }}</div>
    </figure>
</template>

<style lang="scss" scoped>
@import '../style/carditem.scss';

</style>

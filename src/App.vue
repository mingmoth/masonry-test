<script setup>
import { computed, onMounted, ref } from 'vue';
import getImages from './api';

import LayoutMasonry from './components/LayoutMasonry.vue';
import CardItem from './components/CardItem.vue';

const images = ref([]);
const isLoading = ref(true);
const imageNum = ref(0);

onMounted(async () => {
    const fetchImages = await getImages();
    imageNum.value = fetchImages.length;
    images.value = [...fetchImages];
    isLoading.value = false;
});

const filteredImages = computed(() => images.value.filter(image => Boolean(image.url)));

</script>

<template>
    <div>
        <h1>App</h1>
        <div v-if="isLoading">isLoading</div>
        <LayoutMasonry v-else>
            <CardItem
                v-for="image in filteredImages"
                :key="image.id"
                :card="image"
            />
        </LayoutMasonry>
    </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>

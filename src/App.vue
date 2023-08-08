<script setup>
import { onMounted, ref } from 'vue';
import getImages, { sleep } from './api';
import useMasonry from './hook/masonry';

import DividerLine from './components/DividerLine.vue';
import LayoutMasonry from './components/LayoutMasonry.vue';
import CardItem from './components/CardItem.vue';
import LoadingCard from './components/LoadingCard.vue';

const images = ref([]);
const isLoading = ref(true);
const imagesSet = ref([]);

onMounted(async () => {
    const fetchImages = await getImages(3);
    imagesSet.value = new Array(fetchImages.length);
    const { masonrySortedItems } = useMasonry(fetchImages);
    images.value = images.value.concat(masonrySortedItems.value);
    await sleep(2000);
    isLoading.value = false;
});

</script>

<template>
    <div>
        <h1>App</h1>
        <LayoutMasonry>
            <template v-if="isLoading">
                <LoadingCard
                    v-for="(item, index) in imagesSet"
                    :key="index"
                />
            </template>
            <template v-else>
                <CardItem
                    v-for="image in images"
                    :key="image.id"
                    :card="image"
                />
            </template>
        </LayoutMasonry>
        <DividerLine />
        <MasonryWall :items="images" :gap="16" :ssr-columns="4" :min-columns="1" :max-columns="5" :column-width="220">
            <template #default="{ item }">
                <CardItem
                    :card="item"
                />
            </template>
        </MasonryWall>
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

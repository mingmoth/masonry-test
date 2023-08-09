<script setup>
import { onMounted, ref } from 'vue';
import getImages, { sleep } from './api';
// import useMasonry from './hook/masonry';

// import DividerLine from './components/DividerLine.vue';
// import LayoutMasonry from './components/LayoutMasonry.vue';
import CardItem from './components/CardItem.vue';
import LoadingCard from './components/LoadingCard.vue';

const images = ref([]);
const isLoading = ref(true);
// const imagesSet = ref([]);
const currentPage = ref(3);

// const { columnCounts, getSortArray } = useMasonry();

async function getNextPageImages () {
    currentPage.value += 1;
    const fetchImages = await getImages(currentPage.value);
    images.value.push(...fetchImages);
    await sleep(2000);
    images.value.splice(images.value.length - fetchImages.length, 10);
    const sortedImages = fetchImages.map(image => {
        return {
            ...image,
            isLoading: false
        };
    });
    images.value.push(...sortedImages);
}

onMounted(async () => {
    await getNextPageImages();
    isLoading.value = false;
});

</script>

<template>
    <div>
        <h1>App</h1>
        <!-- <LayoutMasonry>
            <component
                v-for="image in images"
                :key="image.id"
                :is="image.isLoading ? LoadingCard : CardItem"
                :card="image"
            />
        </LayoutMasonry> -->
        <!-- <DividerLine />
        <MasonryWall :items="images" :gap="16" :min-columns="1" :max-columns="5" :column-width="220">
            <template #default="{ item }">
                <CardItem
                    :card="item"
                />
            </template>
        </MasonryWall> -->
        <!-- <DividerLine /> -->
        <div
            v-masonry
            transition-duration=".3s"
            item-selector=".masonry-container__item"
            class="masonry-container"
            gutter="16"
            fit-width="true"
            column-width="230"
            horizontal-order="true"
        >
            <component
                v-masonry-tile
                class="masonry-container__item"
                v-for="(image) in images"
                :key="image.id"
                :is="image.isLoading ? LoadingCard : CardItem"
                :card="image"
            />
        </div>
        <button
            class="load-more"
            @click="getNextPageImages()"
        > Load More Images</button>
    </div>
</template>

<style lang="scss" scoped>
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

.masonry-container {
  display: grid;
  margin: 0 auto;

  &__item {
    width: 230px;
  }
}

.load-more {
  position: fixed;
  top: 5%;
  right: 3%;
}
</style>

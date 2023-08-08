<script setup>
import { onMounted, ref } from 'vue';
import getImages, { sleep } from './api';
import useMasonry from './hook/masonry';

// import DividerLine from './components/DividerLine.vue';
import LayoutMasonry from './components/LayoutMasonry.vue';
import CardItem from './components/CardItem.vue';
import LoadingCard from './components/LoadingCard.vue';

const images = ref([]);
const isLoading = ref(true);
const imagesSet = ref([]);

const { columnCounts, getSortArray } = useMasonry();

// function appendImages (newImages) {
//     images.value = images.value.concat(newImages);
// }

onMounted(async () => {
    const fetchImages = await getImages(3);
    imagesSet.value = new Array(fetchImages.length);
    images.value = fetchImages;
    await sleep(2000);
    images.value = getSortArray(fetchImages, columnCounts.value);
    isLoading.value = false;
});

</script>

<template>
    <div>
        <h1>App</h1>
        <LayoutMasonry>
            <component
                v-for="image in images"
                :key="image.id"
                :is="image.isLoading ? LoadingCard : CardItem"
                :card="image"
            />
        </LayoutMasonry>
        <!-- <DividerLine />
        <MasonryWall :items="images" :gap="16" :min-columns="1" :max-columns="5" :column-width="220">
            <template #default="{ item }">
                <CardItem
                    :card="item"
                />
            </template>
        </MasonryWall>
        <DividerLine />
        <div
            v-masonry
            transition-duration=".3s"
            item-selector=".masonry-container__item"
            class="masonry-container"
            gutter="16"
            fit-width="true"
            column-width="230"
        >
            <CardItem
                v-masonry-tile
                class="masonry-container__item"
                v-for="(image) in images"
                :key="image.id"
                :card="image"
            />
        </div> -->
        <button class="load-more"> Load More Images</button>
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
    max-width: 230px;
  }
}

.load-more {
  position: fixed;
  top: 5%;
  right: 3%;
}
</style>

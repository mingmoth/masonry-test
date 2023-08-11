<script setup>
import { onMounted, ref } from 'vue';
import getImages, { sleep } from './api';
import useMasonry from './hook/masonry';

// common
// import DividerLine from './components/DividerLine.vue';

// masonry
// import MasonryColumn from './components/MasonryColumn.vue';
// import MasonryRoot from './components/MasonryRoot.vue';
// import MasonryOrder from './components/MsonryOrder.vue';
import OrderMasonry from './components/OrderMasonry.vue';

// card
import CardItem from './components/CardItem.vue';
// import CardPure from './components/CardPure.vue';
// import LoadingCard from './components/LoadingCard.vue';

const images = ref([]);
const resortedImages = ref([]);
const isLoading = ref(true);
const currentPage = ref(3);

const { columnCounts, getSortArray } = useMasonry();

async function getNextPageImages () {
    currentPage.value += 1;
    const fetchImages = await getImages(currentPage.value);

    images.value.push(...fetchImages);
    resortedImages.value.push(...fetchImages);

    await sleep(2000);

    images.value.splice(images.value.length - fetchImages.length, 10);
    resortedImages.value.splice(resortedImages.value.length - fetchImages.length, 10);

    const sortedImages = fetchImages.map(image => {
        return {
            ...image,
            isLoading: false
        };
    });
    images.value.push(...sortedImages);
    resortedImages.value = getSortArray(images.value, columnCounts.value);
}

onMounted(async () => {
    await getNextPageImages();
    isLoading.value = false;
    // onLoad();
    // window.addEventListener('resize', onResize);
});

// onBeforeUnmount(() => {
//     window.removeEventListener('resize', onResize);
// });

</script>

<template>
    <div>
        <h1>App</h1>
        <OrderMasonry
            v-if="!isLoading"
            :items="images"
            :column-count="3"
            pattern="m"
        >
            <template #default="{ item }">
                <CardItem
                    :card="item"
                />
            </template>
        </OrderMasonry>
        <!-- <MasonryOrder
            v-if="!isLoading"
            :items="images"
            :column-count="2"
        >
            <template #default="{ item }">
                <CardItem
                    :card="item"
                />
            </template>
        </MasonryOrder> -->
        <!-- <MasonryRoot
            v-if="!isLoading"
            :images="images"
            :columnCount="3"
        >
            <div
                v-for="(image) in images"
                :key="image.id"
                class="masonry-item"
            >
                <component
                    :is="image.cardtype === 'item' ? CardItem : CardPure"
                    :card="image"
                    class="masonry-cell"
                />
            </div>
        </MasonryRoot> -->
        <!-- <MasonryColumn>
            <component
                v-for="image in resortedImages"
                :key="image.id"
                :is="image.isLoading ? LoadingCard : CardItem"
                :card="image"
            />
        </MasonryColumn> -->
        <!-- <DividerLine /> -->
        <!-- <MasonryWall :items="images" :gap="16" :min-columns="1" :max-columns="5" :column-width="220">
            <template #default="{ item }">
                <CardItem
                    :card="item"
                />
            </template>
        </MasonryWall> -->
        <!-- <DividerLine />
        <div
            v-masonry
            transition-duration="0"
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
        </div> -->
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
    max-width: 230px;
  }
}

.load-more {
  position: fixed;
  top: 5%;
  right: 3%;
}
</style>

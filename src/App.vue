<script setup>
import { onMounted, ref } from 'vue';
import getImages from './api';
// import useMasonry from './hook/masonry';

// masonry
import MasonryPosition from './components/MasonryPosition.vue';

// card
import CardItem from './components/CardItem.vue';
import CardPure from './components/CardPure.vue';
// import LoadingCard from './components/LoadingCard.vue';

const columnOptions = [1, 2, 3, 4, 5];
const masonryPatterns = [
    {
        value: 'm',
        text: 'Masonry'
    },
    {
        value: 'z',
        text: 'Z-Pattern'
    }
];

const columnOption = ref(5);
const masonryPattern = ref('m');

const images = ref([]);
const isLoading = ref(true);
const currentPage = ref(3);

async function getNextPageImages () {
    currentPage.value += 1;
    const fetchImages = await getImages(currentPage.value);
    images.value.push(...fetchImages);
}

const masonry = ref(null);

onMounted(async () => {
    await getNextPageImages();
    isLoading.value = false;
});

</script>

<template>
    <div class="app">
        <div class="select">
            <label for="columns">
                Choose Column Number
                <select name="columns" id="columns" v-model="columnOption">
                    <option
                        v-for="option in columnOptions"
                        :key="option"
                        :value="option"
                    >{{ option }}</option>
                </select>
            </label>
            <label for="patten">
                Choose Masonry Pattern
                <select name="patten" id="patten" v-model="masonryPattern">
                    <option
                        v-for="pattern in masonryPatterns"
                        :key="pattern.value"
                        :value="pattern.value"
                    >
                        {{ pattern.text }}
                    </option>
                </select>
            </label>
        </div>
        <h1>Masonry Demo</h1>
        <MasonryPosition
            v-if="!isLoading"
            ref="masonry"
            :items="images"
            :column-count="columnOption"
            :pattern="masonryPattern"
            :row-gap="20"
        >
            <template #item="{ item }">
                <component
                    :is="item?.cardtype === 'item' ? CardItem : CardPure"
                    :card="item"
                    @loaded="masonry?.emitLoad"
                />
            </template>
        </MasonryPosition>
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
  bottom: 5%;
  right: 3%;
}

.select {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    padding: 12px;
    z-index: 2;
    background: white;

    label {
        display: block;
        text-align: start;
    }
}
</style>

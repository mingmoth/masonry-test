<script setup>
import { onMounted } from 'vue';
import getImages from './api';

onMounted(async () => {
    await getImages();
});
</script>

<template>
    <div>
        <h1>App</h1>
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

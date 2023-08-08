import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// packages
import MasonryWall from '@yeger/vue-masonry-wall';
import { VueMasonryPlugin } from 'vue-masonry';

const app = createApp(App);

app.use(MasonryWall);
app.use(VueMasonryPlugin);

app.mount('#app');

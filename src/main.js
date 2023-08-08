import { createApp } from 'vue';
import './style.css';
import App from './App.vue';

// packages
import MasonryWall from '@yeger/vue-masonry-wall';

const app = createApp(App);

app.use(MasonryWall);

app.mount('#app');

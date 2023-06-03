import { createApp } from 'vue';
import '@unocss/reset/tailwind.css'
import 'uno.css'


import App from './App.vue';
import './styles/base.css';

// Router
import { Router } from '/@/router';




const app = createApp(App);

app.use(Router);

app.mount('#app');

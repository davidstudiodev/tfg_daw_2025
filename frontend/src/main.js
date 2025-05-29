// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from '/router';
import '/src/style.css'
import 'material-icons/iconfont/material-icons.css'

createApp(App).use(router).mount('#app');

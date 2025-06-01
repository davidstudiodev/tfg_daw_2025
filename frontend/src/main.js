// src/main.js
import { createApp } from 'vue';
import App from './App.vue';
import router from '/router';
import '/src/style.css'
import 'material-icons/iconfont/material-icons.css'

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const app = createApp(App);

app.use(router);
app.use(Toast, {
  position: "top-right",
  timeout: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button"
});
app.mount('#app');


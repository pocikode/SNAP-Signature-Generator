import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import VueClipboard from "vue-clipboard2";

import './assets/main.css'

const app = createApp(App)

app.use(VueClipboard)
app.use(createPinia())
app.use(router)

app.mount('#app')

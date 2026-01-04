import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import router from './router'
// @unhead/vue v2.1.1 - import createHead from client
import { createHead } from '@unhead/vue/client'

const app = createApp(App)

// Create head instance with install method
const head = createHead()

// Install as Vue plugin
app.use(head)

app.use(router)
app.mount('#app')

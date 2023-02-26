import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SettingVue from "@/views/SettingVue.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'settings',
      component: SettingVue
    },
    {
      path: '/get-token-signature',
      name: 'get-token-signature',
      component: () => import('../views/GetTokenSignatureView.vue')
    },
    {
      path: '/service-signature',
      name: 'service-signature',
      component: () => import('../views/ServiceSignatureView.vue')
    }
  ]
})

export default router

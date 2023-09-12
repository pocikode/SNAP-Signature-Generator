import { createRouter, createWebHashHistory } from 'vue-router'
import SettingVue from "@/views/SettingVue.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'settings',
      component: SettingVue
    },
    {
      path: '/oauth-signature',
      name: 'oauth-signature',
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

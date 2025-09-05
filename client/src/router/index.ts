import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import MemberAreaView from '@/views/MemberAreaView.vue'
import LoginAdminView from '@/views/LoginAdminView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: {
        title: 'AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
        description: 'Ini adalah deskripsi halaman Home',
      },
    },
    {
       path: '/Login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/login-admin',
      name: 'login-admin',
      component: LoginAdminView,
    },
    {
      path: '/member-area',
      name: 'member-area',
      component: MemberAreaView,
      meta: {
        title: 'Member Area || AMRA :: Aplikasi Manajemen Travel Haji dan Umrah',
        description: 'Ini adalah deskripsi halaman Member Area',
      },
    },
  ],
})

export default router

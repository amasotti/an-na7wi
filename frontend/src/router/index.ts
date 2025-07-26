import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import TextView from '../views/TextView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/texts',
      name: 'texts',
      // Lazy-loaded component
      component: () => import('../views/TextView.vue')
    },
    // {
    //   path: '/texts/:id',
    //   name: 'text-detail',
    //   component: () => import('../views/TextDetailView.vue'),
    //   props: true
    // },
    // {
    //   path: '/vocabulary',
    //   name: 'vocabulary',
    //   component: () => import('../views/VocabularyView.vue')
    // },
    // {
    //   path: '/settings',
    //   name: 'settings',
    //   component: () => import('../views/SettingsView.vue')
    // },
    // {
    //   path: '/:pathMatch(.*)*',
    //   name: 'not-found',
    //   component: () => import('../views/NotFoundView.vue')
    // }
  ]
})

export default router

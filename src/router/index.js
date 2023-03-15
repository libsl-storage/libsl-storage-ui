import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: () => import('@/views/LibSLStorage.vue'),
    children: [
      {
        path: "/",
        component: () => import('@/components/Search/Search.vue')
      },
      {
        path: '/lib',
        component: () => import('@/components/Search/LibPage.vue')
      }
    ]
  },
  {
    path: "/sign-in",
    component: () => import('@/views/SignIn.vue')
  },
  {
    path: "/sign-up",
    component: () => import('@/views/SignUp.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router

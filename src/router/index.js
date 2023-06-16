import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store'

const routes = [
  {
    path: '/',
    component: () => import('@/views/LibSLStorage.vue'),
    children: [
      {
        path: "/",
        component: () => import('@/components/Pages/SearchPage.vue')
      },
      {
        path: "/settings",
        component: () => import('@/components/Pages/SettingsPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: "new-specification",
        component: () => import('@/components/Pages/NewSpecPage.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: "/lib/:id",
        component: () => import('@/components/Pages/LibPage.vue')
      }
    ]
  },
  {
    path: "/sign-in",
    component: () => import('@/views/SignIn.vue'),
    meta: { requiresUnauth: true }
  },
  {
    path: "/sign-up",
    component: () => import('@/views/SignUp.vue'),
    meta: { requiresUnauth: true }
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/"
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  if (store.getters.isAuthenticated) {
    if (to.meta.requiresUnauth)
      next({path: "/"})
    else
      next()
  } else { // not authenticated
    if (to.meta.requiresAuth)
      next({path: "/"})
    else
      next()
  }
})

export default router

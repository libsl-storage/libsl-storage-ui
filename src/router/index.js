import { createRouter, createWebHistory } from 'vue-router'

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
        path: '/lib',
        component: () => import('@/components/Pages/LibPage.vue')
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

/*
router.beforeEach((to, from, next) => {
  if (sessionStorage.getItem("authenticated") == "true") { // authenticated
    if (!to.meta.requiresAuth)
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
*/
export default router

import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from '../views/login/index.vue'
Vue.use(VueRouter)

const routes = [
  // 配置路由
  { path: '/login', name: 'login', component: () => import('@/views/login') },
  {
    path: '/',
    // 子路由具有默认路由时，父路由不能有name属性
    component: () => import('@/views/layout'),
    children: [
      // path:''为空代表默认子路由 默认子路由只能有一个 默认为父路由对应的路由
      { path: '', name: 'home', component: () => import('@/views/home') },
      { path: '/qa', name: 'qa', component: () => import('@/views/qa') },
      { path: '/video', name: 'video', component: () => import('@/views/video') },
      { path: '/my', name: 'my', component: () => import('@/views/my') }
    ]
  }
]

const router = new VueRouter({
  routes
})

export default router

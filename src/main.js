import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 加载全局样式
import './styles/index.less'
import Vant from 'vant'
import 'vant/lib/index.css'

// 动态设置 rem 基准值 屏幕宽度除以10
import 'amfe-flexible'
// 时间样式表
import './utils/dayjs'

Vue.use(Vant)
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

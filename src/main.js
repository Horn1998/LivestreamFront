import Vue from 'vue'
import App from './App.vue'
import router from './router/'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios';
import store from './store/';


Vue.config.productionTip = false
Vue.use(ElementUI)

Vue.prototype.$axios = axios
Vue.prototype.$eventHub = new Vue();

// 设置请求的根路径
// axios.defaults.baseURL = 'http://10.128.206.152:8090/api'
axios.defaults.baseURL = "http://localhost:8088/api"

//钩子函数，访问路由前调用
router.beforeEach((to, from, next) => {
  //路由需要认证
  if (to.meta.requireAuth) {
    //判断store里是否有token
    if (store.state.token) {
      next()
    } else {
      next({
        path: 'login',
        query: { redirect: to.fullPath }
      })
    }
  } else {
    next()
  }
}
)
axios.interceptors.request.use(config => {
  // 请求头挂载信息
  config.headers.Authorization = window.sessionStorage.getItem("flag");
  // 在最后必须return config
  return config;
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App),
}).$mount('#app')


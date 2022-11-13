import Vue from 'vue'
import Router from 'vue-router'
//导入登录页面组件
import Login from '@/views/Login/login.vue'
import Register from '@/views/Login/register.vue'

import Home from '@/layout'
import User from '@/views/User'
import Video from '@/views/Video/index'
import Replay from '@/views/Video/replay'
import Wechat from '@/Views/Wechat/index'
import ChatHome from '@/Views/Wechat/Home'

Vue.use(Router)

export default new Router({
  // mode: 'history',
  mode:'hash',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // meta:{
      //   requireAuth: true
      // },
      children:[
        {
          path:'/user',
          name:'User',
          component: User,
          // meta:{
          //   requireAuth:true,
          // }
        },{
          path:'/video',
          name:'Video',
          component: Video
        },{
          path:'/replay',
          name:'Replay',
          component: Replay
        },{
          path:'/wechat/:id',
          name:'Wechat',
          component: Wechat,
          children:[{
            path:'/video',
            name:'Video',
            component:Video
          }]
        },{
          path:'/chatHome',
          path: 'ChatHome',
          component: ChatHome
        }
      ]
    },
    //添加登录页面路由
    {
      path:'/login',
      name: 'Login',
      component: Login
    },{
      path:'/register',
      name:'register',
      component: Register
    }
  ]
})

<template>
  <el-menu
    class="el-menu-vertical-demo"
    @open="handleOpen"
    @close="handleClose"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
    style="min-height:100%"
    :collapse="isCollapse">
    <Item :data="menu" />
  </el-menu>
</template>
<script>
import Item from './item.vue'
export default {
  components: { Item },
  name: "CommonAside",
  data() {
    return {
      //展开 还是折叠
      isCollapse: false,
      menu: [
        {index:"1",path: "/", name: "home", label: "首页", icon: "s-home", children:[
          {index:"1",path: "/login", name: "home", label: "页面1", icon: "s-home"},
          {index:"2",path: "/", name: "home", label: "页面2", icon: "s-home"},
        ]},
        {index:"2",path: "/login", name: "home", label: "数据查询", icon: "s-home"},
        // {index:"3",path: "/", name: "home", label: "交易申请", icon: "s-home"},
        {index:"4",path: "/chatHome", name: "Wechat", label: "多人聊天", icon: "s-home"},
        {index:"5",path: "/Replay", name: "home", label: "直播回放", icon: "s-home"},
        {index:"6",path: "/video", name: "home", label: "直播讲解", icon: "s-home"},
      ]
    };
  },
  methods:{
    handleOpen(key, keyPath){},
    handleClose(key, keyPath){}
  }
}
</script>
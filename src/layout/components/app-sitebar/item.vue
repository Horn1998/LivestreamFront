<template>
  <div>
    <label v-for="item in data" :key="item.index">
      <el-menu-item :index="item.index" :key="item.index" @click="clickMenu(item)" v-if="item.children==undefined">
        <i :class="'el-icon-'+item.icon" class="_position"></i>
        <span slot="title">{{ item.label }}</span>
      </el-menu-item>
      <el-submenu :index="item.index" :key="item.index" v-if="item.children!=undefined">
        <template slot="title" class="el-menu-item">
          <i :class="'el-icon-'+item.icon" class="_position"></i>
          <span slot="title">{{ item.label }}</span>
        </template>
        <item :data="item.children" />
      </el-submenu>
    </label>
  </div>
</template>

<script>
export default {
  name: "Item",
  props:["data"],
  methods:{
    clickMenu(item) {
      this.$router.push({path: item.path});
    }
  }
}
</script>
<style>
.el-menu-item {
 
    font-size: 14px;
 
    color: #303133;
 
    padding: 0 20px;
 
    cursor: pointer;
 
    -webkit-transition: border-color .3s,background-color .3s,color .3s;
 
    transition: border-color .3s,background-color .3s,color .3s;
 
    -webkit-box-sizing: border-box;
 
    box-sizing: border-box;
 
    padding-left: 20px; color: rgb(255, 255, 255); background-color: rgb(84, 92, 100);
 
}
</style>

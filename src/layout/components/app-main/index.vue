<template>
  <el-main>
    <section class="app-main-container">
      <router-view v-if="isRouterAlive"></router-view>
    </section>
  </el-main>
</template>

<script>
export default {
  name: "AppMain",
  computed: {
    key() {
      console.log(this.$route.path);
      return this.$route.path;
    },
  },
  provide (){
      return {
        reload:this.reload
      }
  },
  data(){
    return {
        isRouterAlive:true
    }
  },
  methods:{
    reload (){
        this.isRouterAlive = false
        this.$nextTick(function(){
          this.isRouterAlive = true
        })
    }
  },
};
</script>
<style lang="scss" scoped>
$font-color: #323232;
$white-color: #ffffff;
$gray-color: #373d41;
$light-gray-color: #f5f5f5;
$yellow-color: #ffd500;
$black-color: #222222;
.app-main-container {

}
</style>
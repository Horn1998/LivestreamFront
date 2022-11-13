<template>
  <div>
    <app-header></app-header>  
    <el-container>  
      <el-aside width="13%">
        <app-sitebar :items="sidebarItems" ></app-sitebar>
      </el-aside>
      <el-main  class="main">
        <app-main class="content" ></app-main>
      </el-main>
     </el-container>
    <app-footer></app-footer>
  </div>
</template>
<script>
  import getSidebarItems from '@/data/sidebar-nav-items';
  import { mapState, mapMutations } from 'vuex'
  import { AppMain, AppHeader, AppFooter, AppSitebar} from "./components";
  export default {
    name: "layout",
    data () {
      return {
        sidebarItems:getSidebarItems(),
      }
    },
    computed: {
    },
    methods: {
      ...mapMutations(['ADD_ANIMATION']),
      beforeEnter (el) {
        let elStyle = el.style
        let elChild = el.children[0]
        let elChildSty = elChild.style
        elStyle.transform = `translate3d(0,${this.elTop - this.cartPositionT}px,0)`
        elChildSty.transform = `translate3d(${-(this.cartPositionL - this.elLeft)}px,0,0) scale(1.2)`
      },
      afterEnter (el) {
        let elStyle = el.style
        let elChild = el.children[0]
        let elChildSty = elChild.style
        elStyle.transform = `translate3d(0,0,0)`
        elChildSty.transform = `translate3d(0,0,0) scale(.2)`
        elStyle.transition = 'transform .55s cubic-bezier(.29,.55,.51,1.08)'
        elChildSty.transition = 'transform .55s linear'
      }
    },
    components: {
      AppFooter,
      AppHeader,
      AppMain,
      AppSitebar
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  @import "../assets/style/mixin";
$gray-color: #ededed;
.is-height {
  height: 1000px;
}
.layout-container {
  //因为有padding 所以要加30px
  min-width: 830px;
  .app-main-container {
    background-color: $gray-color;
    .content {
      margin: 0 auto;
      float: left;
    }
  }
}
  .main {
    min-height: calc(100vh - 200px);
    background: #ededed;
    overflow: hidden;
    width: 100%;
  }

  .bn {
    border-style: none;
    border-width: 0;
    border: none;
  }

  .move_img {
    position: fixed;
    @include wh(40px);
    width: 45px;
    z-index: 29;
    height: 45px;
    div {
      @extend .bn;
    }
    img {
      border-radius: 50%;
      width: 100%;
      height: 100%;
      display: block;
      @extend .bn;
    }
  }
  

</style>

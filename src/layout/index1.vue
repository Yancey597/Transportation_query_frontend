<template>
  <div class="layout_container">
    <div class="layout_tabbar">
      <t-head-menu v-model="menu1Value" theme="light" @change="changeHandler">
        <template #logo>
          <img
            height="28"
            src="https://tdesign.gtimg.com/site/baseLogo-light.png"
            alt="logo"
          />
        </template>
        <t-menu-item value="item1"> 菜单1 </t-menu-item>
        <t-menu-item value="item2"> 菜单2 </t-menu-item>
        <t-menu-item value="item4" :disabled="true"> 禁用菜单 </t-menu-item>
        <template #operations>
          <t-button variant="text" shape="square">
            <template #icon><t-icon name="search" /></template>
          </t-button>
          <t-button variant="text" shape="square">
            <template #icon><t-icon name="mail" /></template>
          </t-button>
          <t-button variant="text" shape="square">
            <template #icon><t-icon name="user" /></template>
          </t-button>
          <t-button variant="text" shape="square">
            <template #icon><t-icon name="ellipsis" /></template>
          </t-button>
        </template>
      </t-head-menu>
    </div>
    <!-- 左侧菜单 -->
    <div class="layout_slider">
      <Logo />
      <!-- 展示菜单 -->
      <!-- 滚动组件 -->
      <el-scrollbar class="scrollbar">
        <!-- 菜单组件 -->
        <el-menu
          :collapse="LayOutSettingStore.fold ? true : false"
          background-color="#f5f5f5"
          text-color="black"
          :default-active="$route.path"
          active-text-color="yellowgreen"
        >
          <!-- 根据路由动态生成菜单 -->
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </el-scrollbar>
    </div>

    <!-- 顶部导航 -->
    <!--    <div-->
    <!--      class="layout_tabbar"-->
    <!--      :class="{ fold: LayOutSettingStore.fold ? true : false }"-->
    <!--    >-->
    <!--      <Tabbar></Tabbar>-->
    <!--    </div>-->
    <!-- 内部展示区域 -->
    <div
      class="layout_main"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <Main></Main>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tabbar from "./tabbar/index.vue";

// 引入路由
import { useRoute } from "vue-router";
// Logo组件
import Logo from "./logo/index.vue";
// 菜单组件
import Menu from "./menu/index.vue";
import Main from "./main/index.vue";

// 获取用户相关的小仓库
import userUserStore from "@/store/modules/user";
import useLayOutSettingStore from "@/store/modules/setting";
import { ref } from "vue";

let userStore = userUserStore();
let LayOutSettingStore = useLayOutSettingStore();
// 获取路由对象
let $route = useRoute();
</script>
<script lang="ts">

export default {
  name: "Layout"
};
</script>
<style scoped lang="scss">
.t-menu__operations {
  .t-button {
    margin-left: 8px;
  }
}
.layout_container {
  width: 100%;
  height: 100vh;

  .layout_slider {
    color: white;
    width: $base-menu-width;
    height: 100vh;
    background: $base-menu-background;
    transition: all 0.3s;

    .scrollbar {
      width: 100%;
      height: calc(100vh - $base-menu-logo-height);

      .el-menu {
        border-right: none;
      }
    }
  }

  .layout_tabbar {
    position: fixed;
    width: calc(100% - $base-menu-width);
    height: 100px;
    top: 0px;
    //left: $base-menu-width;
    transition: all 0.3s;
    background-color: white;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }

  .layout_main {
    position: absolute;
    width: calc(100% - $base-menu-width);
    height: calc(100vh - $base-tabbar-height);
    left: $base-menu-width;
    top: $base-tabbar-height;
    padding: 20px;
    overflow: auto;
    transition: all 0.3s;
    background-color: white;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
      left: $base-menu-min-width;
    }
  }
}
</style>

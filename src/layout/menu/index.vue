<template>
  <!-- 模板部分保持不变 -->
  <template v-for="item in menuList" :key="item.path">
    <!--没有子路由-->
    <template v-if="!item.children">
      <el-menu-item
        :index="item.path"
        v-if="!item.meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由但是只有一个子路由 -->
    <template v-if="item.children && item.children.length == 1">
      <el-menu-item
        :index="item.children[0].path"
        v-if="!item.children[0].meta.hidden"
        @click="goRoute"
      >
        <el-icon>
          <component :is="item.children[0].meta.icon"></component>
        </el-icon>
        <template #title>
          <span>{{ item.children[0].meta.title }}</span>
        </template>
      </el-menu-item>
    </template>
    <!-- 有子路由且个数大于一个1 -->
    <el-sub-menu
      :index="item.path"
      v-if="item.children && item.children.length > 1"
    >
      <template #title>
        <el-icon>
          <component :is="item.meta.icon"></component>
        </el-icon>
        <span>{{ item.meta.title }}</span>
      </template>
      <Menu :menuList="item.children"></Menu>
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";

defineProps(["menuList"]);
const $router = useRouter();
const $route = useRoute();

// 需要刷新页面的来源路由配置
const refreshSourceRoutes = new Set(["/user/home"]);

const goRoute = async (vc: any) => {
  const targetPath = vc.index;
  const currentPath = $route.fullPath;

  try {
    // 先执行路由跳转
    await $router.push(targetPath);

    // 判断是否需要刷新
    if (refreshSourceRoutes.has(currentPath)) {
      window.location.reload();
      // 使用setTimeout避免阻塞路由跳转
    }
  } catch (error) {
    console.error("路由跳转失败:", error);
  }
};
</script>

<script lang="ts">
export default {
  name: "Menu"
};
</script>

<style scoped></style>

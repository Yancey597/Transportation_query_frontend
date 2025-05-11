<template>
  <!-- 路由组件出口的位置 -->
  <router-view v-slot="{ Component }">
    <transition name="fade">
      <!-- 渲染layout一级路由组件的子路由 -->
      <component :is="Component" v-if="flag" />
    </transition>
  </router-view>
  <div class="footer">
    <p>
      <a href="https://yancey.vip"
        >YanceyStudio
        <i class="iconfont icon-banquan" style="font-size: 18px"></i> | Never
        Settle.
      </a>
      <br />
      <a href="https://beian.miit.gov.cn/#/Integrated/index"
        >鄂ICP备2024050350号-1</a
      >
      <br />
      <a href="https://beian.mps.gov.cn/#/query/webSearch">
        鄂公网安备42011502001725号
      </a>
    </p>
  </div>
</template>

<script setup lang="ts">
import { watch, ref, nextTick } from "vue";
import useLayOutSettingStore from "@/store/modules/setting";

let layOutSettingStore = useLayOutSettingStore();

//控制当前组件是否销毁重建
let flag = ref(true);

//监听仓库内部数据是否发生变化,如果发生变化，说明用户点击过刷新按钮
watch(
  () => layOutSettingStore.refsh,
  () => {
    //点击刷新按钮:路由组件销毁
    flag.value = false;
    nextTick(() => {
      flag.value = true;
    });
  }
);
</script>
<script lang="ts">
export default {
  name: "Main"
};
</script>

<style scoped lang="scss">
.fade-enter-from {
  opacity: 0;
  transform: scale(0);
}

.fade-enter-active {
  transition: all 0.3s;
}

.fade-enter-to {
  opacity: 1;
  transform: scale(1);
}

//.footer {
//  width: calc(100% - $base-menu-width);
//  margin: 10px 0px;
//  text-align: center;
//}

a {
  text-decoration: none;
  color: inherit;
}
.footer {
  font-size: 15px;
  position: fixed;
  bottom: 7px;
  left: 7%;
  color: #8c939d;
  transform: translate(-50%, -50%);
  .p {
    //padding: 10px;
  }
}
</style>

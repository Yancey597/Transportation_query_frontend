<template>
  <div class="layout_container">
    <!-- 顶部导航 -->
    <div
      class="layout_tabbar"
      :class="{ fold: LayOutSettingStore.fold ? true : false }"
    >
      <t-head-menu v-model="menu1Value" theme="light" @change="changeHandler">
        <template #logo>
          <img height="40" src="@/assets/images/logo_blue.png" alt="logo" />
        </template>
        <template #operations>
          <!--          <t-button variant="text" shape="square">-->
          <!--            <template #icon><t-icon name="search" /></template>-->
          <!--          </t-button>-->
          <!--          <t-button variant="text" shape="square">-->
          <!--            <template #icon><t-icon name="mail" /></template>-->
          <!--          </t-button>-->
          <!--          <t-button variant="text" shape="square">-->
          <!--            <template #icon-->
          <!--              ><t-icon name="user" @click="goToUserAccount"-->
          <!--            /></template>-->
          <!--          </t-button>-->
          <!--          <t-button variant="text" shape="square">-->
          <!--            <template #icon><t-icon name="ellipsis" /></template>-->
          <!--          </t-button>-->

          <t-avatar :image="user.userAvatar" @click="goToUserAccount">
            <img style="width: 15%" :src="user.userAvatar" />
          </t-avatar>

          <t-content :content="个人中心">个人中心</t-content>
          <t-button variant="text" shape="square">
            <template #icon
              ><t-icon
                name="logout"
                @click="
                  logout();
                  NotifyPlugin.success({
                    title: '下次再见',
                    content: '已成功退出系统！',
                    duration: 800,
                    closeBtn
                  });
                "
            /></template>
          </t-button>
        </template>
      </t-head-menu>
    </div>
    <!-- 左侧菜单和主要内容区域 -->
    <div class="layout_content">
      <div class="layout_slider">
        <!--        <el-scrollbar class="scrollbar">-->
        <el-menu
          :default-active="defaultActive"
          :default-openeds="defaultOpeneds"
        >
          <Menu :menuList="userStore.menuRoutes"></Menu>
        </el-menu>
      </div>
      <div
        class="layout_main"
        :class="{ fold: LayOutSettingStore.fold ? true : false }"
      >
        <Main></Main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import Tabbar from "./tabbar/index.vue";
// 引入路由
import { useRoute, useRouter } from "vue-router";
// Logo组件
// import Logo from "./logo/index.vue";
// 菜单组件
import Menu from "./menu/index.vue";
import Main from "./main/index.vue";

// 获取用户相关的小仓库
import userUserStore from "@/store/modules/user";
import useLayOutSettingStore from "@/store/modules/setting";
let userStore = userUserStore();
let LayOutSettingStore = useLayOutSettingStore();

// 默认展开的菜单

// 获取路由对象
let $route = useRoute();
let $router = useRouter();
const defaultOpeneds = ref(["/welcome", "/user"]);
// 默认选中的菜单
const defaultActive = ref($route.fullPath);
import { onMounted, ref } from "vue";
import { HeadMenuProps, NotifyPlugin, Link } from "tdesign-vue-next";
import { CloseCircleFilledIcon } from "tdesign-icons-vue-next";
import Tabbar from "@/layout/tabbar/index.vue";
import { GET_ID } from "@/utils/token";
import {
  getUserVoByIdUsingGet,
  updateMyUserUsingPost
} from "@/api/userController";
import { getTravelDataUsingGet } from "@/api/spotOrderController";
const menu1Value = ref("item2");
const changeHandler: HeadMenuProps["onChange"] = (active) => {
  console.log("change", active);
};
const user = ref({
  id: 0,
  userAvatar: "",
  userName: "",
  userProfile: "",
  userRole: ""
});
onMounted(() => {
  getUserInformationById();
  // fetchTravelData(GET_ID(), 1);
});
const logout = async () => {
  await userStore.userLogout();
  $router.push({ path: "/login" });
};
const getUserInformationById = async () => {
  const id = GET_ID();
  let result: any = await getUserVoByIdUsingGet({
    id: id
  });
  if (result.code == 200) {
    user.value = result.data;
  }
};
const goToUserAccount = () => {
  $router.push("/user/account");
};

const goToAiMessage = () => {
  $router.push("/user/AiTalk");
};

const goWelcome = () => {
  $router.push("/welcome");
};
</script>

<style scoped lang="scss">
.layout_container {
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;

  .layout_tabbar {
    position: relative;
    width: 100%;
    height: 3em;
    background-color: white;
    transition: all 0.3s;

    &.fold {
      width: calc(100vw - $base-menu-min-width);
    }
  }

  .layout_content {
    display: flex;
    flex: 1;
    overflow: hidden;

    .layout_slider {
      color: white;
      width: $base-menu-width;
      background: $base-menu-background;
      transition: all 0.3s;

      .scrollbar {
        width: 100%;
        height: 100%;

        .el-menu {
          border-right: none;
        }
      }

      &.fold {
        width: $base-menu-min-width;
      }
    }

    .layout_main {
      flex: 1;
      height: 100%;
      //padding: 20px;
      overflow: auto;
      background-color: white;
      transition: all 0.3s;

      &.fold {
        width: calc(100vw - $base-menu-min-width);
      }
    }
  }
}
</style>

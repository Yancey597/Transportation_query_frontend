<script setup lang="ts">
// 引入路由器和路由
import { useRouter } from "vue-router";
import { onMounted, ref } from "vue";
// 引入用户相关的小仓库
import userUserStore from "@/store/modules/user";
import useLayOutSettingStore from "@/store/modules/setting";
// 引入封装的用户信息服务
import { useUserInformation } from "@/api/userService";

// 创建路由器对象
let $router = useRouter();
let layOutSettingStore = useLayOutSettingStore();
let userStore = userUserStore();

// 使用封装的用户信息服务
const { user, getUserInformationById } = useUserInformation();

onMounted(() => {
  getUserInformationById();
});

const getUserAvatar = () => {
  userStore.avatar = user.value.userAvatar;
};
const getUserAccount = () => {
  userStore.userAccount = user.value.userAccount;
};


</script>
<template>
  <div>
    <h3>用户信息</h3>
    <p>用户名: {{ user.userName }}</p>
    <p>用户账号: {{ user.userAccount }}</p>
    <p>用户头像: <img :src="user.userAvatar" alt="用户头像" style="width: 50px; height: 50px; border-radius: 50%;" /></p>
  </div>
</template>

<script setup lang="ts">
// 引入封装的用户信息服务
import { useUserInformation } from "@/api/userService";

// 使用封装的用户信息服务
const { user, getUserInformationById } = useUserInformation();

// 在组件挂载时获取用户信息
onMounted(() => {
  getUserInformationById();
});
</script>
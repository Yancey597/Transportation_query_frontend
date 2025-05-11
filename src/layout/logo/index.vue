<template>
  <div class="logo" v-if="setting.logoHidden">
    <img :src="setting.logo" style="height: 2.5em" />
    <!--    <img src="@/assets/images/logo.png" />-->
    <p>{{ setting.title }}</p>
  </div>
</template>

<script setup lang="ts">
import setting from "@/setting";
</script>
<script lang="ts">
export default {
  name: "Logo"
};
</script>
<style scoped lang="scss">
.logo {
  width: 80%;
  height: 3em;
  color: black;
  display: flex;
  align-items: center;
  padding-left: 40px;

  p {
    font-size: $base-logo-title-fontSize;
    margin-left: 10px;
  }
}
</style>

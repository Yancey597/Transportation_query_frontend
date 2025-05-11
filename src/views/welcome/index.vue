<template>
  <div style="display: flex; justify-content: center; height: 99%">
    <!--    <el-card style="width: 100%; height: 99%">-->
    <!--      <el-row style="font-size: 28px">欢迎使用智能城市公交查询系统 🎉</el-row>-->
    <!--      <el-row style="font-size: 20px; margin: 40px 0">-->
    <!--        智能城市公交查询系统！在这里，您可以通过我们强大的平台查询和规划公共交通出行线路，管理员可以自定义路线和站点信息以及发布公告，集成AI大语言模型提供路线规划，增强您的使用体验。-->
    <!--      </el-row>-->
    <!--      <el-row class="card_container" style="margin: 40px 0">-->
    <!--        <el-card>-->
    <!--          <el-row style="margin: 15px 0; font-size: 20px; font-weight: bold">-->
    <!--            ⭐可视化出行线路规划-->
    <!--          </el-row>-->
    <!--          <el-row style="font-size: 16px; font-weight: bold; line-height: 24px">-->
    <!--            🚌平台提供可视化的公共交通出行线路规划功能，帮助您轻松查询和规划出行路线。-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--        <el-card>-->
    <!--          <el-row style="margin: 15px 0; font-size: 20px; font-weight: bold">-->
    <!--            ⭐自定义路线和站点信息-->
    <!--          </el-row>-->
    <!--          <el-row style="font-size: 16px; font-weight: bold; line-height: 24px">-->
    <!--            🛠️管理员可以自定义路线和站点信息，确保信息的准确性和时效性。-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--        <el-card>-->
    <!--          <el-row style="margin: 15px 0; font-size: 20px; font-weight: bold">-->
    <!--            ⭐发布公告-->
    <!--          </el-row>-->
    <!--          <el-row style="font-size: 16px; font-weight: bold; line-height: 24px">-->
    <!--            📢管理员可以发布公告，及时向用户传达重要信息。-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--        <el-card>-->
    <!--          <el-row style="margin: 15px 0; font-size: 20px; font-weight: bold">-->
    <!--            ⭐集成AI大语言模型-->
    <!--          </el-row>-->
    <!--          <el-row style="font-size: 16px; font-weight: bold; line-height: 24px">-->
    <!--            🤖平台集成AI大语言模型，提供智能路线规划，提升用户体验。-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--        <el-card>-->
    <!--          <el-row style="margin: 15px 0; font-size: 20px; font-weight: bold">-->
    <!--            ⭐美观的前端页面-->
    <!--          </el-row>-->
    <!--          <el-row style="font-size: 16px; font-weight: bold; line-height: 24px">-->
    <!--            🎨平台提供美观的前端页面设计，确保用户操作简便且舒适。-->
    <!--          </el-row>-->
    <!--        </el-card>-->
    <!--      </el-row>-->
<!--    <img src="@/assets/images/banner.png" />-->
    <t-swiper
      class="tdesign-demo-block--swiper"
      :navigation="{ placement: 'outside' }"
    >
      <t-swiper-item>
        <div class="demo-item">
          <img src="@/assets/images/banner.png" />
        </div>
      </t-swiper-item>
    </t-swiper>
    <!--    </el-card>-->
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
  color: rgb(37, 130, 255);
  font-weight: bold;
}

.card_container {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .el-card {
    height: 250px;
    flex-basis: calc(20% - 1rem);
    margin: 0 0.5rem;
  }
}

.tdesign-demo-block--swiper {
  width: 100%;
  height: 300px;
}

.demo-item {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-color: #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin-bottom: 10px;
  }

  h3 {
    font-size: 20px;
    margin-bottom: 10px;
  }

  p {
    font-size: 16px;
    color: #666;
  }
}
</style>

<style scoped>
/* 新增样式 */
.sidebar {
  width: 300px;
  height: calc(100% - 50px); /* 菜单高度低于地图高度 */
  background-color: white;
  position: absolute; /* 将菜单栏置于地图之上 */
  top: 0;
  right: 0;
  padding: 20px;
  box-sizing: border-box;
  z-index: 1; /* 确保菜单栏在地图之上 */
}

.sidebar input,
.sidebar button {
  display: block;
  margin-bottom: 10px;
  width: 100%;
}

#map-container {
  width: 100%;
  height: 100%;
  position: relative;
  z-index: 0; /* 地图层在菜单之下 */
}
</style>

<template>
  <div id="container" style="width: 100%; height: 100%;">
    <!-- 地图容器 -->
    <div id="map-container"></div>
    <!-- 添加右侧菜单栏 -->
    <div class="sidebar">
      <!-- 添加输入框 -->
      <input v-model="startKeyword" placeholder="请输入起点" />
      <input v-model="endKeyword" placeholder="请输入终点" />
      <!-- 添加按钮 -->
      <button @click="searchTransfer">搜索公交路线</button>
      <button @click="resetSearch">重置搜索</button>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

const startKeyword = ref("");
const endKeyword = ref("");
let map;
let transfer;

onMounted(() => {
  // 设置安全码
  window._AMapSecurityConfig = {
    securityJsCode: "847f3e7e98939963b9309484870b8845" // 替换为你的安全密钥
  };

  // 初始化高德地图
  const initMap = () => {
    return new AMap.Map("map-container", {
      resizeEnable: true, // 是否监控地图容器尺寸变化
      center: [116.397428, 39.90923], // 北京市的经纬度
      mapStyle: "amap://styles/whitesmoke",
      zoom: 13 // 缩放级别
    });
  };

  // 加载高德地图 API
  AMapLoader.load({
    key: "ed324d241897c68a929846b99e232774", // 你的key
    version: "2.0", // 指定要加载的 JSAPI 的版本
    plugins: ["AMap.Transfer"] // 需要使用的插件列表
  })
    .then((AMap) => {
      map = initMap();

      // 配置公交换乘选项
      const transOptions = {
        map: map,
        city: "北京市",
        panel: "panel", // 结果展示在 #panel 容器中
        policy: AMap.TransferPolicy.LEAST_TIME // 乘车策略：最少时间
      };

      // 构造公交换乘类
      transfer = new AMap.Transfer(transOptions);
    })
    .catch((e) => {
      console.error(e);
    });
});

const searchTransfer = () => {
  const startKeywordValue = startKeyword.value; // 修改：通过 .value 访问响应式变量
  const endKeywordValue = endKeyword.value; // 修改：通过 .value 访问响应式变量
  const city = "北京市"; // 这里可以动态设置城市

  // 根据起、终点名称查询公交换乘路线
  transfer.search(
    [
      { keyword: startKeywordValue, city: city }, // 修改：使用正确的变量值
      { keyword: endKeywordValue, city: city } // 修改：使用正确的变量值
    ],
    (status, result) => {
      if (status === "complete") {
        console.log("绘制公交路线完成");
      } else {
        console.error("公交路线数据查询失败", result);
      }
    }
  );
};

// 添加重置搜索功能
const resetSearch = () => {
  startKeyword.value = "";
  endKeyword.value = "";
  // 清除地图上的路线等信息
  if (transfer) {
    transfer.clear();
  }
};
</script>
<template>
  <div
    id="map-container"
    class="guide-container"
    style="width: 99%; height: 99%"
  ></div>

  <div class="sideebar">
    <t-space direction="vertical">
      <t-space align="center" :size="170">
        <p style="color: black; font-size: 1.3em; margin-left: 10px">
          路线查询
        </p>
        <t-button theme="default" size="medium" @click="handleClick">
          使用教程</t-button
        >
      </t-space>
      <t-guide
        v-model="current"
        :steps="steps"
        :show-overlay="false"
        @change="handleChange"
        @prev-step-click="handlePrevStepClick"
        @next-step-click="handleNextStepClick"
        @finish="handleFinish"
        @skip="handleSkip"
      />

      <t-card :style="{ width: '370px' }" class="main-title">
        <t-space direction="vertical">
          <!-- 起始地址输入框 -->
          <t-input
            id="start-input"
            v-model="startKeyword"
            placeholder="输入起始地址"
            size="large"
            class="label-field1"
            clearable
            @input="handleInput('start')"
          >
            <template #prefix-icon>
              <LocationIcon />
            </template>
          </t-input>

          <!-- 目标地址输入框 -->
          <t-input
            id="end-input"
            v-model="endKeyword"
            placeholder="输入目标地址"
            size="large"
            class="label-field2"
            clearable
            @input="handleInput('end')"
          >
            <template #prefix-icon>
              <LocationIcon />
            </template>
          </t-input>

          <t-radio-group
            v-model="transportType"
            size="medium"
            class="label-field3"
          >
            <t-radio-button value="1"> 地铁 </t-radio-button>
            <t-radio-button value="2"> 公交 </t-radio-button>
            <t-radio-button value="3"> 步行 </t-radio-button>
          </t-radio-group>

          <t-space :size="20" style="margin-top: 15px" class="action">
            <t-button theme="primary" size="medium" @click="searchTransfer">
              查询路线
            </t-button>
            <t-button theme="default" size="medium" @click="resetSearch">
              重置搜索
            </t-button>
          </t-space>
        </t-space>
      </t-card>
      <p style="color: #858787; font-size: 1em; margin-left: 10px">查询结果</p>
      <div id="panel" style="height: 51vh; overflow: auto">
        <t-space
          direction="vertical"
          style="
            display: flex;
            justify-content: center; /* 水平居中 */
            align-items: center; /* 垂直居中 */
            height: 100%;
          "
          align="center"
          v-if="!isRouteResultVisible"
        >
          <t-empty size="large" />
        </t-space>
      </div>
    </t-space>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onBeforeUnmount, ref, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import {
  MessagePlugin,
  SpaceProps,
  GuideProps,
  ButtonProps
} from "tdesign-vue-next";
import { SearchIcon, LocationIcon } from "tdesign-icons-vue-next";

// 响应式数据
const isRouteResultVisible = ref(false);
const startKeyword = ref("");
const endKeyword = ref("");
const searchKeyword = ref("");
const transportType = ref("1");
const currentCity = ref("");
let map = null;
let transfer = null;
let autoStart = null;
let autoEnd = null;
let placeSearch = null;
let mainSearchAuto = null;
let geocoder = null;

// 安全配置
window._AMapSecurityConfig = {
  securityJsCode: "290ddc4b0d33be7bc9b354bc6a4ca614"
};

// 地图初始化
onMounted(async () => {
  try {
    const AMap = await AMapLoader.load({
      key: "6f025e700cbacbb0bb866712d20bb35c",
      version: "2.0",
      plugins: [
        "AMap.Transfer",
        "AMap.CitySearch",
        "AMap.AutoComplete",
        "AMap.PlaceSearch",
        "AMap.Driving",
        "AMap.Geocoder"
      ]
    });

    initMap(AMap);
    // 2. 然后定位城市并初始化 transfer
    initCitySearch(AMap);

    // 3. 初始化地址自动完成等
    await initAutocomplete(AMap);
    MessagePlugin.success(`地图初始化成功！`);
    initMainSearch(AMap);
  } catch (error) {
    MessagePlugin.error(`地图加载失败: ${error.message}`);
    console.error("AMap 加载失败:", error);
  }
});

// 组件卸载清理
onBeforeUnmount(() => {
  if (map) {
    map.destroy();
    map = null;
  }
  [autoStart, autoEnd, mainSearchAuto].forEach((instance) => {
    if (instance) {
      instance.clearEvents();
      instance.destroy();
    }
  });
});

// 初始化地图实例
const initMap = (AMap) => {
  map = new AMap.Map("map-container", {
    resizeEnable: true,
    // mapStyle: "amap://styles/macaron",
    // center: [116.397428, 39.90923],
    center: [114.416, 30.481],
    zoom: 13
  });
};

// 初始化城市搜索
// const initCitySearch = (AMap) => {
//   const citySearch = new AMap.CitySearch();
//   citySearch.getLocalCity((status, result) => {
//     if (status === "complete" && result.info === "OK") {
//       currentCity.value = result.city;
//       // map.setZoom(18, false, 2000);
//       geocoder = new AMap.Geocoder({
//         city: result.city,
//         radius: 1000 // 添加搜索半径
//       });
//       const searchAddress = result.city.endsWith("市")
//         ? `${result.city}人民政府`
//         : `${result.city}市人民政府`;
//       geocoder.getLocation(searchAddress, (statuss, data) => {
//         if (statuss !== "complete" || !data?.geocodes?.length) {
//           console.error("地理编码失败:", data);
//           map.setCenter(result.bounds.getCenter());
//           return;
//         }
//         const location = data.geocodes[0].location;
//         if (location) {
//           map.setCenter([location.lng, location.lat]);
//           console.log(location);
//           map.setZoom(13);
//           MessagePlugin.success("开发环境，已定位到当前城市市中心");
//         }
//       });
//       // console.log(currentCity.value + "123");
//       console.log(result);
//       // map.setCenter(result.)
//     }
//     initTransfer(AMap, result.city);
//   });
// };
const initCitySearch = (AMap) => {
  const cityName = "武汉市";
  currentCity.value = cityName;
  geocoder = new AMap.Geocoder({
    city: cityName,
    radius: 1000 // 添加搜索半径
  });
  const searchAddress = "武汉市东湖学院";
  geocoder.getLocation(searchAddress, (statuss, data) => {
    if (statuss !== "complete" || !data?.geocodes?.length) {
      console.error("地理编码失败:", data);
      return;
    }
    const location = data.geocodes[0].location;
    if (location) {
      map.setCenter([location.lng, location.lat]);
      console.log(location);
      map.setZoom(17);
      MessagePlugin.success("成功获取当前位置：武汉东湖学院！");
    }
  });
  initTransfer(AMap, cityName);
};

// 初始化换乘功能
const initTransfer = (AMap, city) => {
  transfer = new AMap.Transfer({
    map: map,
    city: city,
    panel: "panel",
    // policy: getPolicyType(transportType.value),
    hideMarkers: false,
    showTraffic: true
  });
};

// 初始化主搜索框自动完成
const initMainSearch = (AMap) => {
  mainSearchAuto = new AMap.AutoComplete({
    city: currentCity.value
  });

  placeSearch = new AMap.PlaceSearch({
    map: map,
    city: currentCity.value
  });
};

// 初始化地址输入框自动完成
const initAutocomplete = async (AMap) => {
  await nextTick();
  autoStart = new AMap.AutoComplete({
    input: "start-input",
    city: currentCity.value
  });
  autoEnd = new AMap.AutoComplete({
    input: "end-input",
    city: currentCity.value
  });
  autoStart.on("select", handleSelectStart);
  autoEnd.on("select", handleSelectEnd);
};
const handleSearchInput = (value) => {
  if (value.length > 1) {
    mainSearchAuto.search(value, (status, result) => {
      if (status === "complete") {
        placeSearch.search(value);
      }
    });
  }
};
// 处理地址输入
const handleInput = (type) => {
  const keyword = type === "start" ? startKeyword.value : endKeyword.value;
  if (keyword.length > 1) {
    const autoInstance = type === "start" ? autoStart : autoEnd;
    autoInstance.search(keyword);
  }
};
// 处理地址选择
const handleSelectStart = async (e) => {
  try {
    if (e.poi) {
      startKeyword.value = e.poi.name;
      await nextTick();
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name);
      map.setCenter(e.poi.location);
    }
  } catch (error) {
    console.error("起始地址选择错误:", error);
  }
};

// 处理终点选择
const handleSelectEnd = async (e) => {
  try {
    if (e.poi) {
      endKeyword.value = e.poi.name;
      await nextTick();
      placeSearch.setCity(e.poi.adcode);
      placeSearch.search(e.poi.name);
      map.setCenter(e.poi.location);
    }
  } catch (error) {
    console.error("目标地址选择错误:", error);
  }
};

// 查询换乘路线
const searchTransfer = async () => {
  if (!startKeyword.value || !endKeyword.value) {
    MessagePlugin.warning("请输入完整的起始地址和目标地址");
    return;
  }
  try {
    // transfer.setPolicy(getPolicyType(transportType.value));
    transfer.search(
      [{ keyword: startKeyword.value }, { keyword: endKeyword.value }],
      (status, result) => {
        if (status === "complete") {
          MessagePlugin.success(`找到${result.plans.length}条路线`);
        } else {
          MessagePlugin.error("无网络连接，路线查询失败，请重试");
        }
      }
    );
  } catch (error) {
    MessagePlugin.error(`路线查询错误: ${error.message}`);
    console.error("换乘查询错误:", error);
  }
  isRouteResultVisible.value = true;
};

// 获取交通策略类型
const getPolicyType = (type) => {
  const policies = {
    1: AMap.TransferPolicy.SUBWAY_FIRST,
    2: AMap.TransferPolicy.LEAST_TRANSFER,
    3: AMap.TransferPolicy.LEAST_WALKING
  };
  return policies[type] || AMap.TransferPolicy.LEAST_TIME;
};

// 重置搜索
const resetSearch = () => {
  startKeyword.value = "";
  endKeyword.value = "";
  searchKeyword.value = "";
  if (transfer) transfer.clear();
  placeSearch.clear();
  map.setZoomAndCenter(12, map.getCenter());
  MessagePlugin.success("已重置搜索条件");
  isRouteResultVisible.value = false;
};
const visible = ref(false);
const current = ref(-1);
const steps: GuideProps["steps"] = [
  {
    element: ".main-title",
    title: "路线查询使用功能介绍",
    body: "根据您输入的地址，AI 查询最适合路线",
    placement: "bottom-right"
  },
  {
    element: ".label-field1",
    title: "起始地址输入",
    body: "",
    placement: "bottom"
  },
  {
    element: ".label-field2",
    title: "目标地址输入",
    body: "",
    placement: "bottom"
  },
  {
    element: ".label-field3",
    title: "优先策略选择",
    body: "",
    placement: "bottom"
  },
  {
    element: ".action",
    title: "查询或重置输入框",
    body: "",
    placement: "right"
  }
];
const handleClick: ButtonProps["onClick"] = () => {
  visible.value = true;
  setTimeout(() => {
    current.value = 0;
  }, 800);
};
const handleChange: GuideProps["onChange"] = (current, { e, total }) => {
  console.log(current, e, total);
};
const handlePrevStepClick: GuideProps["onPrevStepClick"] = ({
  e,
  prev,
  current,
  total
}) => {
  console.log(e, prev, current, total);
};
const handleNextStepClick: GuideProps["onNextStepClick"] = ({
  e,
  next,
  current,
  total
}) => {
  console.log(e, next, current, total);
};
const handleFinish: GuideProps["onFinish"] = ({ e, current, total }) => {
  visible.value = false;
  console.log(e, current, total);
};
const handleSkip: GuideProps["onSkip"] = ({ e, current, total }) => {
  visible.value = false;
  console.log(e, current, total);
};
</script>

<style>
.auto-item {
  font-size: 14px;
  padding: 8px;
  border: 1px solid white; /* 默认边框样式 */
  transition: border-color 0.2s; /* 添加过渡效果 */
}

.auto-item:hover {
  border-color: #0052d9; /* hover 时改变边框颜色 */
  background: white;
  color: #0052d9;
}
.sideebar {
  position: fixed;
  top: 60px;
  right: 40px;
  width: 400px;
  height: 90%;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 20px;
  z-index: 1000;
  backdrop-filter: blur(8px);
}
.planTitle:hover {
}

#panel {
  padding: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

/* 覆盖高德自动完成样式 */

.amap-logo,
.amap-copyright {
  display: none !important;
}
.amap-call {
  display: none !important;
}
.clearfix {
  display: none !important;
}

.title-major {
  color: var(--td-text-color-primary);
  font-size: 36px;
  font-weight: 700;
  line-height: 44px;
}

.title-sub {
  margin-top: 8px;
  color: var(--td-text-color-secondary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.field {
  margin-top: 50px;
}

.label {
  margin-bottom: 8px;
  color: var(--td-text-color-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.action {
  display: inline-flex;
  margin-top: 50px;
}

.action button:first-child {
  margin-right: 10px;
}
</style>

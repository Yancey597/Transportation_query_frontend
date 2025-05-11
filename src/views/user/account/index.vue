<template>
  <div class="personalHomePage">
    <div class="plefts">
      <div class="mars">
        <t-card :bordered="false" :style="{ width: '100%' }">
          <div
            style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 15px;
            "
          >
            <p
              style="
                line-height: 100%;
                font-weight: bold;
                font-size: 1.3em;
                padding: 15px;
              "
            >
              Hi, {{ user.userName }}. 欢迎使用 Routeseek.
            </p>
            <div style="margin-left: auto">
              <img height="40" src="../../../assets/images/logo.png" />
            </div>
          </div>
        </t-card>
      </div>

      <div class="mars">
        <t-space direction="vertical" size="large" :style="{ width: '100%' }">
          <t-tabs v-model="value">
            <t-tab-panel
              :value="1"
              label="个人信息"
              labelSize="100px"
              :destroy-on-hide="false"
            >
              <t-form
                ref="form"
                layout="vertical"
                scroll-to-first-error="smooth"
                style="width: 100%; margin-top: 10px"
              >
                <t-form-item label="头像" name="avatar">
                  <t-input
                    v-model="user.userAvatar"
                    style="width: 500px"
                  ></t-input>
                </t-form-item>
                <t-form-item label="名字" name="name">
                  <t-input
                    v-model="user.userName"
                    style="width: 500px"
                  ></t-input>
                </t-form-item>
              </t-form>
              <t-form
                ref="form"
                layout="vertical"
                scroll-to-first-error="smooth"
                style="margin-top: 20px"
              >
                <t-form-item label="个性签名">
                  <t-input
                    v-model="user.userProfile"
                    style="width: 500px"
                  ></t-input>
                </t-form-item>
                <t-form-item label="注册时间">
                  <t-input
                    v-model="user.createTime"
                    style="width: 500px"
                    disabled
                  ></t-input>
                </t-form-item>
                <t-form-item label="AI 剩余">
                  <t-input
                    v-model="user.aiRemainNumber"
                    style="width: 500px"
                    disabled
                  >
                    ：{{ user.aiRemainNumber }}</t-input
                  >
                </t-form-item>
                <div style="margin-left: 20px; padding-bottom: 30px">
                  <t-popconfirm
                    :visible="visible"
                    theme="default"
                    placement="bottom"
                    content="您确定要提交吗"
                  >
                    <!-- 自定义触发元素 -->
                    <t-button size="large" @click="visible = true"
                      >更新资料</t-button
                    >

                    <template #cancelBtn>
                      <t-button
                        size="small"
                        variant="text"
                        style="margin-right: 12px"
                        @click="visible = false"
                        >取消</t-button
                      >
                    </template>
                    <template #confirmBtn>
                      <t-button
                        size="small"
                        theme="primary"
                        @click="
                          visible = false;
                          updateUserInfo();
                        "
                        >确定</t-button
                      >
                    </template>
                    <!-- 自定义按钮 -->
                  </t-popconfirm>
                  <t-button
                    :loading="loading"
                    theme="success"
                    size="large"
                    style="margin-left: 20px"
                    @click="MessagePlugin.error('权限不足，请联系管理员')"
                    >余额充值</t-button
                  >
                </div>
              </t-form>
            </t-tab-panel>
            <t-tab-panel :value="2" label="TODO" :destroy-on-hide="false">
              <template #panel>
                <p style="padding: 25px">
                  选项卡2的内容，使用 t-tab-panel 渲染
                </p>
              </template>
            </t-tab-panel>
          </t-tabs>
        </t-space>
      </div>
    </div>
    <div class="prights mars">
      <t-card
        :bordered="false"
        :style="{ width: '90%', height: '30%', backgroundColor: '#0052D9' }"
      >
        <p
          style="
            color: white;
            font-size: 3em;
            margin-left: 180px;
            margin-top: -30px;
          "
        >
          {{ user.userName }}
        </p>
        <template #avatar>
          <t-avatar
            shape="circle"
            :image="user.userAvatar"
            :alt="user.userName"
            size="90px"
            style="margin-top: 30px; margin-left: 15px"
          ></t-avatar>
        </template>
        <p style="color: white; margin-top: 10px; margin-left: 185px;font-size: 2em">
          Role:{{ user.userRole }}
        </p>
        <p style="color: white; margin-top: 90px; margin-left: 145px">
          UID:{{ user.id }}
        </p>
      </t-card>
      <t-card
        :bordered="false"
        :style="{ width: '90%', height: '40%', marginTop: '20px' }"
      >
        TODO
      </t-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { GET_ID } from "@/utils/token";
import Post from "@/components/Post/index.vue";
import MyComment from "@/components/MyComment/index.vue";
import SpotOrderList from "@/components/SpotOrderList/index.vue";
import {
  getUserVoByIdUsingGet,
  updateMyUserUsingPost
} from "@/api/userController";
import { ElMessage } from "element-plus";
import {
  MessagePlugin,
  CardProps,
  TabsProps,
  TabPanelProps,
  NotifyPlugin
} from "tdesign-vue-next";
import useUserStore from "@/store/modules/user";
import SpotList from "@/components/SpotList/index.vue";
import { listUserSpotFavoritesVoByPageUsingPost } from "@/api/userSpotFavoritesController";
import {
  getTravelDataUsingGet,
  listSpotOrderVoByPageUsingPost
} from "@/api/spotOrderController";
import HeatmapChart from "@/components/CalendarChart/index.vue";
// 定义响应式数据
const activeName = ref("first");
const userStore = useUserStore();
const newUserAvatar = ref();
const newUserName = ref("");
const isEditing = ref(false);
const spotOrderList = ref();
// 定义数据
const chartData = ref<{ date: string; value: number }[]>([]);
const selectedYear = ref("2025"); // 假设默认年份为 2025
const value = ref(1);
const tab = ref(1);
const visible = ref(false);
const user = ref({
  id: 0,
  userAvatar: "",
  userName: "",
  userProfile: "",
  userRole: "",
  createTime: "",
  aiRemainNumber: ""
});
// 景点列表数据
const spotList = ref([]);
onMounted(() => {
  getUserInformationById();
  loadSpotList();
  loadSpotOrderList();
  fetchTravelData(GET_ID(), 1);
});
// 调用后端接口获取数据
const fetchTravelData = async (userId: number, payStatus: number) => {
  try {
    const res = await getTravelDataUsingGet({
      userId,
      payStatus
    });
    if (res.code === 200) {
      chartData.value = res.data;
    } else {
      ElMessage.error("获取数据失败:", res.message);
    }
  } catch (error: any) {
    ElMessage.error("请求失败:", error);
  }
};
// 加载景点列表
const loadSpotOrderList = async () => {
  try {
    const res = await listSpotOrderVoByPageUsingPost({
      current: 1,
      pageSize: 10,
      userId: GET_ID()
    });
    if (res.code === 200) {
      spotOrderList.value = res.data.records;
    } else {
      ElMessage.error("获取景点列表失败");
    }
  } catch (error) {
    ElMessage.error("获取景点列表失败", error);
  }
};
// 加载景点列表
const loadSpotList = async () => {
  try {
    const res = await listUserSpotFavoritesVoByPageUsingPost({
      current: 1,
      pageSize: 10,
      userId: GET_ID(),
      status: 1
    });
    if (res.code === 200) {
      spotList.value = res.data.records.map((item) => {
        return {
          ...item, // 保留其他字段
          id: item.spotId // 将 spotId 重命名为 id
        };
      });
    } else {
      ElMessage.error("获取景点列表失败");
    }
  } catch (error) {
    ElMessage.error("获取景点列表失败", error);
  }
};
const updateUserInfo = async () => {
  const res = await updateMyUserUsingPost({
    userAvatar: newUserAvatar.value || user.value.userAvatar,
    userName: user.value.userName,
    userProfile: user.value.userProfile
  });
  if (res.code !== 200) {
    return MessagePlugin.error("用户资料更新失败，稍后再试！");
  }
  // 调用 userStore 的 updateAvatar 方法
  await userStore.updateAvatar(newUserAvatar.value || user.value.userAvatar);
  MessagePlugin.success("用户资料成功更新！");
  await getUserInformationById();
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
const startEditing = () => {
  isEditing.value = true;
  newUserName.value = user.value.userName;
};
const saveEdit = () => {
  isEditing.value = false;
  user.value.userName = newUserName.value;
};
</script>

<style lang="scss">
.personalHomePage {
  background-color: #fafafa;
  height: 100%;
  display: flex; // 添加 flex 布局
}
.plefts {
  flex: 3; // 设置左侧部分占据 3/4 的宽度
}
.prights {
  flex: 1; // 设置右侧部分占据 1/4 的宽度
}
.mars {
  padding-top: 30px;
  padding-left: 25px; // 添加左侧间距
  border: none;
}
.t-card__title {
  font-size: 1.3em;
}
</style>

<template>
  <div class="main-container">
    <div class="notice-container">
      <div class="notice-header">
        <h1>出行公告中心</h1>
        <div class="header-decoration"></div>
      </div>

      <div class="notice-main" v-loading="loading">
        <div class="notice-card" v-for="item in noticeList" :key="item.id">
          <div class="card-header">
            <t-icon name="notification-filled" class="notice-icon" />
            <div class="header-text">
              <h3 class="title">{{ item.noticeTitle }}</h3>
              <span class="time">{{ item.createTime }}</span>
            </div>
          </div>
          <div class="card-body">
            <p class="content">{{ item.noticeContent }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { onMounted, ref } from "vue";
import { listNoticeVoByPageUsingPost } from "@/api/noticeController";
import { ElMessage } from "element-plus";

// 初始化数据
const noticeList = ref([]);
const loading = ref(true);
// 获取公告数据
const getNoticeList = async () => {
  loading.value = true;
  try {
    const res = await listNoticeVoByPageUsingPost({
      current: 1,
      pageSize: 15
    });
    noticeList.value = res.data.records;
    loading.value = false;
  } catch (error) {
    loading.value = false;
    ElMessage.error("获取公告列表失败，" + error.message);
  }
};
// 页面加载时获取数据
onMounted(() => {
  getNoticeList();
  const containerWidth = document.querySelector(".scroll-text")?.offsetWidth;
  const textWidth = document.querySelector(".scroll-text")?.scrollWidth;

  // 如果文本宽度大于容器宽度，则启动动画
  if (textWidth && textWidth > containerWidth) {
    document
      .querySelector(".scroll-text")
      ?.style.setProperty("animation", "scroll 10s linear infinite");
  }
});
</script>
<style scoped lang="scss">
.main-container {
  background: white;
  padding: 40px 30px;
  min-height: calc(100vh - 80px);
}

.notice-container {
  max-width: 1400px;
  margin: 0 auto;
}

.notice-header {
  text-align: center;
  margin-bottom: 50px;

  h1 {
    font-size: 2.8rem;
    color: #2c3e50;
    font-weight: 600;
    letter-spacing: 1.5px;
    margin-bottom: 1.2rem;
  }

  .header-decoration {
    width: 120px;
    height: 5px;
    background: #0052d9;
    margin: 0 auto;
    border-radius: 3px;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      width: 24px;
      height: 24px;
      border: 5px solid #0052d9;
      border-radius: 50%;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      background: white;
    }
  }
}

.notice-main {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 35px;
  padding: 20px 0;
}

.notice-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  min-height: 220px;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
  }

  .card-header {
    padding: 20px;
    background: linear-gradient(135deg, #0052d9 0%, #1a73e8 100%);
    color: white;
    display: flex;
    align-items: flex-start;
    gap: 15px;

    .notice-icon {
      font-size: 28px;
      flex-shrink: 0;
      margin-top: 3px;
    }

    .header-text {
      flex: 1;
      min-width: 0;
    }

    .title {
      margin: 0;
      font-size: 1.3rem;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      font-weight: 500;
    }

    .time {
      display: block;
      font-size: 0.95rem;
      opacity: 0.9;
      margin-top: 8px;
    }
  }

  .card-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;

    .content {
      margin: 0;
      color: #444;
      line-height: 1.7;
      font-size: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 5;
      -webkit-box-orient: vertical;
      overflow: hidden;
      flex: 1;
    }
  }
}

/* 加载动画优化 */
:deep(.el-loading-spinner) {
  .el-icon-loading {
    font-size: 50px;
    color: #0052d9;
  }
  .el-loading-text {
    font-size: 20px;
    color: #0052d9 !important;
    margin-top: 20px;
  }
}

/* 响应式适配 */
@media (max-width: 992px) {
  .main-container {
    padding: 30px 20px;
  }

  .notice-header h1 {
    font-size: 2.2rem;
  }

  .notice-main {
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 25px;
  }
}

@media (max-width: 576px) {
  .notice-card {
    min-height: auto;

    .card-header {
      padding: 15px;

      .title {
        font-size: 1.2rem;
        -webkit-line-clamp: 3;
      }
    }

    .content {
      -webkit-line-clamp: 4;
    }
  }
}
</style>

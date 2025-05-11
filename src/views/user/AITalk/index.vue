<template>
  <div class="chat-container">
    <t-chat
      ref="chatRef"
      :data="chatList"
      :text-loading="isLoading"
      style="height: 80vh"
    >
      <!-- 消息内容模板 -->
      <t-chat-content>
        <MdPreview
          :modelValue="item.content"
          previewTheme="github"
          showCodeRowNumber
          class="markdown-content"
        />
      </t-chat-content>
    </t-chat>
    <t-chat-input
      v-model="inputMessage"
      placeholder="请输入您的起始位置及终点，喜欢的交通方式等"
      @send="sendMessage"
      :disabled="isLoading"
      autofocus="true"
    >
    </t-chat-input>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from "vue";
import {
  Chat as TChat,
  ChatAction as TChatAction,
  ChatContent as TChatContent,
  ChatInput as TChatInput,
  ChatItem as TChatItem
} from "@tdesign-vue-next/chat";
import { MdPreview } from "md-editor-v3";
import { ElMessage } from "element-plus";
import { GET_AVATAR, GET_ID } from "@/utils/token";
import { addUserAiMessageUsingPost } from "@/api/userAiMessageController";

interface Message {
  role: "user" | "bot";
  content: string;
}

const isLoading = ref(false);
const inputMessage = ref("");
const sseMessages = ref<Message[]>([]);
const chatRef = ref<InstanceType<typeof TChat>>();

// 转换为TDesign数据结构（注意顺序调整）
const chatList = computed(() => {
  return sseMessages.value
    .map((msg) => ({
      role: msg.role === "user" ? "user" : "bot",
      content: msg.content,
      avatar:
        msg.role === "user"
          ? "https://tdesign.gtimg.com/site/avatar.jpg"
          : "https://tdesign.gtimg.com/site/chat-avatar.png",
      name: msg.role === "user" ? "Yancey" : "Routeseek",
      datetime: new Date().toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit"
      })
    }))
    .reverse(); // TDesign默认最新消息在顶部
});

const sendMessage = async () => {
  if (!inputMessage.value.trim() || isLoading.value) return;
  isLoading.value = true;
  try {
    // 添加用户消息
    sseMessages.value.push({
      role: "user",
      content: inputMessage.value
    });

    // 添加机器人占位消息
    sseMessages.value.push({
      role: "bot",
      content: "正在生成路线建议..."
    });
    const res = await addUserAiMessageUsingPost({
      userInputText: inputMessage.value,
      userId: GET_ID()
    });
    if (res.code === 200) {
      // 更新最后一条消息内容
      const lastIndex = sseMessages.value.length - 1;
      sseMessages.value[lastIndex].content =
        res.data.aiGenerateText || "未收到有效回复";
    } else {
      throw new Error(res.message || "请求失败");
    }
  } catch (error) {
    ElMessage.error(error.message);
    const lastIndex = sseMessages.value.length - 1;
    sseMessages.value[lastIndex].content = "请求失败：" + error.message;
  } finally {
    isLoading.value = false;
    inputMessage.value = "";
    scrollToBottom();
  }
};

const scrollToBottom = () => {
  nextTick(() => {
    chatRef.value?.scrollToBottom();
  });
};

// 初始化欢迎消息
sseMessages.value.push({
  role: "bot",
  content:
    "欢迎使用 RouteSeek 智能路线规划系统！我是您的专属AI路线推荐官，将为您量身打造最优出行方案。  \n\n" + // 注意末尾双空格
    "请提供起始位置：如【武汉东湖学院】  目的地：如【江汉路】，交通偏好：公交、地铁、步行等\n" +
    "*   \n\n" +
    "✨系统将综合考虑：实时交通状况、用户评价数据，为您生成候选路线方案！"
});
</script>

<style scoped>
.chat-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f5f5f5; /* 容器背景改为白色 */
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 消息气泡样式 */
:deep(.t-chat__content) {
  padding: 12px 16px;
  border-radius: 12px;
  max-width: 80%;
  margin: 8px 0;
  line-height: 1.6;
  background-color: #ffffff; /* 气泡背景白色 */
  border: 1px solid #eee; /* 添加浅灰色边框 */
}

/* 用户消息对齐 */
:deep(.t-chat--user) {
  justify-content: flex-end;
}

/* 助手消息对齐 */
:deep(.t-chat--assistant) {
  justify-content: flex-start;
}

/* 调整头像间距 */
:deep(.t-chat__avatar) {
  margin: 0 12px;
}

/* Markdown内容适配 */
:deep(.markdown-content) {
  background: transparent !important;
  padding: 0 !important;

  pre {
    background-color: #f8f9fa; /* 代码块浅灰色背景 */
    padding: 12px;
    border-radius: 8px;
    border: 1px solid #eee;
  }

  table {
    margin: 12px 0;
    border-collapse: collapse;
    background: #fff;

    th,
    td {
      padding: 8px 12px;
      border: 1px solid #eee;
    }
  }
}

/* 输入框样式 */
:deep(.t-chat-input__container) {
  background: #ffffff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border: 1px solid #eee;
}

/* 加载状态文字颜色 */
:deep(.t-loading__text) {
  color: #666;
}
</style>

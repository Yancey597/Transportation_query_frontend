<template>
  <t-comment :avatar="comment.user.userAvatar || '/assets/logo.png'" :author="comment.user.userName" :datetime="comment.createTime" :content="comment.content">
    <template #actions>
      <t-space key="thumbUp" :size="6">
        <t-icon name="thumb-up" />
        <span>6</span>
      </t-space>
      <t-space key="chat" :size="6">
        <t-icon name="chat" />
        <span>回复</span>
      </t-space>
    </template>
  </t-comment>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { GET_ID } from "@/utils/token";
import { ElMessage } from "element-plus";
import { addCommentUsingPost } from "@/api/commentController";

const props = defineProps({
  comment: {
    type: Object,
    required: true
  },
  postId: {
    type: String,
    required: true
  },
  showCount: {
    type: Map,
    require: true
  }
});

const emit = defineEmits(["reply", "delete", "getComment", "doCancel"]);

const loginUser = ref({
  id: GET_ID()
});
const replyContent = ref(""); // 用于存储回复内容
const isReplying = ref(false); // 是否正在输入二级评论
const parentId = ref(props.comment.id); // 当前评论的父评论ID
const showMap = ref(props.showCount);
// 处理点击回复
const handleReply = () => {
  isReplying.value = true;
};
// 取消二级评论
const cancelReply = () => {
  isReplying.value = false;
  replyContent.value = ""; // 清空输入框内容
};

// 提交二级评论
const submitReply = async () => {
  if (!props.postId) {
    return;
  }
  if (!loginUser.value.id) {
    return ElMessage.error({
      duration: 1500,
      message: "请先登录"
    });
  }
  try {
    const res = await addCommentUsingPost({
      postId: props.postId,
      content: replyContent.value,
      parentId: parentId.value
    });
    if (res.code !== 200) {
      isReplying.value = false;
      return ElMessage.error({
        duration: 1500,
        message: `回复失败，${res.message}`
      });
    }
    emit("getComment");
    emit("doCancel");
    ElMessage.success({
      duration: 1500,
      message: "回复评论成功"
    });
    cancelReply();
  } catch (e) {
    ElMessage.error("回复失败: " + e.message);
  }
};

// 处理删除评论
const handleDelete = () => {
  emit("delete", props.comment.id);
};
// 点击展开按钮显示所有回复

const handleExpand = (id, length) => {
  showMap.value = props.showCount;
  showMap.value?.set(id, length);
};
// 点击收起按钮，显示前 3 条
const handleCollapse = (id) => {
  showMap.value = props.showCount;
  showMap.value?.set(id, 3);
};

// 取消删除事件
const cancelEvent = () => {
  ElMessage.success({
    duration: 1000,
    message: "取消删除成功"
  });
};
</script>

<style scoped lang="scss">
.comment-view {
  display: flex;
  gap: 16px;
}

.comment-content {
  flex: 1;
  font-size: 14px;
}

.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.username {
  font-weight: bold;
}

.create-time {
  color: #999;
  font-size: 0.875rem;
}

.comment-body {
  display: flex;
  align-items: flex-start;
  padding: 10px 0 0 0;
  width: 1048px;
  margin: 15px 0;
  border-radius: 10px;
}

.comment-actions {
  display: flex;
  gap: 8px;
}

.actions-row {
  display: flex;
  align-items: center;
  gap: 15px;
}

.delete-button {
  color: red;
}

.el-button {
  font-size: 14px;
}

/* 二级评论区域 */
.secondary-comment {
  margin-top: 15px;
  padding: 16px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.secondary-comment .action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.replies-section {
  margin-top: 20px;
}

.secondary-comment-item {
  display: flex;
  gap: 10px;
  margin-bottom: 12px;
}

.secondary-comment-item .secondary-comment-content {
  background-color: #f1f1f1;
  padding: 10px;
  border-radius: 6px;
  flex: 1;
}

.reply-username {
  margin-left: 5px;
  font-weight: bold;
  color: #333;
}

.reply-time {
  color: #999;
  font-size: 12px;
}
</style>

import { ref } from "vue";
import { GET_ID } from "@/utils/token";
import { UserData } from "@/api/user/type";
import { getUserVoByIdUsingGet } from "@/api/userController";
import { ElMessage } from "element-plus";

export const useUserInformation = () => {
  const user = ref<UserData>({
    id: 0,
    userName: "",
    userAccount: "",
    userAvatar: "",
    gender: 0,
    userRole: "",
    userPassword: "",
    accessKey: "",
    secretKey: "",
    invitationCode: "",
    email: "",
    balance: 0,
    createTime: "",
    updateTime: "",
    isDelete: 0,
    tokenValue: ""
  });

  const getUserInformationById = async () => {
    const id = GET_ID();
    if (id == null) {
      return ElMessage.info("获取用户信息失败");
    }
    const stringId = BigInt(id as string) as any;
    let result: any = await getUserVoByIdUsingGet({
      id: stringId
    });
    if (result.code == 200) {
      user.value = result.data;
    }
  };

  return { user, getUserInformationById };
};
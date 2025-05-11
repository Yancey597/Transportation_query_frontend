<template>
  <div class="login_container">
    <a href="https://yancey.vip" class="github-icon">
      <img
        src="https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        alt="GitHub"
        style="
          width: 32px;
          height: 32px;
          position: absolute;
          top: 2%;
          right: 4%;
        "
      />
    </a>
    <div class="loginin">
      <el-row>
        <el-col :span="0" :xs="0"></el-col>
        <el-col :span="24" :xs="24">
          <el-form
            class="login_form"
            :model="loginForm"
            :rules="rules"
            ref="loginForms"
          >
            <el-row>
              <h1
                style="
                  letter-spacing: 3px;
                  line-height: 54px;
                  font-weight: bold;
                "
              >
                登录到
              </h1>
            </el-row>
            <h1
              style="
                letter-spacing: 1px;
                line-height: 44px;
                font-weight: bold;
                margin-bottom: 0.7em;
              "
            >
              Routeseek 查询系统
            </h1>
            <span style="color: #8c939d">没有账号吗？</span>
            <span style="cursor: pointer; color: #366ef4" @click="register"
              >注册新账号</span
            >
            <el-form-item prop="userAccount">
              <t-input
                style="margin-top: 3em"
                v-model="loginForm.userAccount"
                clearable
                placeholder="请输入账户名"
              >
                <template #prefix-icon>
                  <desktop-icon />
                </template>
              </t-input>
            </el-form-item>
            <el-form-item prop="userPassword">
              <t-input
                v-model="loginForm.userPassword"
                type="password"
                clearable
                placeholder="请输入密码"
              >
                <template #prefix-icon>
                  <lock-on-icon />
                </template>
              </t-input>
            </el-form-item>

            <el-form-item>
              <t-button :loading="loading" theme="primary" block @click="login"
                >登录</t-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <el-row>
        <p class="login_footer">
          <a href="https://yancey.vip"
            >Copyright
            <i class="iconfont icon-banquan" style="font-size: 18px"></i>
            2021 - 2024 YanceyStudio | Never Settle.
          </a>
          <br />
          <a href="https://beian.miit.gov.cn/#/Integrated/index"
            >鄂ICP备2024050350号-1</a
          >
          |<a href="https://beian.mps.gov.cn/#/query/webSearch">
            <img
              src="../../assets/images/logoPolice.png"
              style="height: 16px; width: 16px; margin: 5px 0px 0px 5px"
            />
            鄂公网安备42011502001725号
          </a>
        </p>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Lock, User } from "@element-plus/icons-vue";
import { onMounted, reactive, ref } from "vue";
// 引入用户相关的小仓库
// import userUserStore from "@/store/modules/user";
// 引入路由
import { useRoute, useRouter } from "vue-router";
// 引入ElementUI-Plus
import { ElMessage, ElNotification } from "element-plus";
// 引入时间函数
import { getTime } from "@/utils/time";
import useUserStore from "@/store/modules/user";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import {
  DesktopIcon,
  LockOnIcon,
  ComponentCheckboxIcon,
  CloseCircleFilledIcon
} from "tdesign-icons-vue-next";
import { HeadMenuProps, NotifyPlugin, FormProps, Link } from "tdesign-vue-next";
//收集账号与密码的数据
let loginForm = reactive({
  // userAccount: "yupi",
  userAccount: "test",
  userPassword: "12345678"
});
// 获取loginForms组件
let loginForms = ref();
// 定义变量控制按钮加载效果
let loading = ref(false);
// 获取路由器
let $router = useRouter();
// 获取路由
let $route = useRoute();
let userStore = useUserStore();
// let userStore = userUserStore();
//登录按钮的回调
const login = async () => {
  await loginForms.value.validate(async (valid: any) => {
    if (!valid) {
      ElMessage({
        type: "error",
        message: "表单参数不合法",
        duration: 1000
      });
    } else {
      loading.value = true;
      try {
        await userStore.userLogin(loginForm);
        let redirect: any = $route.query.redirect;
        $router.push({ path: redirect || "/index" });
        NotifyPlugin.success({
          title: "欢迎回来",
          content: `Hi ${loginForm.userAccount},${getTime()}好`,
          duration: 1500
        });
      } catch (error) {
        NotifyPlugin.error({
          title: "输入有误",
          content: "用户名或密码错误, 请重新输入",
          duration: 1500
        });
      } finally {
        loading.value = false;
      }
    }
  });
};

onMounted(async () => {
  // console.log(1);
  // const res = await UserControllerService.userLoginUsingPost({
  //   userAccount: "yupi",
  //   userPassword: "12345678"
  // });
  // console.log(res);
});

// 注册按钮回调
const register = () => {
  $router.push("/register");
};
const validatorUserName = (_rule: any, value: any, callback: any) => {
  if (/^\w{4,15}$/.test(value)) {
    callback();
  } else {
    callback(new Error("账号长度应该在4位-15位之间"));
  }
};
const validatorPassword = (_rule: any, value: any, callback: any) => {
  if (/^\w{6,10}$/.test(value)) {
    callback();
  } else {
    callback(new Error("密码长度应该在6位-15位之间"));
  }
};
// 定义表单校验参数
const rules = {
  userAccount: [{ trigger: "change", validator: validatorUserName }],
  userPassword: [{ trigger: "change", validator: validatorPassword }]
};
</script>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;
  .loginin {
    width: 52%;
  }
  .login_form {
    position: relative;
    width: 40%;
    top: 25vh;
    //background: url("@/assets/images/login_form.png") no-repeat;
    //background-size: cover;
    //padding: 100px;
    margin-left: 11vh;

    h1 {
      color: #141414;
      font-size: 2.5em;
    }

    h2 {
      font-size: 1em;
      color: #141414;
      //margin-top: 2em;
      //margin-bottom: 3.5em;
    }

    .login_btn {
      width: 100%;
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .github-icon {
    position: absolute;
    top: 4%;
    right: 4%;
    z-index: 1000;
  }

  .login_footer {
    position: fixed;
    bottom: 50px;
    left: 17%;
    color: #8c939d;
    transform: translate(-50%, -50%);
  }
}
</style>

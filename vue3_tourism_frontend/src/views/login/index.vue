<template>
  <div class="login_container">
    <el-row>
      <el-col :span="12" :xs="0"></el-col>
      <el-col :span="12" :xs="24">
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="rules"
          ref="loginForms"
        >
          <el-row>
            <img src="../../assets/images/logo.png" style="width: 128px; height: 128px" />
            <h1 style="text-align: center; line-height: 128px">Hello</h1>
          </el-row>
          <h2>欢迎来到智能城市公交查询系统</h2>
          <el-form-item prop="userAccount">
            <el-input
              :prefix-icon="User"
              v-model="loginForm.userAccount"
              style="margin-left: -200px;"
            ></el-input>
          </el-form-item>
          <el-form-item prop="userPassword">
            <el-input
              type="password"
              :prefix-icon="Lock"
              v-model="loginForm.userPassword"
              show-password
              style="margin-left: -200px;"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              :loading="loading"
              type="primary"
              size="default"
              class="login_btn"
              @click="login"
              style="margin-left: -200px;"
              >登录
            </el-button>
            <el-button
              :loading="loading"
              type="success"
              size="default"
              class="login_btn"
              @click="register"
              style="margin-left: -200px;"
              >注册
            </el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
    <el-row>
      <p class="login_footer">
        <i class="iconfont icon-banquan" style="font-size: 18px"></i>
        <a href="https://yancey.vip">YanceyStudio </a> |
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
</template>
<style scoped lang="scss">
.login_container {
  width: 100%;
  height: 100vh;
  background: url("@/assets/images/background.jpg") no-repeat;
  background-size: cover;

  .login_form {
    position: relative;
    width: 80%;
    top: 30vh;
    background: url("@/assets/images/login_form.png") no-repeat;
    background-size: cover;
    padding: 40px;

    h1 {
      color: white;
      font-size: 40px;
    }

    h2 {
      font-size: 20px;
      color: white;
      margin: 20px 0px;
    }

    .el-form-item,
    .el-button {
      margin-left: -200px !important; // 新增样式，确保元素左移
    }
  }

  a {
    text-decoration: none;
    color: inherit;
  }

  .login_footer {
    position: fixed;
    bottom: 0px;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}

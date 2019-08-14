<template>
  <div class="login-container">
    <div class="login-container-inner">
      <div class="description">
        <div>贵州审计资源管理系统</div>
        <p>坚持科技强审，加强审计信息化建设</p>
        <p>强化上级审计机关对下级审计机关的领导</p>
        <p>要加强对内部审计工作的指导和监督</p>
        <p>调动内部审计和社会审计力量</p>
        <p>增强审计监督合力</p>
        <p>构建集中统一、全面覆盖、权威高效的审计监督体系</p>
      </div>
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

        <div class="title-container">
          <h3 class="title">用户登录</h3>
        </div>

        <el-form-item prop="account">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            ref="username"
            v-model="loginForm.account"
            placeholder="请输入账号"
            name="username"
            type="text"
            tabindex="1"
            autocomplete="on"
          />
        </el-form-item>

        <el-tooltip v-model="capsTooltip" content="大写已锁定" placement="right" manual>
          <el-form-item prop="password">
            <span class="svg-container">
              <svg-icon icon-class="password" />
            </span>
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            />
            <span class="show-pwd" @click="showPwd">
              <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
            </span>
          </el-form-item>
        </el-tooltip>

        <el-button :loading="loading" type="primary" class="login-btn" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
    <div class="login-footer">
      <div>技术支持电话：张橹 0851-86615878 袁烨 0851-86617397</div>
      <div>Copyright © 2019 All right reserved 版权所有 贵州省审计厅</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能少于6位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        account: '',
        password: ''
      },
      loginRules: {
        account: [{ required: true, trigger: 'blur', message: '请输入账号' }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.account === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (shiftKey && (key >= 'a' && key <= 'z') || !shiftKey && (key >= 'A' && key <= 'Z')) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background-color:#FFF;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #000;
      height: 47px;
      caret-color: #000;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: #000 !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #fff;
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background: url(../../assets/images/login-bg.png) no-repeat;
  background-size: 100% 100%;
  background-position: center;
  overflow: hidden;
  &-inner {
    background: rgba(255,255,255,0.3);
    position: absolute;
    top: 50%;
    width: 100%;
    display: flex;
    padding: 50px 0;
    min-height: 30vw;
    margin-top: -18vw;
    justify-content: space-between;

    .description {
      margin-left: 35px;
      div {
        color: #fbfdfe;
        font-size: 3vw;
        text-shadow: black 0.1em 0.1em 0.2em;
        font-weight: 500;
      }
      p {
        color: #063a87;
        font-size: 1.8vw;
        line-height: 0.6em;
        font-weight: 500;
      }
    }
  }

  .login-form {
    z-index: 1;
    opacity: 1.5;
    position: relative;
    min-width: 30vw;
    max-width: 40vw;
    padding: 0 35px;
    overflow: hidden;
    .login-btn {
      height: 2.5vw;
      background: #0d6dff;
      width: 100%;
      font-size: 16px;
      color: #fff;
      border: none;
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 1.8vw;
      color: #0d6dff;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }

  .login-footer {
    position: fixed;
    text-align: center;
    bottom: 20px;
    left: 0;
    right: 0;
    font-size: 14px;
    color: $dark_gray;
    div:first-child {
      margin-bottom: 5px;
    }
  }
}
</style>

<template>
  <div class="app-container">
    <el-card>
      <el-tabs v-model="activeTab">
        <el-tab-pane label="个人资料" name="my">
          <my />
        </el-tab-pane>
        <el-tab-pane label="修改密码" name="pwd">
          <modify-pwd />
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import My from './components/my'
import ModifyPwd from './components/modifyPwd'

export default {
  name: 'Profile',
  components: { My, ModifyPwd },
  data() {
    return {
      activeTab: 'my'
    }
  }
}
</script>

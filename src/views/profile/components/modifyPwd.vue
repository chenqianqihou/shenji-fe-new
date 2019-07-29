<template>
  <div>
    <el-form ref="pwdForm" :model="form" label-position="top" :rules="pwdFormRules">
      <el-form-item label="当前密码" prop="old">
        <el-input
          v-model="form.old"
          autocomplete="off"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item label="新密码" prop="new">
        <el-input
          v-model="form.new"
          autocomplete="off"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item label="重复密码" prop="renew">
        <el-input
          v-model="form.renew"
          autocomplete="off"
          show-password
          type="password"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="success" @click="onChangePassword">确认</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { changePwd } from '@/api/user'
export default {
  data() {
    const validateOldPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入当前密码'))
      } else {
        callback()
      }
    }
    const validateNewPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入新密码'))
      } else {
        if (this.form.renew !== '') {
          this.$refs.pwdForm.validateField('checkPassword')
        }
        callback()
      }
    }
    const validateCfmPass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入重复密码'))
      } else if (value !== this.form.new) {
        callback(new Error('两次密码输入不一致'))
      } else {
        callback()
      }
    }
    return {
      form: {
        old: '',
        new: '',
        renew: ''
      },
      pwdFormRules: {
        old: [
          { validator: validateOldPass, trigger: 'blur' }
        ],
        new: [
          { validator: validateNewPass, trigger: 'blur' }
        ],
        renew: [
          { validator: validateCfmPass, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    onChangePassword() {
      const params = {
        old: this.form.old,
        new: this.form.new
      }
      this.$refs['pwdForm'].validate((valid) => {
        if (valid) {
          changePwd(params).then(async res => {
            this.$message.success('修改成功')
            await this.$store.dispatch('user/logout')
            this.$router.push(`/login?redirect=/`)
          })
        }
      })
    }
  }
}
</script>

<style>

</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ isEdit ? '编辑' : '新建' }}项目</span>
    </div>
    <el-form ref="projectForm" :model="form" status-icon label-position="right" label-width="120px">
      <el-form-item label="项目名称" prop="name" :rules="[{
        required: true,
        message: '请输入项目名称'
      }]">
        <el-input v-model="form.name" class="sub-width"></el-input>
      </el-form-item>
      <el-form-item label="项目时长" prop="plantime" :rules="[{
        required: true,
        message: '请输入项目时长'
      }]">
        <el-input v-model="form.plantime" type="number" class="sub-width">
          <span slot="append">天</span>
        </el-input>
      </el-form-item>
      <el-form-item label="项目年度" prop="projyear" :rules="[{
        required: true,
        message: '请选择项目年度'
      }]">
        <el-date-picker
          v-model="form.projyear"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
          class="sub-width">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="项目描述" prop="projdesc" :rules="[{
        required: true,
        message: '请输入项目描述'
      }]">
        <el-input type="textarea" v-model="form.projdesc" :rows="4"  class="sub-width"></el-input>
      </el-form-item>
      <el-form-item label="项目单位" prop="projorgan" :rules="[{
        required: true,
        message: '请选择项目单位'
      }]">
        <el-select v-model="form.projorgan" placeholder="请选择" class="sub-width" @change="handleChangeOrg">
          <el-option v-for="(item, idx) in selectList.organlist" :key="idx" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="牵头业务部门" prop="leadorgan" :rules="[{
        required: true,
        message: '请选择牵头业务部门'
      }]">
        <el-select v-model="form.leadorgan" placeholder="请选择" class="sub-width">
          <el-option v-for="(item, idx) in selectList.subOrgList" :key="idx" :value="item.id" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="项目类型" prop="type" :rules="[{
        required: true,
        message: '请选择项目类型'
      }]">
        <el-select v-model="form.type" placeholder="请选择" class="sub-width"  @change="handleChangeType">
          <el-option v-for="(item, idx) in selectList.type" :key="idx" :value="item.name" :label="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="subType" :rules="[{
        required: true,
        message: '请选择项目子类'
      }]">
        <el-select v-model="form.subType" placeholder="请选择" class="sub-width">
          <el-option v-for="(item, idx) in selectList.subTypeList" :key="idx" :value="item" :label="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="projlevel" label="项目层级" :rules="[{
        required: true,
        message: '请选择项目层级'
      }]">
        <el-select v-model="form.projlevel" placeholder="请选择" class="sub-width">
          <el-option v-for="(item, idx) in selectConfig.projlevel" :key="idx" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <div style="display: flex">
        <div class="sub-label">角色</div>
        <div>
          <el-form-item label="审计组长" prop="leadernum" :rules="[{
            required: true,
            message: '请输入审计组长人数'
          }]" label-width="80px">
            <el-input-number v-model="form.leadernum" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="主审" prop="masternum" :rules="[{
            required: true,
            message: '请输入主审人数'
          }]" label-width="80px">
            <el-input-number v-model="form.masternum" :min="0"></el-input-number>
          </el-form-item>
          <el-form-item label="审计成员" prop="auditornum" :rules="[{
            required: true,
            message: '请输入审计成员人数'
          }]" label-width="80px">
            <el-input-number v-model="form.auditornum" :min="0"></el-input-number>
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="$router.push('/project')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { selectConfig, selectList, createProject, getProjectDetail, updateProject } from '@/api/project'

export default {
  name: 'AddEdit',
  data() {
    return {
      form: {
        leadorgan: '',
        subType: ''
      },
      selectConfig: {},
      selectList: {}
    }
  },
  computed: {
    isEdit() {
      return this.$route.params.id
    }
  },
  created() {
    this.getSelectConfig()
    this.getSelectList()
  },
  methods: {
    queryDetail() {
      getProjectDetail({
        id: this.$route.params.id
      }).then(res => {
        Object.keys(res.data).forEach(key => {
          if (key === 'projtype') {
            let item = JSON.parse(res.data['projtype'])
            res.data.type = item[0]
            res.data.subType = item[1] || ''
          } else if (!isNaN(+res.data[key])) {
            res.data[key] = +res.data[key]
          }
        })
        this.form = res.data
        this.handleChangeOrg()
        this.handleChangeType()
      })
    },
    getSelectConfig() {
      selectConfig().then(res => {
        const keys = Object.keys(res.data)
        const values = Object.values(res.data)
        values.forEach((row, idx) => {
          this.selectConfig[keys[idx]] = []
          row.forEach(r => {
            let item
            if (typeof r === 'object') {
              item = {
                value: +Object.keys(r)[0],
                label: Object.values(r)[0]
              }
            } else {
              item = r
            }
            this.selectConfig[keys[idx]].push(item)
          })
        })
      })
    },
    getSelectList() {
      selectList().then(res => {
        this.selectList = res.data
        this.selectList.subOrgList = []
        this.selectList.subTypeList = []
        if (this.isEdit) {
          this.queryDetail()
        }
      })
    },
    handleChangeOrg() {
      if (!this.isEdit) {
        this.form.leadorgan = ''
      }
      const { form: { projorgan}} = this
      if (this.selectList.organlist) {
        const item = this.selectList.organlist.find(row => row.id === projorgan)
        this.selectList.subOrgList = []
        item.partment.forEach(item => {
          this.selectList.subOrgList.push({
            id: +Object.keys(item)[0],
            name: Object.values(item)[0]
          })
        })
      }
    },
    handleChangeType() {
      const { form: { type, id}} = this
      if (this.selectList.type) {
        const item = this.selectList.type.find(row => row.name === type)
        this.selectList.subTypeList = item.list || []
        if (!id) {
          this.form.subType = ''
        }
      }
    },
    handleSubmit() {
      this.$refs['projectForm'].validate(valid => {
        if (valid) {
          let params = Object.assign({}, this.form)
          let optMethod = createProject
          if (this.isEdit) {
            optMethod = updateProject
            delete params.ctime
            delete params.utime
            delete params.status
            delete params.projauditcontent
            delete params.projectnum
            delete params.projstart
          }
          params.projtype = [this.form.type, this.form.subType]
          delete params.type
          delete params.subType
          optMethod(params).then(res => {
            this.$message.success(`${this.isEdit ? '编辑' : '新建'}成功`)
            this.$router.push('/project')
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  .form-set-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .cascader{
    margin-bottom: 20px;
  }
  .sub-width {
    width: 70%;
  }
  .sub-label{
    width: 120px;
    text-align: right;
    vertical-align: middle;
    float: left;
    font-size: 14px;
    color: #606266;
    line-height: 40px;
    padding: 0 12px 0 0;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    line-height: 36px;
    font-weight: 700;
  }
}
</style>

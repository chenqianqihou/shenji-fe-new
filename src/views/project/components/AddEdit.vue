<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ formId ? '编辑' : '新建' }}项目</span>
    </div>
    <el-form ref="projectForm" :model="form" status-icon label-position="right" label-width="120px">
      <el-form-item
        label="项目名称"
        prop="name"
        :rules="[{
          required: true,
          message: '请输入项目名称'
        }]"
      >
        <el-input v-model="form.name" class="sub-width" />
      </el-form-item>
      <el-form-item
        label="项目时长"
        prop="plantime"
        :rules="[{
          required: true,
          message: '请输入项目时长'
        }]"
      >
        <el-input v-model="form.plantime" type="number" class="sub-width">
          <span slot="append">天</span>
        </el-input>
      </el-form-item>
      <el-form-item
        label="项目年度"
        prop="projyear"
        :rules="[{
          required: true,
          message: '请选择项目年度'
        }]"
      >
        <el-date-picker
          v-model="form.projyear"
          type="year"
          placeholder="选择年"
          value-format="yyyy"
          class="sub-width"
        />
      </el-form-item>
      <el-form-item
        label="项目描述"
        prop="projdesc"
        :rules="[{
          required: true,
          message: '请输入项目描述'
        }]"
      >
        <el-input v-model="form.projdesc" type="textarea" :rows="4" class="sub-width" />
      </el-form-item>
      <el-form-item
        prop="projlevel"
        label="项目层级"
        :rules="[{
          required: true,
          message: '请选择项目层级'
        }]"
      >
        <el-select v-model="form.projlevel" placeholder="请选择" class="sub-width" @change="handleGetOrg">
          <el-option v-for="(item, idx) in selectConfig.projlevel" :key="idx" :value="item.value" :label="item.label" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="项目实施地"
        prop="location"
        :rules="[{
          required: true,
          message: '请选择项目实施地'
        }]"
      >
        <el-cascader
          v-model="form.location"
          :props="{ checkStrictly: true }"
          class="sub-width"
          :options="districts"
          @change="handleGetOrg"
        />
      </el-form-item>
      <el-form-item
        label="项目单位"
        prop="projorgan"
        :rules="[{
          required: true,
          message: '请选择项目单位'
        }]"
      >
        <el-select v-model="form.projorgan" placeholder="请选择" class="sub-width" @change="handleChangeOrg">
          <el-option v-for="(item, idx) in orgList" :key="idx" :value="item.value" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="牵头业务部门"
        prop="leadorgan"
        :rules="[{
          required: true,
          message: '请选择牵头业务部门'
        }]"
      >
        <el-select v-model="form.leadorgan" placeholder="请选择" class="sub-width">
          <el-option v-for="(item, idx) in selectList.subOrgList" :key="idx" :value="item.id" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item
        label="项目类型"
        prop="type"
        :rules="[{
          required: true,
          message: '请选择项目类型'
        }]"
      >
        <el-select v-model="form.type" placeholder="请选择" class="sub-width" @change="handleChangeType">
          <el-option v-for="(item, idx) in selectList.type" :key="idx" :value="item.name" :label="item.name" />
        </el-select>
      </el-form-item>
      <el-form-item
        prop="subType"
        :rules="[{
          required: true,
          message: '请选择项目子类'
        }]"
      >
        <el-select v-model="form.subType" placeholder="请选择" class="sub-width">
          <el-option v-for="(item, idx) in selectList.subTypeList" :key="idx" :value="item" :label="item" />
        </el-select>
      </el-form-item>
      <div style="display: flex">
        <div class="sub-label">角色</div>
        <div>
          <el-form-item
            label="审计组长"
            prop="leadernum"
            :rules="[{
              required: true,
              message: '请输入审计组长人数'
            }]"
            label-width="150px"
          >
            <el-input-number v-model="form.leadernum" :min="0" :disabled="!!formId" />
          </el-form-item>
          <el-form-item
            label="项目类型"
            prop="leader_projtype1"
            label-width="150px"
          >
            <el-select v-model="form.leader_projtype1" placeholder="请选择" @change="handleChangeLeaderType">
              <el-option v-for="(item, idx) in selectList.type" :key="idx" :value="item.name" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="leader_projtype_sub"
            label-width="150px"
          >
            <el-select v-model="form.leader_projtype_sub" placeholder="请选择" @change="handleFindTimes(1)">
              <el-option v-for="(item, idx) in selectList.subLeaderTypeList" :key="idx" :value="item" :label="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="组长次数" prop="leader_filternum" label-width="150px">
            <el-input-number v-model="form.leader_filternum" :min="0" :disabled="!!formId" @change="handleFindTimes(1)" />
          </el-form-item>
          <el-form-item label="所选条件审计人员数" label-width="150px">
            {{ leaderNum }}
          </el-form-item>
          <el-form-item
            label="主审"
            prop="masternum"
            :rules="[{
              required: true,
              message: '请输入主审人数'
            }]"
            label-width="150px"
          >
            <el-input-number v-model="form.masternum" :min="0" :disabled="!!formId" />
          </el-form-item>
          <el-form-item
            label="项目类型"
            prop="master_projtype1"
            label-width="150px"
          >
            <el-select v-model="form.master_projtype1" placeholder="请选择" @change="handleChangeMasterType">
              <el-option v-for="(item, idx) in selectList.type" :key="idx" :value="item.name" :label="item.name" />
            </el-select>
          </el-form-item>
          <el-form-item
            prop="master_projtype_sub"
            label-width="150px"
          >
            <el-select v-model="form.master_projtype_sub" placeholder="请选择" @change="handleFindTimes(2)">
              <el-option v-for="(item, idx) in selectList.subMasterTypeList" :key="idx" :value="item" :label="item" />
            </el-select>
          </el-form-item>
          <el-form-item label="主审次数" prop="master_filternum" label-width="150px">
            <el-input-number v-model="form.master_filternum" :min="0" :disabled="!!formId" @change="handleFindTimes(2)" />
          </el-form-item>
          <el-form-item label="所选条件审计人员数" label-width="150px">
            {{ masterNum }}
          </el-form-item>
          <el-form-item
            label="审计成员"
            prop="auditornum"
            :rules="[{
              required: true,
              message: '请输入审计成员人数'
            }]"
            label-width="150px"
          >
            <el-input-number v-model="form.auditornum" :min="0" :disabled="!!formId" />
          </el-form-item>
        </div>
      </div>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="formId ? $router.push(`/project/detail/${formId}`) : $router.push(`/project/index`)">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { selectConfig, selectList, createProject, getProjectDetail, updateProject, getProjectTypeNum, getLocationOrg } from '@/api/project'
import { regionData } from 'element-china-area-data'
export default {
  name: 'AddEdit',
  data() {
    return {
      form: {
        leadorgan: '',
        projorgan: '',
        subType: '',
        leader_projtype_sub: '',
        master_projtype_sub: ''
      },
      selectConfig: {},
      selectList: {},
      leaderNum: 0,
      masterNum: 0,
      orgList: []
    }
  },
  computed: {
    formId() {
      return this.$route.params.id
    },
    districts() {
      return regionData.filter(row => +row.value === 520000)
    }
  },
  created() {
    this.getSelectConfig()
    this.getSelectList()
  },
  methods: {
    async handleGetOrg() {
      const { form: { projlevel, location }} = this
      if (projlevel && location) {
        const params = {
          projlevel,
          location: location.join()
        }
        const res = await getLocationOrg(params)
        this.orgList = res.data.map(row => {
          return {
            value: +Object.keys(row)[0],
            name: Object.values(row)[0]
          }
        })
      }
    },
    queryDetail() {
      getProjectDetail({
        id: this.formId
      }).then(res => {
        Object.keys(res.data).forEach(key => {
          if (key === 'projtype') {
            const item = JSON.parse(res.data['projtype'])
            res.data.type = item[0]
            res.data.subType = item[1] || ''
          } else if (key === 'projyear') {
            res.data.projyear = new Date(res.data.projyear)
          } else if (!isNaN(+res.data[key])) {
            res.data[key] = +res.data[key]
          }
        })
        this.form = Object.assign({}, res.data)
        if (this.form.location) {
          this.form.location = res.data.location.split(',')
        }
        if (this.form.projorgan) {
          this.$set(this.form, 'projorgan', +res.data.projorgan)
        }
        if (this.form.leadorgan) {
          this.$set(this.form, 'leadorgan', +res.data.leadorgan)
        }
        this.handleGetOrg()
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
        this.selectList.subLeaderTypeList = []
        this.selectList.subMasterTypeList = []
        if (this.formId) {
          this.queryDetail()
        }
      })
    },
    handleChangeOrg() {
      if (!this.formId) {
        this.form.leadorgan = ''
      }
      const { form: { projorgan }, selectList: { organlist }} = this
      if (organlist) {
        const findItem = organlist.find(row => row.id === +projorgan)
        this.selectList.subOrgList = []
        if (findItem) {
          this.selectList.subOrgList = findItem.partment.map(item => {
            return {
              id: +Object.keys(item)[0],
              name: Object.values(item)[0]
            }
          })
        }
      }
      console.log(this.selectList.subOrgList)
    },
    handleChangeType() {
      const { form: { type, id }} = this
      if (this.selectList.type) {
        const item = this.selectList.type.find(row => row.name === type)
        this.selectList.subTypeList = item.list || []
        if (!id) {
          this.form.subType = ''
        }
      }
    },
    handleChangeLeaderType() {
      const { form: { leader_projtype1, id }} = this
      if (this.selectList.type) {
        const item = this.selectList.type.find(row => row.name === leader_projtype1)
        this.selectList.subLeaderTypeList = item.list || []
        if (!id) {
          this.form.leader_projtype_sub = ''
        }
      }
    },
    handleChangeMasterType() {
      const { form: { master_projtype1, id }} = this
      if (this.selectList.type) {
        const item = this.selectList.type.find(row => row.name === master_projtype1)
        this.selectList.subMasterTypeList = item.list || []
        if (!id) {
          this.form.master_projtype_sub = ''
        }
      }
    },
    handleSubmit() {
      this.$refs['projectForm'].validate(valid => {
        if (valid) {
          const params = Object.assign({}, this.form)
          let optMethod = createProject
          if (this.formId) {
            optMethod = updateProject
            delete params.ctime
            delete params.utime
            delete params.status
            delete params.projauditcontent
            delete params.projectnum
            delete params.projstart
          }
          params.location = params.location.join()
          params.projtype = [this.form.type, this.form.subType]
          params.master_projtype = [this.form.master_projtype1, this.form.master_projtype_sub]
          params.leader_projtype = [this.form.leader_projtype1, this.form.leader_projtype_sub]
          delete params.type
          delete params.subType
          delete params.leader_projtype1
          delete params.leader_projtype_sub
          delete params.master_projtype1
          delete params.master_projtype_sub
          optMethod(params).then(res => {
            this.$message.success(`${this.formId ? '编辑' : '新建'}成功`)
            this.$router.push('/project')
          })
        }
      })
    },
    handleFindTimes(type) {
      const {
        form: {
          leader_projtype1,
          leader_projtype_sub,
          leader_filternum,
          master_projtype1,
          master_projtype_sub,
          master_filternum
        }
      } = this
      const params = {
        type: type
      }
      let willOption = false
      if (type === 1) {
        params.projtype = [leader_projtype1, leader_projtype_sub]
        params.filterNum = leader_filternum
        if (leader_projtype_sub && leader_filternum) {
          willOption = true
        }
      } else {
        params.projtype = [master_projtype1, master_projtype_sub]
        params.filterNum = master_filternum
        if (master_projtype_sub && master_filternum) {
          willOption = true
        }
      }
      if (willOption) {
        getProjectTypeNum(params).then(res => {
          if (type === 1) {
            this.leaderNum = res.data
          }
          if (type === 2) {
            this.masterNum = res.data
          }
        })
      }
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

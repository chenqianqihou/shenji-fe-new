<template>
  <el-card
    :class="[
      'result-addedit',
      {
        'result-addedit-readonly': readonly
      }
    ]"
  >
    <div slot="header" class="clearfix">
      <span>{{ readonly ? '查看' : (resultId ? '编辑' : '新建') }}审计成果</span>
    </div>
    <div class="result-addedit-content" v-loading="loading">
      <el-form label-position="right" label-width="auto">
        <h4>基本信息</h4>
        <el-divider />
        <el-form-item label="人员ID">
          {{ userinfo.pid }}
        </el-form-item>
        <el-form-item label="姓名">
          {{ userinfo.name }}
        </el-form-item>
        <el-form-item label="项目名称">
          <el-select
            v-model="form.projectid"
            filterable
            :disabled="readonly"
            placeholder=""
            @change="handleChangeProject"
          >
            <el-option v-for="item in projectList" :key="item.id" :value="item.id" :label="item.name" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="project.projectnum" readonly :disabled="readonly" />
        </el-form-item>
        <el-form-item label="项目年度">
          <el-input v-model="project.projyear" readonly :disabled="readonly" />
        </el-form-item>
        <el-form-item label="项目层级">
          <el-input :value="project.projlevel && originConfig.projlevel ? originConfig.projlevel[+project.projlevel] : ''" readonly :disabled="readonly" />
        </el-form-item>
        <el-form-item label="项目类型">
          <el-input :value="project.projtype ? project.projTypeName : ''" readonly :disabled="readonly" />
        </el-form-item>
        <el-form-item label="项目角色">
          <el-input :value="projConfig.roleMap[+project.roletype]" readonly :disabled="readonly" />
        </el-form-item>
        <el-form-item label="报告撰写">
          <span v-if="readonly">{{ radioMap[+form.havereport] || '-' }}</span>
          <el-radio-group v-else v-model="form.havereport">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="承担项目综合协调工作">
          <span v-if="readonly">{{ radioMap[+form.havecoordinate] || '-' }}</span>
          <el-radio-group v-else v-model="form.havecoordinate">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="承担项目数据分析工作">
          <span v-if="readonly">{{ radioMap[+form.haveanalyse] || '-' }}</span>
          <el-radio-group v-else v-model="form.haveanalyse">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <h4>审计成果</h4>
        <el-divider />
        <el-form-item label="查出问题性质">
          <el-select v-model="form.problemid" :disabled="readonly">
            <el-option v-for="item in question1List" :key="item.id" :label="item.name" :value="+item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="form.desc" :disabled="readonly" v-if="readonly" />
          <el-input v-model="form.desc" type="textarea" :rows="4" v-else maxlength="300" show-word-limit />
        </el-form-item>
        <el-form-item label="处理金额">
          <span v-if="readonly">{{ form.amountone }}元</span>
          <el-input v-model="form.amountone" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计期间整改金额">
          <span v-if="readonly">{{ form.amounttwo }}元</span>
          <el-input v-model="form.amounttwo" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计促进整改落实有关问题资金">
          <span v-if="readonly">{{ form.amountthree }}元</span>
          <el-input v-model="form.amountthree" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计促进整改有关问题资金金额">
          <span v-if="readonly">{{ form.amountfour }}元</span>
          <el-input v-model="form.amountfour" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计促进拨付资金到位">
          <span v-if="readonly">{{ form.amountfive }}元</span>
          <el-input v-model="form.amountfive" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计后挽回（避免损失）金额">
          <span v-if="readonly">{{ form.amountsix }}元</span>
          <el-input v-model="form.amountsix" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="是否单独查出">
          <span v-if="readonly">{{ radioMap[+form.isfindout] || '-' }}</span>
          <el-radio-group v-else v-model="form.isfindout">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="查出人数">
          <el-input v-model="form.findoutnum" :disabled="readonly" />
        </el-form-item>
        <h4>移送处理情况</h4>
        <el-divider />
        <el-form-item label="是否有移送事项">
          <span v-if="readonly">{{ radioMap[+form.istransfer] || '-' }}</span>
          <el-radio-group v-else v-model="form.istransfer">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="移送处理机关">
          <span v-if="readonly">{{ +form.processorgans ? config.tsOrgMap[+form.processorgans] : '' }}</span>
          <el-select v-model="form.processorgans" v-else>
            <el-option v-for="(key, item) in config.tsOrgMap" :key="item" :label="key" :value="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="移送处理金额">
          <span v-if="readonly">{{ form.transferamount }}元</span>
          <el-input v-model="form.transferamount" :disabled="readonly" v-else><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="送处理人员情况">
          <template v-for="(key, item) in config.tsPeopleMap">
            <div :key="item" class="people-area">
              <span class="people-label">{{ key }}</span>
              <span v-if="readonly">{{transferpeople[item] || 0 }}人</span>
              <el-input v-model="transferpeople[item]" v-else><template slot="suffix">人</template></el-input>
            </div>
          </template>
        </el-form-item>
        <el-form-item label="移送处理结果">
          <el-input v-model="form.transferresult" :disabled="readonly" v-if="readonly" />
          <el-input v-model="form.transferresult" type="textarea" :rows="4" v-else maxlength="300" show-word-limit />
        </el-form-item>
        <h4>综合成果</h4>
        <el-divider />
        <el-form-item label="是否纳入本级工作报告">
          <span v-if="readonly">{{ radioMap[+form.bringintoone] || '-' }}</span>
          <el-radio-group v-else v-model="form.bringintoone">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否纳入上级审计工作报告">
          <span v-if="readonly">{{ radioMap[+form.bringintoone] || '-' }}</span>
          <el-radio-group v-else v-model="form.bringintotwo">
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评优">
          <span v-if="readonly">{{ +form.appraisal ? config.evaluationMap[form.appraisal] : '' }}</span>
          <el-select v-model="form.appraisal" v-else>
            <el-option v-for="(key, val) in config.evaluationMap" :key="val" :label="key" :value="val" />
          </el-select>
        </el-form-item>
      </el-form>
      <div v-if="!readonly" class="result-addedit-footer">
        <el-button @click="handleSave">保存</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>
  </el-card>
</template>

<script>
import { submitResult, saveResult, projectList, getDetail } from '@/api/result'
import { getInfo } from '@/api/user'
import { fetchViolations } from '@/api/assess'
import { selectConfig } from '@/api/project'
import * as config from '../config'
import * as projConfig from '@/views/project/config'
export default {
  props: {
    resultId: Number,
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      userinfo: {},
      project: {
        id: '',
        projectnum: '',
        projtype: '',
        projyear: '',
        projectnum: '',
        roletype: ''
      },
      form: {
        havereport: 0,
        isfindout: 0,
        istransfer: 0,
        bringintoone: 0,
        bringintotwo: 0,
        havecoordinate: 0,
        haveanalyse: 0,
        transferpeople: {}
      },
      transferpeople: {},
      radioMap: {
        1: '是',
        2: '否'
      },
      config,
      projConfig,
      projectList: [],
      originConfig: {},
      violations: [],
      question1List: [],
      question2List: [],
      loading: false
    }
  },
  created() {
    if (this.resultId) {
      this.loading = true
      Promise.all([
        this.queryProjectList(),
        this.getSelectConfig(),
        this.fetchViolations()
      ]).then(() => {
        this.queryDetail()
      })
    } else {
      this.getUserinfo()
      this.queryProjectList()
      this.getSelectConfig()
      this.fetchViolations()
    }
  },
  methods: {
    getUserinfo() {
      getInfo().then(res => {
        this.userinfo = res.data
      })
    },
    queryDetail() {
      getDetail({
        id: this.resultId
      }).then(res => {
        const { data } = res
        this.userinfo = data.people_msg
        this.form = Object.assign({}, data, {
          problemid: +data.problemid,
          problemdetailid: +data.problemdetailid
        })
        Object.keys(config.tsPeopleMap).forEach(key => {
          if (data.transferpeople[config.tsPeopleMap[key]]) {
            this.transferpeople[key] = data.transferpeople[config.tsPeopleMap[key]]
          }
        })
        if (!this.form.transferpeople) {
          this.form.transferpeople = {}
        }
        this.handleChangeProject(data.projectid)
        // this.handleChangeQuestion1(data.problemid)
        this.loading = false
      })
    },
    async queryProjectList() {
      const res = await projectList()
      res.data.forEach(row => {
        const find = this.projectList.find(item => item.id && +item.id === +row.id)
        if (!find) {
          this.projectList.push(row)
        }
      })
    },
    handleChangeProject(val) {
      if (val) {
        const { violations } = this
        const current = this.projectList.find(row => +row.id === +val)
        const projtype = current ? JSON.parse(current.projtype) : []
        this.project = Object.assign({}, current, {
          id: val,
          projTypeName: projtype.join('/')
        })
        violations.forEach(row => {
          if (row.name === projtype[0]) {
            row.list.forEach(row1 => {
              if (row1.name === projtype[1]) {
                this.question1List = row1.list || []
              }
            })
          }
        })
      } else {
        this.project = {}
      }
    },
    handleChangeQuestion1(val) {
      if (val) {
        const { question1List } = this
        const current = question1List.find(row => +row.id === +val)
        this.question2List = current ? current.list : []
      }
    },
    async fetchViolations() {
      const res = await fetchViolations()
      this.violations = res.data
    },
    async getSelectConfig() {
      const res = await selectConfig()
      const keys = Object.keys(res.data)
      const values = Object.values(res.data)
      values.forEach((row, idx) => {
        this.originConfig[keys[idx]] = {}
        row.forEach(r => {
          if (typeof r === 'object') {
            this.originConfig[keys[idx]][Object.keys(r)[0]] = Object.values(r)[0]
          }
        })
      })
    },
    handleSave() {
      const { transferpeople } = this
      const params = Object.assign({}, this.form)
      console.log(this.form)
      Object.keys(config.tsPeopleMap).forEach(key => {
        if (transferpeople[key]) {
          params.transferpeople[config.tsPeopleMap[key]] = transferpeople[key]
        } else {
          delete params.transferpeople[config.tsPeopleMap[key]]
        }
      })
      saveResult(params).then(res => {
        this.$message.success('保存成功')
        this.$router.push('/result')
      })
    },
    handleSubmit() {
      const { transferpeople } = this
      const params = Object.assign({}, this.form)
      Object.keys(config.tsPeopleMap).forEach(key => {
        if (transferpeople[key]) {
          params.transferpeople[config.tsPeopleMap[key]] = transferpeople[key]
        } else {
          delete params.transferpeople[config.tsPeopleMap[key]]
        }
      })
      submitResult(params).then(res => {
        this.$message.success('提交成功')
        this.$router.push('/result')
      })
    }
  }
}
</script>

<style lang="scss">
.result-addedit {
  height: 100%;
  margin: 20px;
  .el-input, .el-select{
    width: 400px;
  }
  &-footer {
    margin-top: 20px;
    text-align: center;
  }
  &-readonly {
    .el-input, .el-select, .el-select .el-input.is-disabled {
      .el-input__inner {
        border: none !important;
        background-color: #ffffff;
        color: #303133;
        padding-left: 0;
        cursor: default;
      }
      .el-input__suffix {
        display: none;
      }
    }
  }
  .people-area{
    margin-bottom: 10px;
    .people-label {
      width: 100px;
      display: inline-block;
    }
  }
}
</style>

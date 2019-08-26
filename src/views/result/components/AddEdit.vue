<template>
  <el-card :class="[
    'result-addedit',
    {
      'result-addedit-readonly': readonly
    }
  ]">
    <div slot="header" class="clearfix">
      <span>{{ resultId ? '编辑' : '新建' }}审计成果</span>
    </div>
    <div class="result-addedit-content">
      <el-form label-position="right" label-width="auto">
        <h4>基本信息</h4>
        <el-divider></el-divider>
        <el-form-item label="人员ID">
          {{ userinfo.pid }}
        </el-form-item>
        <el-form-item label="姓名">
          {{ userinfo.name }}
        </el-form-item>
        <el-form-item label="项目名称">
          <el-select
            filterable
            v-model="form.projectid"
            @change="handleChangeProject"
            :disabled="readonly"
          >
          <el-option v-for="item in projectList" :key="item.id" :value="item.id" :label="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目编号">
          <el-input v-model="project.projectnum" readonly :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="项目年度">
          <el-input v-model="project.projyear" readonly :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="项目层级">
          <el-input :value="project.projlevel && originConfig.projlevel ? originConfig.projlevel[+project.projlevel] : ''" readonly :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="项目类型">
          <el-input :value="project.projtype ? project.projTypeName : ''" readonly :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="项目角色">
          <el-input :value="projConfig.roleMap[+project.roletype]" readonly :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="报告撰写">
          <span v-if="readonly">{{ radioMap[+form.havereport] || '-' }}</span>
          <el-radio-group v-model="form.havereport" v-else>
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <h4>审计成果</h4>
        <el-divider></el-divider>
        <el-form-item label="查出问题性质">
          <el-select v-model="form.problemid" @change="handleChangeQuestion1" :disabled="readonly">
            <el-option v-for="item in question1List" :key="item.id" :label="item.name" :value="+item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查出问题明细">
          <el-select v-model="form.problemdetailid" :disabled="readonly">
            <el-option v-for="item in question2List" :key="item.id" :label="item.name" :value="+item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="处理金额">
          <el-input v-model="form.amountone" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计期间整改金额">
          <el-input v-model="form.amounttwo" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计促进整改落实有关问题资金">
          <el-input v-model="form.amountthree" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计促进整改有关问题资金金额">
          <el-input v-model="form.amountfour" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计促进拨付资金到位">
          <el-input v-model="form.amountfive" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="审计后挽回（避免损失）金额">
          <el-input v-model="form.amountsix" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="问题描述">
          <el-input v-model="form.desc" :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="是否单独查出">
          <span v-if="readonly">{{ radioMap[+form.isfindout] || '-' }}</span>
          <el-radio-group v-model="form.isfindout" v-else>
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="查出人数">
          <el-input v-model="form.findoutnum" :disabled="readonly"></el-input>
        </el-form-item>
        <h4>移送处理情况</h4>
        <el-divider></el-divider>
        <el-form-item label="是否有移送事项">
          <span v-if="readonly">{{ radioMap[+form.istransfer] || '-' }}</span>
          <el-radio-group v-model="form.istransfer" v-else>
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="移送处理机关">
          <el-select v-model="form.processorgans" :disabled="readonly">
            <el-option v-for="(key, item) in config.tsOrgMap" :key="item" :label="key" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="移送处理金额">
          <el-input v-model="form.transferamount" :disabled="readonly"><template slot="suffix">元</template></el-input>
        </el-form-item>
        <el-form-item label="移送人数">
          <el-input v-model="form.transferpeoplenum" :disabled="readonly"></el-input>
        </el-form-item>
        <el-form-item label="送处理人员情况">
          <el-select v-model="form.transferpeopletype" :disabled="readonly">
            <el-option v-for="(key, item) in config.tsPeopleMap" :key="item" :label="key" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="移送处理结果">
          <el-input v-model="form.transferresult" :disabled="readonly"></el-input>
        </el-form-item>
        <h4>综合成果</h4>
        <el-divider></el-divider>
        <el-form-item label="是否纳入本级工作报告">
          <span v-if="readonly">{{ radioMap[+form.bringintoone] || '-' }}</span>
          <el-radio-group v-model="form.bringintoone" v-else>
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否纳入上级审计工作报告">
          <span v-if="readonly">{{ radioMap[+form.bringintoone] || '-' }}</span>
          <el-radio-group v-model="form.bringintotwo" v-else>
            <el-radio label="1">是</el-radio>
            <el-radio label="2">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="评优">
          <el-select v-model="form.appraisal" :disabled="readonly">
            <el-option v-for="(key, val) in config.evaluationMap" :label="key" :value="val" :key="val"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div class="result-addedit-footer" v-if="!readonly">
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
        bringintotwo: 0
      },
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
      question2List: []
    }
  },
  created() {
    if (this.resultId) {
      Promise.all([
        this.queryProjectList(),
        this.getSelectConfig(),
        this.fetchViolations(),
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
        this.handleChangeProject(data.projectid)
        this.handleChangeQuestion1(data.problemid)
      })
    },
    async queryProjectList() {
      const res = await projectList()
      res.data.forEach(row => {
        let find = this.projectList.find(item => item.id && +item.id === +row.id)
        if (!find) {
          this.projectList.push(row)
        }
      })
    },
    handleChangeProject(val) {
      if (val) {
        const { violations } = this
        const current = this.projectList.find(row => +row.id === +val)
        const projtype = JSON.parse(current.projtype)
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
        this.question2List = current.list || []
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
      const params = Object.assign({}, this.form)
      saveResult(params).then(res => {
        this.$message.success('保存成功')
        this.$router.push('/result')
      })
    },
    handleSubmit() {
      const params = Object.assign({}, this.form)
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
    .el-input, .el-select {
      .el-input__inner {
        border: none !important;
        background-color: inherit;
        color: #303133;
        padding-left: 0;
        cursor: default;
      }
      .el-input__suffix {
        display: none;
      }
    }
  }
}
</style>
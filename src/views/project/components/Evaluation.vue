<template>
  <div class="assess-container">
    <div v-if="!isScoring" class="assess-content">
      <template v-if="list.length > 0">
        <div v-for="(item, idx) in list" :key="idx">
          <h3>审计组{{ idx + 1 }}</h3>
          <el-table border :data="item.memList" highlight-current-row height="500px" style="width: 100%;">
            <el-table-column label="人员ID" align="center" prop="pnum" show-overflow-tooltip />
            <el-table-column label="成员姓名" align="center" prop="pname" show-overflow-tooltip />
            <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ selectConfig.sex[row.sex] }}
              </template>
            </el-table-column>
            <el-table-column label="机构类型" prop="ptype" align="center" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ selectConfig.type[row.ptype] }}
              </template>
            </el-table-column>
            <el-table-column label="所属市县" align="center" width="300px" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ formatArea(row.location) }}
              </template>
            </el-table-column>
            <el-table-column label="项目角色" align="center" prop="projrole" show-overflow-tooltip>
              <template slot-scope="{row}">
                {{ config.roleMap[row.projrole] }}
              </template>
            </el-table-column>
            <template>
              <el-table-column v-if="!isLeader" label="评分状态" align="center" prop="status">
                <template slot-scope="{row}">
                  {{ config.scoreMap[row.status] }}
                </template>
              </el-table-column>
              <template v-else>
                <el-table-column label="客观分数" align="center" prop="objectivescore" show-overflow-tooltip />
                <el-table-column label="主观分数" align="center" prop="subjectivescore" show-overflow-tooltip />
                <el-table-column label="总分数" align="center" prop="totalscore" show-overflow-tooltip />
              </template>
            </template>
            <el-table-column label="操作" align="center">
              <template slot-scope="{row}">
                <el-button
                  :disabled="+row.status === 0"
                  type="text"
                  size="mini"
                  @click="handleToScore(row)"
                >评分</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </template>
      <div v-else>暂无数据</div>
    </div>
    <div v-else v-loading="loading" class="assess-content">
      <el-page-header @back="goBack" />
      <el-row class="userinfo-box">
        <el-col v-for="(item, key) in config.detailMemProps" :key="key" :span="6" class="userinfo-box-col">
          <span class="userinfo-box-label">{{ item.label }}:</span>
          <span class="userinfo-box-value">{{ detail[item.value] || '' }}</span>
        </el-col>
      </el-row>
      <el-divider />
      <div v-if="+actionRow.typeid === 7" class="question-title">审计组考核</div>
      <div v-for="(item, idx) in questions" :key="idx" class="question-box">
        <h4>
          {{ item.title }}
          <span class="question-subtitle-score">{{ [4,5,6].indexOf(+actionRow.typeid) === -1 ? `（${item.score}分）` : '' }}</span>
        </h4>
        <el-divider />
        <div>
          <div v-for="(itm, key) in item.list" :key="key" class="question-box-row">
            <div>{{ key+1 }} . {{ itm.title }} {{ ([4,5,6].indexOf(+actionRow.typeid) === -1 ? `（${itm.score}分）` : '') }}</div>
            <div v-if="[4,5,6].indexOf(+actionRow.typeid) > -1">
              评分：
              <el-select :value="answers[itm.id]" @change="handleChange($event, itm.id)">
                <el-option v-for="(row, idx) in itm.options" :key="idx" :value="row.score" :label="`${row.name}(${row.score}分)`" />
              </el-select>
            </div>
            <div v-else>
              <el-radio-group v-model="answers[itm.id]" @change="handleChange($event, itm.id)">
                <el-radio v-for="(row, idx) in itm.options" :key="idx" :label="row.score">{{ row.name }}</el-radio>
              </el-radio-group>
            </div>
          </div>
          <el-row v-if="+actionRow.typeid === 6" :gutter="50">
            <el-col :span="2">备注：</el-col>
            <el-col :span="16">
              <el-input v-model="answers.remark" type="textarea" :rows="4" @input="handleInput" />
            </el-col>
            <el-col :span="6" class="question-box-other-tip">
              总分： 100
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="question-footer">
        <el-button @click="goBack">取消</el-button>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as assess from '@/api/assess'
import * as config from '../config'
import { getOrgListByType } from '@/api/org'
import { CodeToText } from 'element-china-area-data'
export default {
  props: {
    projectId: [String, Number]
  },
  data() {
    return {
      list: [],
      isLeader: 0,
      selectConfig: this.$store.getters.userSelectConfig,
      config,
      isScoring: false,
      actionRow: {},
      detail: {},
      questions: [],
      organizationList: [],
      loading: false,
      answers: {}
    }
  },
  created() {
    this.fetchList()
  },
  methods: {
    fetchList() {
      assess.fetchList({
        projectid: +this.projectId
      }).then(res => {
        console.log(res.data)
        this.list = res.data.list || []
        this.isLeader = res.data.isleader || 0
      })
    },
    queryDetail() {
      this.questions = []
      this.answers = {}
      const { actionRow, projectId, config } = this
      assess.fetchForm({
        projectid: projectId,
        objuid: actionRow.pnum,
        typeid: actionRow.typeid
      }).then(res => {
        const { content: { question, answer }, userinfo } = res.data
        this.detail = Object.assign({}, userinfo, {
          projrole: config.roleMap[actionRow.projrole],
          locationName: this.formatArea(userinfo.location),
          typeName: this.selectConfig.type[userinfo.type]
        })
        Object.keys(question).forEach(key => {
          let score = 0
          question[key].forEach(row => {
            const maxRow = row.options.sort((a, b) => b.score - a.score)[0]
            row.score = maxRow.score
            score += row.score
          })
          this.questions.push({
            title: key,
            score: score,
            list: question[key]
          })
        })
        Object.keys(answer).forEach(key => {
          if (Array.isArray(answer[key])) {
            const find = answer[key].find(row => row.selected)
            this.$set(this.answers, key, find ? +find.score : '')
          } else {
            this.$set(this.answers, key, answer[key])
          }
        })
        this.queryOrgListByType()
        this.loading = false
      })
    },
    queryOrgListByType() {
      const {
        detail: { type }
      } = this
      getOrgListByType({
        type
      }).then(res => {
        this.organizationList = res.data || []
        if (this.detail.organid) {
          this.detail.organid = +this.detail.organid
          this.changeOrgLabel()
        }
      })
    },
    changeOrgLabel() {
      const {
        detail: { organid }
      } = this
      const item = this.organizationList.find(
        row => row.id === +organid
      )
      this.$set(this.detail, 'organizationLabel', item['name'])
      this.departmentList =
        item.partment.map(row => {
          return {
            id: Object.keys(row)[0],
            name: Object.values(row)[0]
          }
        }) || []

      if (+this.detail.department) {
        const row = this.departmentList.find(row => row.id === this.detail.department)
        this.$set(this.detail, 'departmentLabel', row['name'])
      }
    },
    formatArea(val) {
      if (!val) return
      const areaCode = val.split(',')
      const areas = []
      areaCode.forEach(row => {
        areas.push(CodeToText[row])
      })
      return areas.join('/')
    },
    handleToScore(row) {
      this.actionRow = row
      this.isScoring = true
      this.loading = true
      this.$nextTick(() => {
        this.queryDetail()
      })
    },
    goBack() {
      this.isScoring = false
    },
    handleChange(val, id) {
      this.$set(this.answers, id, val)
    },
    handleInput(val) {
      this.$set(this.answers, 'remark', val)
    },
    handleSubmit() {
      const { questions, answers, actionRow } = this
      const newAnswer = {}
      questions.forEach(question => {
        question.list.forEach(row => {
          const newVal = answers[row.id]
          newAnswer[row.id] = []
          row.options.forEach(item => {
            if (newVal === item.score) {
              item.selected = true
            }
            newAnswer[row.id].push(item)
          })
        })
      })
      if (+actionRow.typeid === 6) {
        newAnswer.remark = answers.remark
      }
      assess.submitForm({
        typeid: actionRow.typeid,
        projectid: this.projectId,
        objuid: actionRow.pnum,
        answers: newAnswer
      }).then(res => {
        this.$message.success('提交成功')
        this.goBack()
        this.fetchList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.assess-content{
  .userinfo-box{
    margin-top: 20px;
    font-size: 14px;
    &-col {
      padding: 10px 0;
    }
    &-label {
      font-weight: bold;
    }
  }
  .question-title {
    font-size: 20px;
    font-weight: 600;
    margin-top: 20px;
  }
  .question-subtitle-score {
    color: #FF0000;
  }
  .question-box {
    font-size: 14px;
    margin-top: 20px;
    &-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 20px;
    }
    &-other {
      &-tip {
        margin-top: 20px;
        font-size: 16px;
        color: #FF0000;
      }
    }
  }
  .question-footer {
    margin-top: 30px;
    text-align: center;
  }
}
</style>

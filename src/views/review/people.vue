<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix title">
      <h4>人员调配审核</h4>
    </div>
    <div class="head-box">
      <el-row class="basic-box">
        <template v-for="(item, key) in props">
          <el-col :key="key" v-if="!['leadernum', 'masternum', 'auditornum'].includes(item.value)" :span="6" class="basic-box-col">
            <span class="basic-box-label">{{ item.label }}:</span>
            <span class="basic-box-value">{{ (detail.project[item.value] || '') + (item.append || '') }}</span>
          </el-col>
        </template>
      </el-row>
      <el-form>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="开始时间:"
            >
              <span>{{ detail.project.projstart || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="项目描述:">
              <span>{{ detail.project.projdesc || '-' }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="审计内容:"
            >
              <div>{{ detail.project.projauditcontent || '-' }}</div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item
              label="人员构成:"
            >
              <span> 审计组长 {{ detail.project.leadernum || 0 }}</span>
              <span> 主审 {{ detail.project.masternum || 0 }}</span>
              <span> 审计成员 {{ detail.project.auditornum || 0 }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <el-divider></el-divider>
      <div>
        <div class="basic-box">
          <span class="basic-box-label">{{selectConfig.type[detail.people.type]}}人员</span>
          <span class="basic-box-value">{{detail.people.num}}</span>
        </div>
        <el-table border :data="detail.people.list || []" highlight-current-row class="basic-box-table">
          <el-table-column label="成员ID" align="center" prop="pid" />
          <el-table-column label="成员姓名" align="center" prop="name" />
          <el-table-column label="性别" align="center" prop="sex" />
          <el-table-column label="机构类型" align="center" prop="type" />
          <el-table-column label="所属机构" align="center" prop="location" />
          <el-table-column label="所属市县" align="center" prop="organization">
            <template slot-scope="{row}">
              {{ formatArea(row.organization) }}
            </template>
          </el-table-column>
          <el-table-column label="项目角色" align="center" prop="projrole" />
        </el-table>
      </div>
    </div>
    <div class="opt-btn-group">
      <el-button type="primary" @click="handleReview(1)">审核通过</el-button>
      <el-button @click="handleReview(2)">驳回</el-button>
    </div>
  </el-card>
</template>

<script>
import {
  props
} from "../project/config"
import { reviewInfo, reviewPeople } from '@/api/review'
import { CodeToText } from 'element-china-area-data'
export default {
  data() {
    return {
      props: [{
        value: 'projname',
        label: '项目名称'
      }].concat(props),
      detail: {
        project: {},
        people: {}
      },
      selectConfig: this.$store.getters.userSelectConfig
    }
  },
  computed: {
    id () {
      return this.$route.params.id || 0
    }
  },
  methods: {
    formatArea(val) {
      if (!val) return
      const areaCode = val.split(',')
      const areas = []
      areaCode.forEach(row => {
        areas.push(CodeToText[row])
      })
      return areas.join('/')
    },
    reviewInfo1() {
      if (this.id) {
        reviewInfo({
          id: this.id
        }).then(res => {
          this.detail = res.data
          const item = JSON.parse(res.data.project["projtype"])
          this.detail.project.projtype = item.length > 0 ? item.join("/") : ""
        })
      }
    },
    handleReview(val) {
      const tips = {
        1: '确认审核通过？',
        2: '确认驳回？'
      }
      const buttons = {
        1: '审核通过',
        2: '已驳回'
      }
      this.$confirm(tips[+val], '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        reviewPeople({
          status: val,
          id: this.id,
          ptype: this.detail.people.type
        }).then(res => {
          this.$message.success(buttons[+val])
          this.$router.push('/review/index?tab=1')
        })
      })
    }
  },
  created() {
    this.reviewInfo1()
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  .head-box {
    .basic-box {
      font-size: 14px;
      width: 100%;
      &-col {
        padding: 10px 0;
      }
      &-label {
        font-weight: bold;
      }
      &-table{
        width: 100%;
        margin-top: 20px;
      }
    }
    .el-form-item{
      margin-bottom: 0 !important;
    }
  }
  .opt-btn-group{
    margin-top: 20px;
    text-align: center;
  }
}
</style>
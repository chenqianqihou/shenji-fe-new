<template>
  <div class="assess-container">
    <div class="assess-content">
      <div v-for="(item, idx) in list" :key="idx">
        <h3>审计组{{item.id}}</h3>
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
          <el-table-column label="所属市县" align="center" prop="location" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ formatArea(row.location) }}
            </template>
          </el-table-column>
          <el-table-column label="项目角色" align="center" prop="projrole" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ config.roleMap[row.projrole] }}
            </template>
          </el-table-column>
          <el-table-column label="评分状态" align="center" prop="status" v-if="!isLeader">
            <template slot-scope="{row}">
              {{ config.scoreMap[row.status] }}
            </template>
          </el-table-column>
          <template v-else>
            <el-table-column label="客观分数" align="center" prop="objectivescore" show-overflow-tooltip />
            <el-table-column label="主观分数" align="center" prop="subjectivescore" show-overflow-tooltip />
            <el-table-column label="总分数" align="center" prop="totalscore" show-overflow-tooltip />
          </template>
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button
                type="text"
                size="mini"
                @click="handleToScore(row)"
              >评分</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import * as assess from '@/api/assess'
import * as config from '../config'
import { CodeToText } from 'element-china-area-data'
export default {
  props: {
    projectId: [String, Number]
  },
  data () {
    return {
      list: [],
      isLeader: 0,
      selectConfig: this.$store.getters.userSelectConfig,
      config
    }
  },
  created () {
    // this.fetchList()
  },
  methods: {
    fetchList() {
      assess.fetchList({
        projectid: +this.projectId
      }).then(res => {
        this.list = res.data.list || []
        this.isLeader = res.isleader || 0
      })
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
    handleToScore(row) {}
  }
}
</script>

<style>

</style>
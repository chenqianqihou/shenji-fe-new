<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>客观分数配置</span>
    </div>
      <div v-for="(config, indx) in configList" :key="indx">
        <h4>{{ config.name }}</h4>
        <div>
          <div v-for="(item, idx) in config.list" :key="idx" style="margin-left: 15px;">
            <div class="sub-title">{{ item.name }}:</div>
            <div class="sub-content">
              <template v-if="+item.kindid === 3 && item.list.length === 0">
                <el-input v-model="item.list[0].nameone"></el-input>
                -
                <el-input v-model="item.list[0].nametwo"></el-input>
                <el-input style="width: 100px" size="mini" v-model="item.list[0].score"></el-input>
              </template>
              <template v-else>
                <el-row v-for="(row, i) in item.list" :key="i" class="sub-content-row">
                  <template v-if="+row.typeid === 4">
                    <el-cascader
                      style="min-width: 600px"
                      v-model="row.nameone"
                      size="mini"
                      :options="violations"
                      :props="{
                        label: 'name',
                        value: 'id',
                        children: 'list'
                      }">
                    </el-cascader>
                    <el-input style="width: 100px" size="mini" v-model="row.score"></el-input>
                  </template>
                  <template v-else-if="+item.kindid === 3">
                    <el-input style="width: 100px" size="mini" v-model="row.score"></el-input>
                  </template>
                  <template v-else>
                    <el-col :span="6">
                      {{ row.nameone }}
                    </el-col>
                    <el-col :span="16">
                      <el-input style="width: 100px" size="mini" v-model="row.score"></el-input>
                    </el-col>
                  </template>
                </el-row>
              </template>
            </div>
          </div>
        </div>
      </div>
    <div>
    </div>
  </el-card>
</template>

<script>
import { fetchScore, fetchViolations } from '@/api/assess'
const formatMap = (arr) => {
  arr.forEach(row => {
    row.id = +row.id
    if (row.list.length === 0) {
      delete row.list
    } else {
      formatMap(row.list)
    }
  })
}
export default {
  data() {
    return {
      configList: [],
      violations: []
    }
  },
  created() {
    this.fetch()
    this.fetchViolations()
  },
  methods: {
    fetch() {
      fetchScore().then(res => {
        this.configList = res.data
      })
    },
    fetchViolations() {
      fetchViolations().then(res => {
        formatMap(res.data)
        console.log(JSON.stringify(res.data))
        this.violations = res.data
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  .sub-title {
    font-size: 14px;
    font-weight: 600;
  }
  .sub-content {
    margin-top: 10px;
    font-size: 14px;
    &-row {
      margin: 5px 0;
      margin-left: 30px;
    }
  }
}
</style>
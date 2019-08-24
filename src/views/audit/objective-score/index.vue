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
            <template v-if="+item.kindid === 3">
              <div v-for="(child, cidx) in item.list" :key="cidx" class="sub-content-row">
                <el-input style="width: 100px" size="mini" v-model="child.nameone" type="number"></el-input>
                -
                <el-input style="width: 100px" size="mini" v-model="child.nametwo" type="number"></el-input>
                <el-input style="width: 100px" size="mini" v-model="child.score" type="number"></el-input>
                <el-button icon="el-icon-plus" size="mini" v-if="cidx === 0" @click="handleAdd3(item.list)"></el-button>
                <el-button icon="el-icon-minus" size="mini" v-else @click="handleRemove3(item.list, cidx)"></el-button>
              </div>
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
                  <el-input style="width: 100px" size="mini" v-model="row.score" type="number"></el-input>
                  <el-button icon="el-icon-plus" size="mini" v-if="i === 0" @click="handleAdd5(item.list)"></el-button>
                  <el-button icon="el-icon-minus" size="mini" v-else @click="handleRemove3(item.list, i)"></el-button>
                </template>
                <template v-else-if="+item.kindid === 3">
                  <el-input style="width: 100px" size="mini" v-model="row.score" type="number"></el-input>
                </template>
                <template v-else>
                  <el-col :span="6">
                    {{ row.nameone }}
                  </el-col>
                  <el-col :span="16">
                    <el-input style="width: 100px" size="mini" v-model="row.score" type="number"></el-input>
                  </el-col>
                </template>
              </el-row>
            </template>
          </div>
        </div>
      </div>
    </div>
    <el-divider></el-divider>
    <div class="opt-footer">
      <el-button @click="fetch">重置</el-button>
      <el-button type="primary" @click="handleSubmit">提交</el-button>
    </div>
  </el-card>
</template>

<script>
import { fetchScore, fetchViolations, saveConfig, deleteConfig } from '@/api/assess'
import { format } from 'path'
const subItem = {
  nameone: '',
  nametwo: '',
  score: 0,
  id: 0
}
const subCasItem = {
  id: 0,
  nameone: [],
  nametwo: '',
  score: 0,
  typeid: 4
}
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
const formatData = (list) => {
  list.forEach(row => {
    if (row.list) {
      if (+row.kindid === 3) {
        if (row.list.length === 0) {
          row.list.push(Object.assign({}, subItem))
        } else {
          formatData(row.list)
        }
      } else {
        formatData(row.list)
      }
    }
  })
}
export default {
  data() {
    return {
      originList: [],
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
        formatData(res.data)
        this.originList = Array.from(res.data)
        this.configList = Array.from(res.data)
      })
    },
    fetchViolations() {
      fetchViolations().then(res => {
        formatMap(res.data)
        this.violations = res.data
      })
    },
    handleAdd3(list) {
      list.push(Object.assign({}, subItem))
    },
    handleRemove3(list, idx) {
      const current = list[idx]
      if (current.id) {
        deleteConfig({
          configid: current.id
        }).then(res => {
          list.splice(idx, 1)
        })
      } else {
        list.splice(idx, 1)
      }
    },
    handleAdd5(list) {
      list.push(Object.assign({}, subCasItem))
    },
    handleSubmit() {
      const { configList } = this
      this.$confirm('确认提交当前修改吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        saveConfig(configList).then(res => {
          this.$message.success('提交成功')
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })          
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
  .opt-footer{
    margin-top: 20px;
  }
}
</style>
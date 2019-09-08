<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>权限配置</span>
    </div>
    <div class="box-card-content">
      <el-tabs tab-position="left" v-model="activeTab">
        <el-tab-pane v-for="item in roleList" :label="item.name" :key="item.id" :name="item.id" class="box-content-tab">
        </el-tab-pane>
        <div class="box-card-content-filter">
          <el-input
            placeholder="输入关键字进行过滤"
            v-model="filterText">
          </el-input>
        </div>
        <el-tree
          ref="authTree"
          :data="treeData"
          show-checkbox
          node-key="id"
          :props="defaultProps"
          default-expand-all
          :default-checked-keys="defaultKeys"
          :filter-node-method="filterNode"
          @check-change="handleCheckChange">
        </el-tree>
        <div class="box-card-content-footer">
          <el-button type="primary" @click="handleSubmit">提交</el-button>
        </div>
      </el-tabs>
    </div>
  </el-card>
</template>

<script>
import { authList, changeAuth } from '@/api/user'
export default {
  data() {
    return {
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'function'
      },
      roleList: [],
      filterText: '',
      roleauthList: {},
      activeTab: ''
    }
  },
  computed: {
    defaultKeys() {
      return this.roleauthList[this.activeTab] || []
    }
  },
  watch: {
    filterText(val) {
      this.$refs.authTree.filter(val)
    },
    activeTab(newVal) {
      this.$refs.authTree.setCheckedKeys(this.roleauthList[newVal] || [])
    }
  },
  created() {
    this.getAuthList()
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true
      return data.function.indexOf(value) !== -1
    },
    handleCheckChange(data, checked, indeterminate) {
      const { activeTab } = this
      const keys = this.$refs.authTree.getCheckedKeys()
      this.roleauthList[activeTab] = []
      keys.forEach(key => {
        if (!isNaN(key)) {
          this.roleauthList[activeTab].push(+key)
        }
      })
    },
    getAuthList() {
      authList().then(res => {
        const { data } = res
        if (data.role) {
          this.roleList = data.role
          data.role.forEach(r => {
            this.roleauthList[r.id] = []
          })
        }
        if (data.auth) {
          const listTree = []
          const authList = this.groupBy(data.auth, false, (row) => {
            return row.menu
          })
          authList.forEach((row, idx) => {
            listTree.push({
              id: row[0].menu,
              function: row[0].menu,
              children: authList[idx]
            })
          })
          this.treeData = listTree
          const roleAuth = this.groupBy(data.roleauth, true, (row) => {
            return row.rid
          })
          Object.values(roleAuth).forEach(rows => {
            rows.forEach(row => {
              this.roleauthList[row.rid].push(+row.authid)
            })
          })
          this.activeTab = data.role[0].id
        }
      })
    },
    groupBy(list, r = false, f) {
      let groups = {}
      list.forEach( function( o ) {
        let group = JSON.stringify( f(o) )
        groups[group] = groups[group] || []
        groups[group].push( o )
      })
      if (r) {
        return groups
      }
      return Object.keys(groups).map( function( group ) {
        return groups[group]
      })
    },
    handleSubmit() {
      const { roleauthList } = this
      const params = []
      Object.keys(roleauthList).forEach(key => {
        params.push({
          roleid: key,
          authid: roleauthList[key]
        })
      })
      changeAuth({
        roleauth: params
      }).then(res => {
        this.$message.success('更新成功')
        // this.getAuthList()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    height: 100%;
    margin: 20px;
    &-content{
      &-filter{
        width: 300px;
        margin-bottom: 20px;
      }
      &-footer{
        margin-top: 20px;
      }
    }
  }
</style>
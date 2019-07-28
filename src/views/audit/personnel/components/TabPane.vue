<template>
  <div class="audit-personnel-container">
    <div class="audit-personnel-left">
      <el-tree
        v-if="+type === 3"
        :data="treeData"
        :props="defaultProps"
        class="tree-class"
        :expand-on-click-node="false"
        @node-click="handleClickNode">
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-tooltip class="item" effect="dark" content="新增" placement="top" v-if="data.data && +data.data.parentid === 0">
              <el-button size='mini' type='text' icon='el-icon-circle-plus-outline' class='tree-button' @click="ev => appendNode(ev, data)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="编辑" placement="top" v-if="data.data && +data.data.parentid > 0">
              <el-button size='mini' type='text' icon='el-icon-edit-outline' class='tree-button' @click="ev => editNode(ev, data)"></el-button>
            </el-tooltip>
            <el-tooltip class="item" effect="dark" content="删除" placement="top" v-if="data.data && +data.data.parentid > 0">
              <el-button size='mini' type='text' icon='el-icon-delete' class='tree-button' @click="ev => deleteNode(ev, data)"></el-button>
            </el-tooltip>
          </span>
        </span>
      </el-tree>
      <el-tree
        v-else
        :data="treeData"
        :props="defaultProps"
        class="tree-class"
        :expand-on-click-node="false"
        @node-click="handleClickNode">
      </el-tree>
    </div>
    <div style="flex: 1;margin-left: 20px;">
      <el-form :inline="true" class="filter-container audit-personnel-filter">
        <el-form-item label="查询条件">
          <el-input
            v-model="listQuery.query"
            placeholder="请输入姓名/人员ID"
            style="width: 200px"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="工作状态">
          <el-select
            v-model="listQuery.status"
            placeholder="请选择"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(value, name) in selectConfig.status" :key="name" :label="value" :value="+name" />
          </el-select>
        </el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          @click="handleFilter"
        >查询</el-button>
        <el-button
          class="filter-item"
          @click="handleResetFilter"
        >重置</el-button>
      </el-form>
      <div class="audit-personnel-actions">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/audit/personnel/create')"
        >新增人员</el-button>
        <el-button
          v-waves
          :disabled="checkedOptions.length === 0"
          class="filter-item"
          type="primary"
          @click="handleDelete('')"
        >批量删除</el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          type="primary"
          @click="handleDownload"
        >导入人员</el-button>
        <el-button
          v-waves
          :loading="downloadLoading"
          class="filter-item"
          icon="el-icon-download"
          @click="handleDownload"
        >下载模板</el-button>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column type="selection" align="center"/>
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="人员ID" prop="pid" align="center" width="200"/>
        <el-table-column label="性别" align="center" prop="sex">
          <template slot-scope="{row}">
            {{ selectConfig.sex[row.sex] }}
          </template>
        </el-table-column>
        <el-table-column label="所在机构" align="center" prop="organization" />
        <el-table-column label="所在部门" align="center" prop="department" />
        <el-table-column label="工作状态" align="center" prop="status">
          <template slot-scope="{row}">
            {{ selectConfig.status[row.status] || row.status }}
          </template>
        </el-table-column>
        <el-table-column label="在途项目" align="center" prop="projectnum" />
        <el-table-column
          label="操作"
          align="center"
          width="300"
        >
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              @click="$router.push(`/audit/personnel/edit/${row.pid}`)"
            >编辑</el-button>
            <el-button type="text" size="mini" @click="$router.push(`/audit/personnel/detail/${row.pid}`)">详情</el-button>
            <el-button type="text" size="mini">重置密码</el-button>
            <el-button type="text" size="mini" @click="handleChangeRole(row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.length"
        @pagination="getList"
      />
    </div>
    <el-dialog title="分配角色" :visible.sync="roleDialog" width="500px" @close="closeRoleDialog" center>
      <el-form :model="roleForm" ref="roleForm">
        <el-form-item
          label="角色"
          label-width="100px"
          prop="role"
          :rules="[{
            required: true,
            message: '请选择角色'
          }]">
          <el-select v-model="roleForm.role" placeholder="请选择角色" collapse-tags multiple class="full-width">
            <el-option :key="idx" :label="v" :value="k" v-for="(v, k, idx) in selectConfig.role"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="treeNode.opt === 'append' ? '新增节点' : '修改节点'" :visible.sync="treeOptDialog" width="500px" @close="closeTreeDialog" center>
      <el-form :model="treeNode" ref="treeNodeForm">
        <el-form-item
          label="名称"
          label-width="100px"
          prop="newName"
          :rules="[{
            required: true,
            message: '请输入名称'
          }]">
          <el-input v-model="treeNode.newName" placeholder="请输入名称"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeOptDialog = false">取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteUser, updateUserRole } from '@/api/user'
import { getOrgTree } from '@/api/org'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const queryString = {
  query: '',
  status: '',
  page: 1,
  length: 20,
  organization: 1 // +this.$route.query.tab || ''
}

export default {
  components: { Pagination },
  directives: { waves },
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tableKey: 2,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: queryString,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      downloadLoading: false,
      checkedOptions: [],
      selectConfig: this.$store.getters.userSelectConfig,
      roleDialog: false,
      roleForm: {
        pid: '',
        role: []
      },
      treeData: [],
      defaultProps: {
        children: 'list',
        label: 'name'
      },
      treeNode: {},
      treeOptDialog: false
    }
  },
  created() {
    this.queryOrgTree()
    this.getList()
  },
  watch: {
    type(newVal) {
      this.getList()
    }
  },
  methods: {
    handleClickNode(node) {
      if (node.id) {
        this.listQuery.organid = +node.id
        this.getList()
      }
    },
    appendNode (ev, data) {
      ev.stopPropagation()
      this.treeNode = Object.assign({}, data, {
        opt: 'append',
        newName: ''
      })
      this.treeOptDialog = true
    },
    editNode (ev, data) {
      ev.stopPropagation()
      this.treeNode = Object.assign({}, data, {
        opt: 'edit',
        newName: data.name
      })
      this.treeOptDialog = true
    },
    deleteNode (ev, data) {
      ev.stopPropagation()
      this.treeNode = data
    },
    queryOrgTree() {
      getOrgTree().then(res => {
        const typeList = this.selectConfig.type
        res.data.forEach(row => {
          row.name = typeList[row.type]
        })
        if (+this.type === 3) {
          this.treeData = res.data.filter(row => +row.type === +this.type)
        } else {
          this.treeData = res.data.filter(row => +row.type !== 3)
        }
      })
    },
    getList() {
      const _params = Object.assign({
        type: +this.type
      }, this.listQuery)
      this.listLoading = true
      fetchList(_params).then(response => {
        this.list = response.data.list
        this.total = +response.data.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleResetFilter() {
      this.listQuery = Object.assign({}, queryString)
      this.getList()
    },
    handleSelectionChange(rows) {
      this.checkedOptions = rows
    },
    handleChangeRole(row) {
      this.roleForm.pid = row.pid
      this.roleDialog = true
    },
    handleSubmitRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          const formData = Object.assign({}, this.roleForm)
          formData.role = formData.role.join()
          updateUserRole(formData).then(res => {
            this.$message.success('分配成功')
            this.roleDialog = false
          })
        }
      })
    },
    closeRoleDialog() {
      this.$refs['roleForm'].resetFields()
    },
    closeTreeDialog() {
      this.$refs['treeNodeForm'].resetFields()
    },
    handleDelete(row = '') {
      const rows = row ? [row.pid] : this.checkedOptions.map(row => row.pid)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteUser({
          pid: rows
        }).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
        const filterVal = [
          'timestamp',
          'title',
          'type',
          'importance',
          'status'
        ]
        const data = this.formatJson(filterVal, this.list)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v =>
        filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        })
      )
    }
  }
}
</script>
<style lang="scss">
.audit-personnel-container{
  display: flex;
  .audit-personnel-left {
    width: 280px;
    border-right: 1px solid #eeeeee;
    .tree-class{
      width: 100%;
      overflow-x: auto;
      .custom-tree-node {
        font-size: 14px;
        .tree-button {
          margin-left: 5px;
          font-size: 15px;
        }
      }
    }
  }
  .audit-personnel-filter {
    padding-bottom: 0;
    .el-form-item {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  .audit-personnel-actions {
    margin-bottom: 15px;
  }
  .full-width {
    width: 100%;
  }
}
</style>

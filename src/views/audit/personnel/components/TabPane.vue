<template>
  <div class="audit-personnel-container">
    <div class="audit-personnel-left">
      <el-tree
        v-if="+type === 3"
        :data="treeData"
        :props="defaultProps"
        class="tree-class"
        node-key="id"
        ref="leftTree"
        highlight-current
        :default-expanded-keys="wtTreeNodeId ? defaultExpandKeys : []"
        :current-node-key="wtTreeNodeId ? String(wtTreeNodeId) : 'type-3'"
        :expand-on-click-node="false"
        @node-click="handleClickNode"
      >
        <span slot-scope="{ node, data }" class="custom-tree-node">
          <span>{{ node.label }}</span>
          <span>
            <el-tooltip v-if="data.data && +data.data.parentid === 0" class="item" effect="dark" content="新增" placement="top">
              <el-button size="mini" type="text" icon="el-icon-circle-plus-outline" class="tree-button" @click="ev => appendNode(ev, node, data)" />
            </el-tooltip>
            <el-tooltip v-if="data.data && +data.data.parentid > 0" class="item" effect="dark" content="编辑" placement="top">
              <el-button size="mini" type="text" icon="el-icon-edit-outline" class="tree-button" @click="ev => editNode(ev, node, data)" />
            </el-tooltip>
            <el-tooltip v-if="data.data && +data.data.parentid > 0" class="item" effect="dark" content="删除" placement="top">
              <el-button size="mini" type="text" icon="el-icon-delete" class="tree-button" @click="ev => deleteNode(ev, node, data)" />
            </el-tooltip>
          </span>
        </span>
      </el-tree>
      <el-tree
        v-else
        :data="treeData"
        :props="defaultProps"
        class="tree-class"
        ref="leftTree"
        node-key="id"
        highlight-current
        :current-node-key="wtTreeNodeId ? String(wtTreeNodeId) : `type-${$route.query.tab || 2}`"
        :default-expanded-keys="wtTreeNodeId ? defaultExpandKeys : []"
        :expand-on-click-node="false"
        @node-click="handleClickNode"
      />
    </div>
    <div style="flex: 1;margin-left: 20px;overflow:auto;">
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
          class="filter-item top-btn"
          type="primary"
          @click="handleDelete('')"
        >批量删除</el-button>
        <el-upload
          class="upload-demo"
          :action="+type === 3 ? `${url}/user/organsexcelupload` : `${url}/user/thirdpartexcel`"
          :show-file-list="false"
          :headers="{
            'AUTHORIZATION': $store.getters.token
          }"
          :on-success="uploadSuccess"
          :on-error="uploadError"
        >
          <el-button
            class="filter-item top-btn"
            type="primary"
          >导入人员</el-button>
        </el-upload>
        <el-button
          v-waves
          v-download="handleDownload"
          class="filter-item"
          icon="el-icon-download"
          :filename="+type === 3 ? '审计机关.xlsx': '第三方人员.xlsx'"
        >下载模板</el-button>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="姓名" align="center" prop="name" />
        <el-table-column label="人员ID" prop="pid" align="center" width="200" />
        <el-table-column label="性别" align="center" prop="sex">
          <template slot-scope="{row}">
            {{ selectConfig.sex[row.sex] }}
          </template>
        </el-table-column>
        <template v-if="+type === 3">
          <el-table-column label="所在机构" align="center" prop="organization" />
          <el-table-column label="所在部门" align="center" prop="department" />
        </template>
        <template v-else>
          <el-table-column label="人员类型" align="center">
            <template slot-scope="{row}">
              {{ selectConfig.type[row.type] }}
            </template>
          </el-table-column>
          <el-table-column label="所属机构" align="center" prop="organization" />
        </template>
        <el-table-column label="工作状态" align="center" prop="status">
          <template slot-scope="{row}">
            {{ selectConfig.status[+row.status] || row.status }}
          </template>
        </el-table-column>
        <el-table-column label="兼办项目" align="center" prop="projectnum" />
        <el-table-column
          label="操作"
          align="center"
          width="300"
        >
          <template slot-scope="{row}">
            <el-button
              :disabled="+row.status === 1"
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
            <el-button type="text" size="mini" @click="handleResetPwd(row)">重置密码</el-button>
            <el-button v-if="+type === 3" type="text" size="mini" @click="handleChangeRole(row)">分配角色</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total > 0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.length"
        @pagination="getList"
      />
    </div>
    <el-dialog title="分配角色" :visible.sync="roleDialog" width="500px" center @close="closeRoleDialog">
      <el-form ref="roleForm" :model="roleForm">
        <el-form-item
          label="角色"
          label-width="100px"
          prop="role"
          :rules="[{
            required: true,
            message: '请选择角色'
          }]"
        >
          <el-select v-model="roleForm.role" placeholder="请选择角色" collapse-tags multiple class="full-width">
            <el-option v-for="(v, k, idx) in selectConfig.role" :key="idx" :label="v" :value="k" />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="roleDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleSubmitRole">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="treeNodeOpt === 'append' ? '新增部门' : '修改部门'" :visible.sync="treeOptDialog" width="500px" center @close="closeTreeDialog">
      <el-form ref="treeNodeForm" :model="treeNode">
        <el-form-item
          label="名称"
          label-width="100px"
          prop="name"
          :rules="[{
            required: true,
            message: '请输入名称'
          }]"
        >
          <el-input v-model="treeNode.name" placeholder="请输入名称" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="treeOptDialog = false">取 消</el-button>
        <el-button type="primary" @click="handleEditNode">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { fetchList, deleteUser, updateUserRole, resetPwd, downloadOrgUser, downloadThirdUser } from '@/api/user'
import { getOrgTree, createByName, updateOrg, deleteOrg } from '@/api/org'
import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
const url = process.env.VUE_APP_BASE_API

const queryString = {
  query: '',
  status: '',
  page: 1,
  length: 20,
  organization: 2 // +this.$route.query.tab || ''
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
      url,
      tableKey: 2,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: Object.assign({}, queryString),
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
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
      currentNode: {},
      currentNodeData: {},
      treeNode: {},
      treeNodeOpt: '',
      treeOptDialog: false,
      wtTreeNodeId: this.$route.query.organid,
      defaultExpandKeys: []
    }
  },
  watch: {
    type(newVal) {
      this.getList()
    }
  },
  created() {
    if (this.wtTreeNodeId) {
      this.listQuery.organization = 3
      this.listQuery.organid = +this.wtTreeNodeId
    }
    this.queryOrgTree()
    this.getList()
  },
  methods: {
    uploadSuccess() {
      this.$message.success('导入成功')
      this.listQuery.page = 0
      this.getList()
    },
    uploadError(err) {
      console.log(err)
    },
    handleResetPwd(row) {
      this.$confirm('确定要重置此用户密码吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        resetPwd({
          pid: row.pid
        }).then(res => {
          this.$message.success('重置成功')
        })
      })
    },
    handleEditNode() {
      let optFunc
      if (this.treeNodeOpt === 'append') {
        optFunc = createByName
      } else {
        optFunc = updateOrg
      }
      this.$refs['treeNodeForm'].validate((valid) => {
        if (valid) {
          optFunc(Object.assign({}, this.treeNode)).then(res => {
            this.$message.success('操作成功')
            const node = res.data.message
            if (this.treeNodeOpt === 'append') {
              if (!this.currentNodeData.list) {
                this.$set(this.currentNodeData, 'list', [])
              }
              this.currentNodeData.list.push({
                id: node.id,
                name: node.name,
                list: [],
                type: 'child',
                data: node
              })
            } else {
              this.currentNodeData.name = node.name
              this.currentNodeData.data = node
            }
            this.treeOptDialog = false
          })
        }
      })
    },
    handleClickNode(node, treeNode) {
      if (node.type !== 'parent' && node.type !== 'child') {
        this.listQuery.organization = 2
        this.listQuery.type = +node.type
        this.$router.replace({
          path: '/audit/personnel',
          query: {
            tab: node.type
          }
        })
      } else {
        this.listQuery.type = +node.otype
        this.listQuery.organization = 3
        this.$router.replace({
          path: '/audit/personnel',
          query: Object.assign({}, this.$route.query, {
            tab: node.otype ? node.otype : node.type,
            organid: +node.id
          })
        })
        this.listQuery.organid = +node.id
      }
      this.getList()
    },
    appendNode(ev, node, data) {
      ev.stopPropagation()
      this.treeNode = {
        pid: data.id,
        name: ''
      }
      this.treeOptDialog = true
      this.$nextTick(() => {
        this.closeTreeDialog()
        this.currentNode = node
        this.currentNodeData = data
        this.treeNodeOpt = 'append'
      })
    },
    editNode(ev, node, data) {
      ev.stopPropagation()
      this.treeNode = Object.assign({}, data.data, {
        oid: data.id
      })
      this.currentNode = node
      this.currentNodeData = data
      this.treeNodeOpt = 'edit'
      this.treeOptDialog = true
    },
    deleteNode(ev, node, data) {
      ev.stopPropagation()
      this.currentNode = node
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteOrg({
          oid: [data.id]
        }).then(res => {
          this.$message.success('删除成功!')
          const parent = this.currentNode.parent
          const children = parent.data.list || parent.data
          const index = children.findIndex(d => d.id === data.id)
          children.splice(index, 1)
        })
      })
    },
    queryOrgTree() {
      getOrgTree().then(res => {
        const typeList = this.selectConfig.type
        res.data.forEach(row => {
          row.name = typeList[row.type]
          row.id = 'type-' + row.type
        })
        if (+this.type === 3) {
          const data = res.data.filter(row => +row.type === +this.type)
          this.treeData = data[0].list || data
          this.treeData.forEach(row => {
            this.casdTreeProp(row, 3)
          })
        } else {
          this.treeData = res.data.filter(row => +row.type !== 3)
          this.treeData.forEach(row => {
            this.casdTreeProp(row, row.type)
          })
          
          console.log( this.defaultExpandKeys)
        }
      })
    },
    casdTreeProp(node, type) {
      node.list.forEach(row => {
        row.otype = type
        row.id = String(row.id)
        if (String(row.id) === String(this.wtTreeNodeId)) {
          this.defaultExpandKeys = [node.id]
        }
        if (row.list && row.list.length > 0) {
          this.casdTreeProp(row, type)
        }
      })
    },
    getList() {
      const _params = Object.assign({
        type: [1, 2, 3].includes(+this.$route.query.tab) ? +this.$route.query.tab : +this.type
      }, this.listQuery)
      this.listLoading = true
      fetchList(_params).then(response => {
        this.list = response.data.list
        this.total = +response.data.total

        // Just to simulate the time of the request
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    handleResetFilter() {
      this.listQuery.query = ''
      this.listQuery.status = ''
      this.getList()
    },
    handleSelectionChange(rows) {
      this.checkedOptions = rows
    },
    handleChangeRole(row) {
      this.roleDialog = true
      this.$nextTick(() => {
        this.closeRoleDialog()
        this.roleForm.pid = row.pid
        this.roleForm.role = row.role ? row.role : []
      })
    },
    handleSubmitRole() {
      this.$refs['roleForm'].validate((valid) => {
        if (valid) {
          const formData = Object.assign({}, this.roleForm)
          formData.role = formData.role.join()
          updateUserRole(formData).then(res => {
            this.$message.success('分配成功')
            this.getList()
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
      return +this.type === 3 ? downloadOrgUser() : downloadThirdUser()
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
    width: 240px;
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
    display: flex;
    margin-bottom: 15px;
    .top-btn {
      margin-right: 10px;
    }
  }
  .full-width {
    width: 100%;
  }
}
</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>项目管理</span>
    </div>
    <div>
      <el-form :inline="true" class="filter-container audit-project-filter">
        <el-form-item label="项目年度">
          <el-select
            v-model="listQuery.projyear"
            placeholder="请选择"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(item, idx) in selectConfig.projyear" :key="idx" :value="item" :label="item" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目层级">
          <el-select
            v-model="listQuery.projlevel"
            placeholder="请选择"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(item, idx) in selectConfig.projlevel" :key="idx" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="中介审核">
          <el-select
            v-model="listQuery.medium"
            placeholder="请选择"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(item, idx) in selectConfig.medium" :key="idx" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <el-form-item label="内审审核">
          <el-select
            v-model="listQuery.internal"
            placeholder="请选择"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(item, idx) in selectConfig.internal" :key="idx" :value="item.value" :label="item.label" />
          </el-select>
        </el-form-item>
        <div>
          <el-form-item label="项目阶段">
            <el-select
              v-model="listQuery.projstage"
              placeholder="请选择"
              clearable
              style="width: 150px"
              class="filter-item"
            >
              <el-option v-for="(item, idx) in selectConfig.projstage" :key="idx" :value="item.value" :label="item.label" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-input
              v-model="listQuery.query"
              placeholder="请输入项目编号或名称"
              style="width: 200px"
              class="filter-item"
            />
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
        </div>
      </el-form>
      <div class="audit-project-actions">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/project/create')"
        >新建</el-button>
        <el-button
          :disabled="checkedOptions.length === 0"
          class="filter-item"
          type="primary"
          @click="handleDelete('')"
        >批量删除</el-button>
        <el-button
          class="filter-item"
          type="primary"
          disabled
        >批量导入</el-button>
        <el-button
          disabled
          class="filter-item"
          icon="el-icon-download"
        >下载模板</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column label="项目编号" align="center" prop="projectnum" />
        <el-table-column label="项目名称" align="center" prop="name" />
        <el-table-column label="项目年度" align="center" prop="projyear" />
        <el-table-column label="项目单位" prop="projorgan" align="center">
          <template slot-scope="{row}">
            {{ toOrgName(row.projorgan) }}
          </template>
        </el-table-column>
        <el-table-column label="项目层级" align="center" prop="projlevel">
          <template slot-scope="{row}">
            {{ row.projlevel && originConfig.projlevel ? originConfig.projlevel[+row.projlevel] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="计划时长（天）" align="center" prop="plantime" />
        <el-table-column label="中介审核" align="center" prop="medium">
          <template slot-scope="{row}">
            {{ row.medium && originConfig.medium ? originConfig.medium[+row.medium] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="内审审核" align="center" prop="internal">
          <template slot-scope="{row}">
            {{ row.internal && originConfig.internal ? originConfig.internal[+row.internal] : '' }}
          </template>
        </el-table-column>
        <el-table-column label="项目阶段" align="center" prop="status">
          <template slot-scope="{row}">
            {{ row.status && originConfig.projstage ? originConfig.projstage[+row.status] : '' }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300"
        >
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="text"
              @click="handleChangeStatus(row)"
            >{{ operateMap[row.status] }}</el-button>
            <el-button
              size="mini"
              type="text"
              @click="handleDelete(row)"
            >删除</el-button>
            <el-button
              type="text"
              size="mini"
              @click="$router.push(`/project/detail/${row.id}`)"
            >查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.start"
        :limit.sync="listQuery.length"
        @pagination="getList"
      />
    </div>
    <el-dialog title="填写审理人数" :visible.sync="auditDialogVisible" width="500px" center @close="closeAuditDialog">
      <el-form ref="auditForm" :model="auditForm">
        <el-form-item
          label="审理人数"
          label-width="100px"
          prop="num"
          :rules="[{
            required: true,
            message: '请填写审理人数'
          }]"
        >
          <el-input v-model="auditForm.num" type="number"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAudit">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fetchList, deleteProject, selectConfig, selectList, updateStatus } from '@/api/project'
import { statusMap, operateMap } from './config'
const queryString = {
  projyear: '',
  projlevel: '',
  medium: '',
  internal: '',
  projstage: '',
  query: '',
  length: 20,
  page: 1
}
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: Object.assign({}, queryString),
      total: 0,
      checkedOptions: [],
      selectConfig: {},
      originConfig: {},
      selectList: {},
      statusMap: statusMap,
      operateMap: operateMap,
      auditForm: {
        num: '',
        status: ''
      },
      auditDialogVisible: false
    }
  },
  created() {
    this.getSelectConfig()
    this.getSelectList()
    this.getList()
  },
  methods: {
    toOrgName(id) {
      if (this.selectList.organlist) {
        const item = this.selectList.organlist.find(row => row.id === +id)
        return item ? item.name : id
      }
      return id
    },
    getSelectList() {
      selectList().then(res => {
        this.selectList = res.data
      })
    },
    getSelectConfig() {
      selectConfig().then(res => {
        const keys = Object.keys(res.data)
        const values = Object.values(res.data)
        values.forEach((row, idx) => {
          this.selectConfig[keys[idx]] = []
          this.originConfig[keys[idx]] = {}
          row.forEach(r => {
            let item
            if (typeof r === 'object') {
              this.originConfig[keys[idx]][Object.keys(r)[0]] = Object.values(r)[0]
              item = {
                value: Object.keys(r)[0],
                label: Object.values(r)[0]
              }
            } else {
              item = r
            }
            this.selectConfig[keys[idx]].push(item)
          })
        })
      })
    },
    closeAuditDialog() {
      this.$refs['auditForm'].resetFields()
    },
    getList() {
      const _params = Object.assign({}, this.listQuery)
      this.listLoading = true
      fetchList(_params).then(response => {
        this.list = response.data.list
        this.total = +response.data.total
        this.listLoading = false
      })
    },
    handleDelete(row = '') {
      const rows = row ? [row.id] : this.checkedOptions.map(row => row.id)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteProject({
          id: rows
        }).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
      })
    },
    handleChangeStatus(row) {
      if (+row.status === 3) {
        this.auditForm.operate = +row.status + 1
        this.auditForm.id = row.id
        this.auditDialogVisible = true
      } else {
        updateStatus({
          operate: +row.status + 1,
          id: row.id
        }).then(res => {
          this.$message.success('操作成功')
          this.auditDialogVisible = false
          this.getList()
        })
      }
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
    handleChangeStatusSubmit() {
      const params = Object.assign({}, this.auditForm)
      updateStatus(params).then(res => {
        this.$message.success('操作成功')
        this.auditDialogVisible = false
        this.getList()
      })
    },
    handleAudit() {
      this.$refs['auditForm'].validate(valid => {
        if (valid) {
          this.handleChangeStatusSubmit()
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  .audit-project-filter {
    padding-bottom: 0;
    .el-form-item {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  .audit-project-actions {
    margin-bottom: 15px;
  }
  .full-width {
    width: 100%;
  }
}
</style>

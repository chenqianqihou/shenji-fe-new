<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>成果管理</span>
    </div>
    <div>
      <el-form :inline="true" class="filter-container audit-project-filter">
        <div>
          <el-form-item>
            <el-input
              v-model="listQuery.projectid"
              placeholder="请输入项目编号/项目名称"
              style="width: 200px"
              class="filter-item"
            />
          </el-form-item>
          <el-form-item label="审核状态">
            <el-select
              v-model="listQuery.status"
              placeholder="请选择"
              clearable
              style="width: 150px"
              class="filter-item"
            >
              <el-option v-for="(item, key) in resultStatus" :key="item" :value="key" :label="item" />
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
        </div>
      </el-form>
      <div class="audit-project-actions">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/result/create')"
        >新建</el-button>
        <el-button
          :disabled="checkedOptions.length === 0"
          class="filter-item top-btn"
          type="primary"
          @click="handleDelete('')"
        >批量删除</el-button>
        <el-upload
          class="upload-demo"
          :action="`${url}/auditresults/excelupload`"
          :show-file-list="false"
          :headers="{
            'AUTHORIZATION': $store.getters.token
          }"
          :on-success="handleSuccess"
          :on-error="uploadError"
        >
          <el-button
            class="filter-item"
            type="primary"
          >上传导入</el-button>
        </el-upload>
        <el-button
          v-download="download"
          filename="审计成果模板.xlsx"
          class="filter-item"
          icon="el-icon-download"
        >下载模板</el-button>
        <el-button
          v-download="getDownload"
          filename="审计成果列表.xlsx"
          class="filter-item"
          type="danger"
          icon="el-icon-download"
        >导出</el-button>
      </div>

      <el-table
        v-loading="listLoading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" :selectable="checkboxInit" />
        <el-table-column label="项目编号" align="center">
          <template slot-scope="{row}">
            {{ row.project_msg.projectnum }}
          </template>
        </el-table-column>
        <el-table-column label="项目名称" align="center">
          <template slot-scope="{row}">
            {{ row.project_msg.name }}
          </template>
        </el-table-column>
        <el-table-column label="项目层级" align="center">
          <template slot-scope="{row}">
            {{ row.project_msg.projlevel && originConfig.projlevel ? originConfig.projlevel[+row.project_msg.projlevel] : row.project_msg.projlevel }}
          </template>
        </el-table-column>
        <el-table-column label="项目年度" align="center">
          <template slot-scope="{row}">
            {{ row.project_msg.projyear }}
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center">
          <template slot-scope="{row}">
            {{ row.people_msg.name }}
          </template>
        </el-table-column>
        <el-table-column label="人员ID" align="center">
          <template slot-scope="{row}">
            {{ row.people_msg.pid }}
          </template>
        </el-table-column>
        <el-table-column label="项目角色" align="center">
          <template slot-scope="{row}">
            {{ roleMap[+row.roletype] }}
          </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center">
          <template slot-scope="{row}">
            {{ resultStatus[+row.status] }}
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="300"
        >
          <template slot-scope="{row}">
            <el-button
              v-if="+row.status !== 2"
              size="mini"
              type="text"
              @click="handleDelete(row)"
            >删除</el-button>
            <el-button
              type="text"
              size="mini"
              @click="$router.push(`/result/detail/${row.id}`)"
            >查看</el-button>
            <el-button
              v-if="+row.status !== 2"
              size="mini"
              type="text"
              @click="$router.push(`/result/edit/${row.id}`)"
            >修改</el-button>
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
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fetchList, fetchDownload, downloadExcel, deleteResult } from '@/api/result'
import { selectConfig } from '@/api/project'
import { statusMap, resultStatus } from './config'
import { roleMap } from '../project/config'
import { isArray } from '@/utils'
const url = process.env.VUE_APP_BASE_API
const queryString = {
  projectid: '',
  status: '',
  start: 0,
  length: 20
}
export default {
  components: { Pagination },
  data() {
    return {
      listLoading: false,
      list: [],
      listQuery: Object.assign({}, queryString),
      total: 0,
      statusMap,
      roleMap,
      originConfig: {},
      url,
      resultStatus,
      checkedOptions: []
    }
  },
  created() {
    this.getSelectConfig()
  },
  methods: {
    checkboxInit(row) {
      return +row.status !== 2 ? 1 : 0
    },
    handleSelectionChange(rows) {
      this.checkedOptions = rows
    },
    download() {
      return downloadExcel()
    },
    async getSelectConfig() {
      const res = await selectConfig()
      const keys = Object.keys(res.data)
      const values = Object.values(res.data)
      values.forEach((row, idx) => {
        this.originConfig[keys[idx]] = {}
        row.forEach(r => {
          let item
          if (typeof r === 'object') {
            this.originConfig[keys[idx]][Object.keys(r)[0]] = Object.values(r)[0]
          }
        })
        this.listQuery.start = 0
        this.getList()
      })
    },
    getList() {
      const _params = Object.assign({}, this.listQuery)
      if (_params.start > 0) {
        _params.start = (_params.start - 1) * _params.length
      }
      this.listLoading = true
      fetchList(_params).then(response => {
        this.list = isArray(response.data.list) ? response.data.list : Object.values(response.data.list)
        this.total = +response.data.total
        this.listLoading = false
      })
    },
    getDownload() {
      const _params = Object.assign({}, this.listQuery)
      delete _params.start
      delete _params.length
      return fetchDownload(_params)
    },
    handleFilter() {
      this.listQuery.start = 0
      this.getList()
    },
    handleResetFilter() {
      this.listQuery = Object.assign({}, queryString)
      this.getList()
    },
    handleDelete(row) {
      const rows = row ? [row.id] : this.checkedOptions.map(row => row.id)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        center: true
      }).then(() => {
        deleteResult({
          id: rows
        }).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
      })
    },
    handleSuccess(res) {
      const { error, data } = res
      if (error.returnCode !== 0) {
        this.$message.error(error.returnMessage)
      } else {
        this.$message.success('导入成功')
        this.start = 0
        this.getList()
      }
    },
    uploadError(err) {
      console.log(err)
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
    display: flex;
    margin-bottom: 15px;
    & > button, & > div {
      margin-right: 20px;
    }
  }
  .full-width {
    width: 100%;
  }
}
</style>

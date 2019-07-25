<template>
  <div class="audit-personnel-container">
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
        @click="$router.replace('/audit/personnel/create')"
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
      fit
      highlight-current-row
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" />
      <el-table-column label="姓名" align="center" prop="name" />
      <el-table-column label="人员ID" prop="pid" align="center" />
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
          >编辑</el-button>
          <el-button type="text" size="mini">详情</el-button>
          <el-button type="text" size="mini">重置密码</el-button>
          <el-button type="text" size="mini">分配角色</el-button>
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
</template>

<script>
import { fetchList, deleteUser } from '@/api/user'
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
      selectConfig: this.$store.getters.userSelectConfig
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      const _params = Object.assign({}, this.listQuery)
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
    handleDelete(row = '') {
      const rows = row ? [row.pid] : this.checkedOptions.map(row => row.pid)
      this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser({
          pid: rows
        }).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
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
</style>

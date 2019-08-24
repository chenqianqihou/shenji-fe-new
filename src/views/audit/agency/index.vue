<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>机构管理</span>
    </div>
    <div>
      <el-form :inline="true" class="filter-container audit-agency-filter">
        <el-form-item>
          <el-input
            v-model="listQuery.key"
            placeholder="请输入"
            style="width: 200px"
            class="filter-item"
          />
        </el-form-item>
        <el-form-item label="机构类型">
          <el-select
            v-model="listQuery.type"
            placeholder="请选择"
            clearable
            style="width: 150px"
            class="filter-item"
          >
            <template v-for="(value, name, idx) in selectConfig.type">
              <el-option v-if="+name !== 3" :key="idx" :label="value" :value="+name" />
            </template>
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
      <div class="audit-agency-actions">
        <el-button
          class="filter-item"
          type="primary"
          icon="el-icon-plus"
          @click="$router.push('/audit/agency/create')"
        >新增机构</el-button>
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
        <el-table-column label="机构名称" align="center" prop="name" />
        <el-table-column label="机构类型" prop="otype" align="center" width="200">
          <template slot-scope="{row}">
            {{ selectConfig.type[row.otype] }}
          </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center" prop="regtime">
          <template slot-scope="{row}">
            {{ parseDate(row.regtime) }}
          </template>
        </el-table-column>
        <el-table-column label="注册资金（万元）" align="center" prop="capital" />
        <el-table-column label="开始从业日期" align="center" prop="workbegin">
          <template slot-scope="{row}">
            {{ parseDate(row.workbegin) }}
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
              @click="handleDelete(row)"
            >删除</el-button>
            <el-button
              size="mini"
              type="text"
              @click="$router.push(`/audit/agency/edit/${row.id}`)"
            >修改</el-button>
            <el-button
              type="text"
              size="mini"
              @click="$router.push(`/audit/agency/detail/${row.id}`)"
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
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { fetchList, deleteOrg } from '@/api/org'
import { parseTime } from '@/utils'
const queryString = {
  key: '',
  type: '',
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
      checkedOptions: [],
      selectConfig: this.$store.getters.userSelectConfig
    }
  },
  created() {
    this.getList()
  },
  methods: {
    parseDate(time) {
      return parseTime(time * 1000, '{y}-{m}-{d}')
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
        deleteOrg({
          oid: rows
        }).then(res => {
          this.$message.success('删除成功!')
          this.getList()
        })
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
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  .audit-agency-filter {
    padding-bottom: 0;
    .el-form-item {
      padding-bottom: 0;
      margin-bottom: 0;
    }
  }
  .audit-agency-actions {
    margin-bottom: 15px;
  }
  .full-width {
    width: 100%;
  }
}
</style>

<template>
  <div class="review-card">
    <el-tabs type="border-card">
      <el-tab-pane label="项目人员审核">
        <el-form :inline="true" class="filter-container audit-project-filter">
          <el-form-item>
            <el-input
              v-model="listQuery.query"
              placeholder="请输入项目编号/项目名称"
              style="width: 200px"
              class="filter-item"
            />
          </el-form-item>
          <el-form-item label="项目年度">
            <el-select v-model="listQuery.projyear">
              <el-option v-for="(row, idx) in listSetting.years" :key="idx" :value="row" :label="row"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="项目层级">
            <el-select v-model="listQuery.projlevel">
              <el-option v-for="(row, idx) in listSetting.levels" :key="idx" :value="row" :label="originConfig.projlevel ? originConfig.projlevel[+row] : row"></el-option>
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
        <el-table
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="项目编号" align="center">
            <template slot-scope="{row}">
              {{ row.projectnum }}
            </template>
          </el-table-column>
          <el-table-column label="项目名称" align="center">
            <template slot-scope="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column label="项目年度" align="center">
            <template slot-scope="{row}">
              {{ row.projyear }}
            </template>
          </el-table-column>
          <el-table-column label="项目单位" align="center">
            <template slot-scope="{row}">
              {{ row.projorgan }}
            </template>
          </el-table-column>
          <el-table-column label="项目层级" align="center">
            <template slot-scope="{row}">
              {{ row.projlevel && originConfig.projlevel ? originConfig.projlevel[+row.projlevel] : row.projlevel }}
            </template>
          </el-table-column>
          <el-table-column label="计划时长（天）" align="center">
            <template slot-scope="{row}">
              {{ row.plantime }}
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center">
            <template slot-scope="{row}">
              {{ statusMap[+row.status] }}
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
                @click="$router.push(`/review/people/${row.id}`)"
              >去审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.page_size"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="审计成果审核">
        <el-form :inline="true" class="filter-container audit-project-filter">
          <el-form-item>
            <el-input
              v-model="resultQuery.query"
              placeholder="请输入项目编号/项目名称"
              style="width: 200px"
              class="filter-item"
            />
          </el-form-item>
          <el-button
            class="filter-item"
            type="primary"
          >查询</el-button>
          <el-button
            class="filter-item"
          >重置</el-button>
        </el-form>
        <el-table
          v-loading="resultListLoading"
          :data="resultList"
          border
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="项目编号" align="center">
            <template slot-scope="{row}">
              {{ row.projectnum }}
            </template>
          </el-table-column>
          <el-table-column label="项目名称" align="center">
            <template slot-scope="{row}">
              {{ row.name }}
            </template>
          </el-table-column>
          <el-table-column label="项目层级" align="center">
            <template slot-scope="{row}">
              {{ row.projlevel && originConfig.projlevel ? originConfig.projlevel[+row.projlevel] : row.projlevel }}
            </template>
          </el-table-column>
          <el-table-column label="项目年度" align="center">
            <template slot-scope="{row}">
              {{ row.projyear }}
            </template>
          </el-table-column>
          <el-table-column label="姓名" align="center">
            <template slot-scope="{row}">
              {{ row.pname }}
            </template>
          </el-table-column>
          <el-table-column label="人员ID" align="center">
            <template slot-scope="{row}">
              {{ row.pid }}
            </template>
          </el-table-column>
          <el-table-column label="项目角色" align="center">
            <template slot-scope="{row}">
              {{ roleMap[+row.roletype] }}
            </template>
          </el-table-column>
          <el-table-column label="审核状态" align="center">
            <template slot-scope="{row}">
              {{ statusMap[+row.status] }}
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
              >去审核</el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="resultTotal>0"
          :total="resultTotal"
          :page.sync="resultQuery.page"
          :limit.sync="resultQuery.page_size"
          @pagination="getResultList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchList, fetchResultList, fetchConfig } from '@/api/review'
import { selectConfig } from '@/api/project'
import Pagination from '@/components/Pagination'
import { statusMap } from '@/views/result/config'
import { roleMap } from '@/views/project/config'
const queryString = {
  projyear: '',
  query: '',
  projlevel: '',
  page: 1,
  page_size: 20
}
const resultQuery = {
  query: '',
  page: 1,
  page_size: 20
}
export default {
  data() {
    return {
      total: 0,
      listLoading: false,
      list: [],
      listQuery: Object.assign({}, queryString),
      resultQuery: Object.assign({}, resultQuery),
      resultListLoading: false,
      resultList: [],
      resultTotal: 0,
      listSetting: {},
      originConfig: {},
      statusMap,
      roleMap
    }
  },
  components: { Pagination },
  created() {
    Promise.all([this.getSelectConfig()]).then(() => {
      this.getList()
    })
    this.getConfig()
    this.getResultList()
  },
  methods: {
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
      })
    },
    getList() {
      const { listQuery } = this
      this.listLoading = true
      fetchList(listQuery).then(res => {
        this.list = res.data.list || []
        this.total = +res.data.total
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 0
      this.getList()
    },
    handleResetFilter() {
      this.listQuery = Object.assign({}, queryString)
      this.getList()
    },
    getResultList() {
      const { resultQuery } = this
      this.resultListLoading = true
      fetchResultList(resultQuery).then(res => {
        this.resultList = res.data.list || []
        this.resultTotal = +res.data.total
        this.resultListLoading = false
      })
    },
    getConfig() {
      fetchConfig().then(res => {
        const { data } = res
        this.listSetting.levels = data.projlevels.map(row => row.projlevel)
        this.listSetting.years = data.projyears.map(row => row.projyear)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .review-card {
    padding: 20px;
  }
</style>
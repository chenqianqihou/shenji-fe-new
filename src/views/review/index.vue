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
            <el-date-picker
              v-model="listQuery.projyear"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="项目层级">
            <el-select v-model="listQuery.projlevel"></el-select>
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
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%"
        >
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
          <el-table-column label="项目年度" align="center">
            <template slot-scope="{row}">
              {{ row.project_msg.projyear }}
            </template>
          </el-table-column>
          <el-table-column label="项目单位" align="center">
            <template slot-scope="{row}">
              {{ row.project_msg.projyear }}
            </template>
          </el-table-column>
          <el-table-column label="项目层级" align="center">
            <template slot-scope="{row}">
              {{ row.project_msg.projlevel && originConfig.projlevel ? originConfig.projlevel[+row.project_msg.projlevel] : row.project_msg.projlevel }}
            </template>
          </el-table-column>
          <el-table-column label="计划时长（天）" align="center">
            <template slot-scope="{row}">
              {{ row.people_msg.name }}
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
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.start"
          :limit.sync="listQuery.length"
          @pagination="getList"
        />
      </el-tab-pane>
      <el-tab-pane label="审计成果审核">
        <el-form :inline="true" class="filter-container audit-project-filter">
          <el-form-item>
            <el-input
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
          v-loading="listLoading"
          :data="list"
          border
          highlight-current-row
          style="width: 100%"
        >
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
              {{ row.people_msg.id }}
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
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.start"
          :limit.sync="listQuery.length"
          @pagination="getList"
        />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { fetchList, fetchResultList } from '@/api/review'
import Pagination from '@/components/Pagination'
const queryString = {
  projyear: '',
  query: '',
  projlevel: '',
  page: 0,
  page_size: 20
}
const resultQuery = {
  query: '',
  page: 0,
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
      resultTotal: 0
    }
  },
  components: { Pagination },
  created() {
    // this.getList()
  },
  methods: {
    getList() {
      const { listQuery } = this
      this.listLoading = true
      fetchList(listQuery).then(res => {
        this.list = res.data.list
        this.total = res.data.total
        this.listLoading = false
      })
    },
    getResultList() {
      const { resultQuery } = this
      this.resultListLoading = true
      fetchList(listQuery).then(res => {
        this.resultList = res.data.list
        this.resultTotal = res.data.total
        this.resultListLoading = false
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
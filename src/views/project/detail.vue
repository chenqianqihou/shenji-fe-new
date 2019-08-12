<template>
  <el-card class="project-detail-box">
    <div slot="header" class="clearfix title">
      <h4>项目{{ detail.basic.projectname || '详情' }}</h4>
      <div>
        <el-button size="mini" type="primary" @click="$router.push(`/project/edit/${projectId}`)">项目计划编辑</el-button>
        <el-button size="mini" :class="`status-btn-${+detail.basic.projectstatus}`" @click="changeStatus" v-if="+detail.basic.projectstatus < 4">{{ operateMap[+detail.basic.projectstatus] }}</el-button>
      </div>
    </div>
    <div class="head-box">
      <el-row class="basic-box">
        <el-col :span="6" v-for="(item, key) in props" :key="key" class="basic-box-col">
          <span class="basic-box-label">{{ item.label }}:</span>
          <span class="basic-box-value">{{ (detail.head[item.value] || '') + (item.append || '') }}</span>
        </el-col>
      </el-row>
      <div class="tag-box">
        <div class="tag-box-label">项目阶段</div>
        <div class="tag-box-value">{{ statusMap[detail.basic.projectstatus] }}</div>
      </div>
    </div>
    <el-divider></el-divider>
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="first">
        <el-form :model="basicForm" label-width="90px" ref="auditInfoForm">
          <el-row>
            <el-col :span="16">
              <el-form-item label="项目描述:">
                <span>{{ detail.basic.projdesc || '' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="16">
              <el-form-item label="开始时间:" prop="projstart" :rules="[{
                required: true,
                message: '请选择开始时间'
              }]">
                <span v-if="!basicEditing">{{ detail.basic.projstart || '待编辑' }}</span>
                <el-date-picker
                  v-else
                  type="date"
                  v-model="basicForm.projstart"
                  placeholder="请选择"
                />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="danger" class="basic-right-btn" v-if="!basicEditing" @click="basicEditing = true">编辑</el-button>
              <div class="basic-right-btn" v-else>
                <el-button type="info" @click="basicEditing = false">取消</el-button>
                <el-button type="primary" class="basic-right-btn" @click="handleSaveBasic">保存</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="审计内容:" prop="projauditcontent" :rules="[{
                required: true,
                message: '请输入审计内容'
              }]">
                <div v-if="!basicEditing">{{ detail.basic.projauditcontent || '待编辑' }}</div>
                <el-input type="textarea" :rows="6" v-model="basicForm.projauditcontent" v-else></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="审计组" name="second">
        <div style="display:flex">
          <div style="width: 140px;vertical-align: middle;line-height: 112px;">需要第三方人员：</div>
          <div style="flex: 1">
            <div style="margin: 10px">
              <el-checkbox v-model="listQuery.isinternal" :true-label="1" :false-label="2">中介机构</el-checkbox>
              <span style="font-weight: bold; font-size:14px;">中介审核：{{ detail.auditgroup.medium ? stsMap[detail.auditgroup.medium] : '-' }}</span>
              <!-- <el-button type="danger" style="margin-left: 20px" size="mini">提交审核</el-button> -->
            </div>
            <el-divider style="margin: 0"></el-divider>
            <div style="margin: 10px">
              <el-checkbox v-model="listQuery.ismedium" :true-label="1" :false-label="2">内审机构</el-checkbox>
              <span style="font-weight: bold;font-size:14px;">内审审核：{{ detail.auditgroup.internal ? stsMap[detail.auditgroup.internal] : '-' }}</span>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <div v-for="(item, idx) in detail.auditgroup.list" :key="idx">
          <div style="display: flex;justify-content: space-between;">
            <h3>审计组{{ idx + 1 }}</h3>
            <div>
              <h4>审计状态</h4>
              <span>{{ auditStatusMap[+item.status] }}</span>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="handleAdd(item.id)">新增人员</el-button>
            <el-button :type="[1, 3].includes(item.operate) ? `success` : 'error'" @click="changeAuditStatus(item.operate, item.id)">{{ auditOptMap[item.operate] }}</el-button>
          </div>
          <div style="margin-top: 20px;">
            <el-table
              border
              :data="item.group || []"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column label="成员ID" align="center" prop="pid" />
              <el-table-column label="成员姓名" align="center" prop="name" />
              <el-table-column label="性别" align="center" prop="roletype">
                <template slot-scope="{row}">
                  {{ selectConfig.sex[row.sex] }}
                </template>
              </el-table-column>
              <el-table-column label="机构类型" prop="projorgan" align="roletype">
                <template slot-scope="{row}">
                  {{ selectConfig.type[row.roletype] }}
                </template>
              </el-table-column>
              <el-table-column label="所属市县" align="center" prop="location">
              </el-table-column>
              <el-table-column label="项目角色" align="center" prop="role">
                <template slot-scope="{row}">
                  {{ roleMap[row.role] }}
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
                    @click="handleAuditDelete(row, item.id)"
                  >删除</el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleShowRole(row, item.id)"
                  >更改角色</el-button>
                  <el-button
                    v-if="+row.islock === 2"
                    type="text"
                    size="mini"
                    @click="handleUnlock(row, item.id)"
                  >解锁</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-divider v-if="(idx + 1) < detail.auditgroup.list.length"></el-divider>
        </div>
         <el-dialog title="修改角色" :visible.sync="roleDialogVisible" width="500px" center @close="closeRoleDialog">
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
              <el-select v-model="roleForm.role" placeholder="请选择角色" style="width: 100%">
                <el-option v-for="(v, k, idx) in roleMap" :key="idx" :label="v" :value="k" />
              </el-select>
            </el-form-item>
          </el-form>
          <div slot="footer" class="dialog-footer">
            <el-button @click="roleDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="handleUpdateRole">确 定</el-button>
          </div>
        </el-dialog>
      </el-tab-pane>
      <el-tab-pane label="审理成员" name="third">
        <div style="margin-bottom: 20px">
          <el-button type="primary" @click="handleAdd">新增人员</el-button>
        </div>
        <el-table
          :data="[]"
          border
          highlight-current-row
          style="width: 100%"
        >
          <el-table-column label="成员ID" align="center" prop="pid" show-overflow-tooltip />
          <el-table-column label="成员姓名" align="center" prop="name" show-overflow-tooltip />
          <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip />
          <el-table-column label="所属部门" prop="type" align="center" show-overflow-tooltip />
          <el-table-column label="所属市县" align="center" prop="department" show-overflow-tooltip />
          <el-table-column label="审计组" align="center" prop="projectnum" />
          <el-table-column
            label="操作"
            align="center"
          >
            <template slot-scope="{row}">
              <el-button
                size="mini"
                type="text"
              >删除</el-button>
              <el-button
                v-if="+row.islock === 2"
                type="text"
                size="mini"
              >更改审计组</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="审计评价" name="fourth">审计评价</el-tab-pane>
    </el-tabs>
    <el-dialog
      title="添加成员"
      :visible.sync="memDialigVisible"
      width="1000px"
      center>
       <el-form :inline="true">
        <el-form-item label="机构类型">
          <el-select
            v-model="listQuery.type"
            placeholder="请选择"
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(idx, item) in selectConfig.type" :key="item" :value="item" :label="idx" />
          </el-select>
        </el-form-item>
        <el-form-item label="工作状态">
          <el-select
            v-model="listQuery.jobstatus"
            placeholder="请选择"
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(idx, item) in memStatusMap" :key="item" :value="item" :label="idx" />
          </el-select>
        </el-form-item>
        <el-button
          class="filter-item"
          type="primary"
          @click="queryUserList"
        >查询</el-button>
        <el-button
          class="filter-item"
          @click="handleResetFilter"
        >重置</el-button>
      </el-form>
      <el-table
        border
        :data="userList"
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="人员ID" align="center" prop="pid" show-overflow-tooltip />
        <el-table-column label="成员姓名" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip />
        <el-table-column label="机构类型" prop="type" align="center" show-overflow-tooltip />
        <el-table-column label="所属市县" align="center" prop="department" show-overflow-tooltip />
        <el-table-column label="工作状态" align="center" prop="isjob" show-overflow-tooltip />
        <el-table-column label="在途项目" align="center" prop="projectnum" />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="{row}">
            <el-button
              size="mini"
              type="text"
            >人员分析</el-button>
            <el-button
              v-if="row.islock === '未锁定'"
              type="text"
              size="mini"
              @click="handleAuditAdd(row)"
            >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="listQuery.page"
        :limit.sync="listQuery.length"
        @pagination="queryUserList"
      />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="memDialigVisible = false">取 消</el-button>
        <el-button type="primary" @click="memDialigVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </el-card>
</template>

<script>
import Pagination from '@/components/Pagination'
import { props, statusMap, operateMap, stsMap, auditStatusMap, auditOptMap, roleMap, memStatusMap } from './config'
import { parseTime } from '@/utils'
import { getDetail, updateAuditInfo, updateStatus, updateAuditStatus, unlock, updateRole, auditDelete, getUserList, auditAdd } from '@/api/project'
const query = {
  page: 1,
  length: 10,
  jobstatus: '1',
  type: '3',
  isinternal: 2,
  ismedium: 2
}
export default {
  data() {
    return {
      detail: {
        head: {
          projectnum: ''
        },
        basic: {
          projdesc: ''
        },
        auditgroup: {}
      },
      basicForm: {
        projstart: '',
        projauditcontent: ''
      },
      basicEditing: false,
      props: props,
      statusMap: statusMap,
      operateMap: operateMap,
      stsMap: stsMap,
      activeName: 'first',
      selectConfig: this.$store.getters.userSelectConfig,
      memDialigVisible: false,
      roleDialogVisible: false,
      auditStatusMap: auditStatusMap,
      auditOptMap: auditOptMap,
      roleMap: roleMap,
      memStatusMap: memStatusMap,
      currentGroudId: '',
      roleForm: {
        id: '',
        pid: '',
        role: ''
      },
      total: 0,
      listQuery: Object.assign({}, query),
      userList: []
    }
  },
  components: {
    Pagination
  },
  computed: {
    projectId() {
      return this.$route.params.id
    }
  },
  created() {
    this.queryDetail()
  },
  methods: {
    queryDetail() {
      getDetail({
        id: this.projectId
      }).then(res => {
        this.detail = res.data
        const item = JSON.parse(res.data.head['projtype'])
        this.detail.head.projtype = item.length > 0 ? item.join('/') : ''
        this.basicForm.projstart = this.detail.basic.projstart
        this.basicForm.projauditcontent = this.detail.basic.projauditcontent
      })
    },
    handleSaveBasic() {
      this.$refs['auditInfoForm'].validate(valid => {
        if (valid) {
          const { basicForm, projectId } = this
          const params = {
            id: projectId,
            projstart: Math.floor(new Date(basicForm.projstart).getTime() / 1000),
            projauditcontent: basicForm.projauditcontent
          }
          updateAuditInfo(params).then(res => {
            this.detail.basic.projstart = parseTime(basicForm.projstart, '{y}-{m}-{d}')
            this.detail.basic.projauditcontent = basicForm.projauditcontent
            this.$message.success('修改成功')
            this.basicEditing = false
          })
        }
      })
    },
    changeStatus() {
      const status = this.detail.basic.projectstatus
      updateStatus({
        operate: +status + 1,
        id: this.projectId
      }).then(res => {
        this.$message.success('操作成功')
        this.detail.basic.projectstatus = String(+this.detail.basic.projectstatus + 1)
      })
    },
    changeAuditStatus(opt, id) {
      updateAuditStatus({
        id: id,
        operate: opt
      }).then(res => {
        this.$message.success('操作成功')
      })
    },
    handleShowRole(row, id) {
      this.roleForm.pid = row.pid
      this.roleForm.id = id
      this.roleDialogVisible = true
    },
    handleUnlock(row, id) {
      unlock({
        pid: row.pid,
        id: id
      }).then(res => {
        this.$message.success('解锁成功')
      })
    },
    handleUpdateRole() {
      const { roleForm } = this
      updateRole(roleForm).then(res => {
        this.$message.success('修改成功')
      })
    },
    handleAuditDelete(row, id) {
      auditDelete({
        pid: row.pid,
        id: id
      }).then(res => {
        this.$message.success('删除成功')
      })
    },
    closeRoleDialog() {
      this.$refs['roleForm'].resetFields()
    },
    queryUserList() {
      const params = Object.assign({}, this.listQuery)
      getUserList(params).then(res => {
        this.userList = res.data.list || []
        this.total = +res.data.total || 0
      })
    },
    handleAdd(id = '') {
      if (id) {
        this.currentGroudId = id
      }
      this.memDialigVisible = true
      this.queryUserList()
    },
    handleAuditAdd(row) {
      auditAdd({
        id: this.currentGroudId,
        pid: row.pid
      }).then(res => {
        this.$message.success('添加成功')
      })
    },
    handleResetFilter() {
      this.listQuery = Object.assign({}, query)
    }
  }
}
</script>
<style lang="scss">
.project-detail-box{
  height: 100%;
  margin: 20px;
  .title{
    display: flex;
    div {
      line-height: 61px;
      margin-left: 20px;
      .status-btn {
        &-1 {
          color: #fff;
          background: rgba(153, 0, 204, 1);
          border-color: rgba(153, 0, 204, 1);
        }
        &-2 {
          color: #fff;
          background: rgba(0, 153, 0, 0.847058823529412);
          border-color: rgba(0, 153, 0, 0.847058823529412);
        }
        &-3 {
          color: #fff;
          background: rgba(255, 204, 0, 0.847058823529412);
          border-color: rgba(255, 204, 0, 0.847058823529412);
        }
      }
    }
  }
  .el-card__header{
    padding: 0 20px !important;
  }
  .head-box{
    display: flex;
    .basic-box{
      font-size: 14px;
      width: calc(100% - 250px);
      &-col{
        padding: 10px 0;
      }
      &-label{
        font-weight: bold
      }
    }
    .tag-box{
      width: 240px;
      &-label{
        margin-bottom: 10px;
      }
      &-value{
        font-size: 20px;
      }
    }
  }
  .basic-right-btn {
    float: right;
  }
}
</style>

<template>
  <el-card class="project-detail-box">
    <div slot="header" class="clearfix title">
      <h4>项目{{ detail.basic.projectname || '详情' }}</h4>
      <div>
        <el-button
          size="mini"
          type="primary"
          @click="$router.push(`/project/edit/${projectId}`)"
        >项目计划编辑</el-button>
        <el-button
          v-if="+detail.basic.projectstatus >= 0 && +detail.basic.projectstatus < 4"
          size="mini"
          :class="`status-btn-${+detail.basic.projectstatus + 1}`"
          @click="changeStatus"
        >{{ operateMap[+detail.basic.projectstatus + 1] }}</el-button>
      </div>
    </div>
    <div class="head-box">
      <el-row class="basic-box">
        <el-col v-for="(item, key) in props" :key="key" :span="6" class="basic-box-col">
          <span class="basic-box-label">{{ item.label }}:</span>
          <span class="basic-box-value">{{ (detail.head[item.value] || '') + (item.append || '') }}</span>
        </el-col>
      </el-row>
      <div class="tag-box">
        <div class="tag-box-label">项目阶段</div>
        <div class="tag-box-value">{{ statusMap[detail.basic.projectstatus] }}</div>
      </div>
    </div>
    <el-divider />
    <el-tabs v-model="activeName" @tab-click="changeTab">
      <el-tab-pane label="基本信息" name="first">
        <el-form ref="auditInfoForm" :model="basicForm" label-width="90px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="项目描述:">
                <span>{{ detail.basic.projdesc || '' }}</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider />
          <el-row>
            <el-col :span="16">
              <el-form-item
                label="开始时间:"
                prop="projstart"
                :rules="[{
                  required: true,
                  message: '请选择开始时间'
                }]"
              >
                <span v-if="!basicEditing">{{ detail.basic.projstart || '待编辑' }}</span>
                <el-date-picker v-else v-model="basicForm.projstart" type="date" placeholder="请选择" />
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button
                v-if="!basicEditing"
                type="danger"
                class="basic-right-btn"
                @click="basicEditing = true"
              >编辑</el-button>
              <div v-else class="basic-right-btn">
                <el-button type="info" @click="basicEditing = false">取消</el-button>
                <el-button type="primary" class="basic-right-btn" @click="handleSaveBasic">保存</el-button>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item
                label="审计内容:"
                prop="projauditcontent"
                :rules="[{
                  required: true,
                  message: '请输入审计内容'
                }]"
              >
                <div v-if="!basicEditing">{{ detail.basic.projauditcontent || '待编辑' }}</div>
                <el-input v-else v-model="basicForm.projauditcontent" type="textarea" :rows="6" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="审计组" name="second">
        <div style="display:flex">
          <div style="width: 140px;vertical-align: middle;line-height: 112px;">需要第三方人员：</div>
          <div style="flex: 1">
            <div style="margin: 10px;line-height: 28px;">
              <el-radio v-model="needThird" :label="1" @change="changeNeedThird">中介机构</el-radio>
              <span style="font-weight: bold; font-size:14px;">
                中介审核：
                {{ detail.auditgroup.medium ? (listQuery.ismedium === 1 && showVerify ? stsMap[detail.auditgroup.medium + 1] : stsMap[detail.auditgroup.medium]) : '-' }}
              </span>
              <el-button
                v-if="detail.auditgroup.medium && listQuery.ismedium === 1 && showVerify"
                type="danger"
                style="margin-left: 20px"
                size="mini"
                @click="handleVerify"
              >提交审核</el-button>
            </div>
            <el-divider style="margin: 0" />
            <div style="margin: 10px; line-height: 28px;">
              <el-radio v-model="needThird" :label="2" @change="changeNeedThird">内审机构</el-radio>
              <span style="font-weight: bold;font-size:14px;">
                内审审核：
                {{ detail.auditgroup.internal ? (listQuery.isinternal === 1 && showVerify ? stsMap[detail.auditgroup.internal + 1] : stsMap[detail.auditgroup.internal]) : '-' }}
              </span>
              <el-button
                v-if="detail.auditgroup.internal && listQuery.isinternal === 1 && showVerify"
                type="danger"
                style="margin-left: 20px"
                size="mini"
                @click="handleVerify"
              >提交审核</el-button>
            </div>
          </div>
        </div>
        <el-divider />
        <div v-for="(item, idx) in detail.auditgroup.list" :key="idx">
          <div style="display: flex;justify-content: space-between;">
            <h3>审计组{{ idx + 1 }}</h3>
            <div>
              <h4>审计状态</h4>
              <span>{{ auditStatusMap[+item.status] || '-' }}</span>
            </div>
          </div>
          <div>
            <el-button type="primary" @click="handleAdd(item.id)">新增人员</el-button>
            <el-button
              v-if="item.operate && +detail.basic.projectstatus >= 2"
              :type="[1, 3].includes(item.operate) ? `success` : 'danger'"
              @click="changeAuditStatus(item.operate, item.id)"
            >{{ auditOptMap[item.operate] }}</el-button>
          </div>
          <div style="margin-top: 20px;">
            <el-table border :data="item.group || []" highlight-current-row style="width: 100%">
              <el-table-column label="成员ID" align="center" prop="pid" />
              <el-table-column label="成员姓名" align="center" prop="name" />
              <el-table-column label="性别" align="center" prop="roletype">
                <template slot-scope="{row}">{{ selectConfig.sex[row.sex] }}</template>
              </el-table-column>
              <el-table-column label="机构类型" prop="projorgan" align="center">
                <template slot-scope="{row}">{{ selectConfig.type[row.type] }}</template>
              </el-table-column>
              <el-table-column label="所属市县" align="center" prop="location">
                <template slot-scope="{row}">
                  {{ formatArea(row.location) }}
                </template>
              </el-table-column>
              <el-table-column label="项目角色" align="center" prop="role">
                <template slot-scope="{row}">{{ roleMap[row.role] }}</template>
              </el-table-column>
              <el-table-column label="操作" align="center" width="300">
                <template slot-scope="{row}" v-if="+detail.basic.projectstatus >= 0">
                  <el-button size="mini" type="text" @click="handleAuditDelete(row, item.id)" v-if="+row.role !== 1">删除</el-button>
                  <el-button type="text" size="mini" @click="handleShowRole(row, item.id)" v-if="+row.role !== 1 && +row.type === 3">更改角色</el-button>
                  <el-button
                    v-if="+row.islock === 2"
                    type="text"
                    size="mini"
                    @click="handleUnlock(row, item.id)"
                  >解锁</el-button>
                </template>
                <template v-else>
                  -
                </template>
              </el-table-column>
            </el-table>
          </div>
          <el-divider v-if="(idx + 1) < detail.auditgroup.list.length" />
        </div>
        <el-dialog
          title="修改角色"
          :visible.sync="roleDialogVisible"
          width="500px"
          center
          @close="closeRoleDialog"
        >
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
      <el-tab-pane v-if="detail.basic.projectstatus > 2" label="审理成员" name="third">
        <div style="margin-bottom: 20px">
          <el-button type="primary" @click="handleAdd">新增人员</el-button>
        </div>
        <el-table :data="reviewUserList" border highlight-current-row style="width: 100%">
          <el-table-column label="成员ID" align="center" prop="pid" show-overflow-tooltip />
          <el-table-column label="成员姓名" align="center" prop="name" show-overflow-tooltip />
          <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip />
          <el-table-column label="所属部门" prop="department" align="center" show-overflow-tooltip />
          <el-table-column label="所属市县" align="center" prop="location" show-overflow-tooltip>
            <template slot-scope="{row}">
              {{ formatArea(row.location) }}
            </template>
          </el-table-column>
          <el-table-column label="审计组" align="center" prop="group" />
          <el-table-column label="操作" align="center">
            <template slot-scope="{row}">
              <el-button size="mini" type="text" @click="handleUnbindJude(row)">解除</el-button>
              <el-button type="text" size="mini" @click="handleGroup(row)">更改审计组</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane v-if="detail.basic.projectstatus > 2" label="审计评价" name="fourth">
        <evaluation :project-id="projectId"></evaluation>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      title="添加成员"
      :visible.sync="memDialigVisible"
      width="1000px"
      top="8vh"
      center
      @closed="closeAuditAddDialog"
    >
      <el-form :inline="true" size="small">
        <!-- <el-form-item label="机构类型">
          <el-select
            v-model="listQuery.type"
            placeholder="请选择"
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(idx, item) in selectConfig.type" :key="item" :value="item" :label="idx" />
          </el-select>
        </el-form-item> -->
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
        <el-form-item label="性别" prop="sex">
          <el-select
            v-model="listQuery.sex"
            placeholder="请选择"
            clearable
            filterable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(value, name) in selectConfig.sex" :key="name" :label="value" :value="+name" />
          </el-select>
        </el-form-item>
        <el-form-item label="所属市县" prop="location">
          <el-cascader
            v-model="listQuery.location"
            placeholder="请选择"
            :props="{ checkStrictly: true }"
            clearable
            style="width: 300px"
            class="filter-item"
            :options="districts"
          />
        </el-form-item>
        <el-form-item label="学历" prop="education">
          <el-select
            v-model="listQuery.education"
            placeholder="请选择"
            clearable
            filterable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(value, name) in selectConfig.education" :key="name" :label="value" :value="+name" />
          </el-select>
        </el-form-item>
        <el-form-item label="职称" prop="techtitle">
          <el-select
            v-model="listQuery.techtitle"
            placeholder="请选择"
            clearable
            filterable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(value, name) in selectConfig.techtitle" :key="name" :label="value" :value="+name" />
          </el-select>
        </el-form-item>
        <el-form-item label="职务" prop="position">
          <el-select
            v-model="listQuery.position"
            placeholder="请选择"
            clearable
            filterable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(value, name) in selectConfig.position" :key="name" :label="value" :value="+name" />
          </el-select>
        </el-form-item>
        <el-form-item label="审计特长" prop="expertise">
          <el-select
            v-model="listQuery.expertise"
            placeholder="请选择"
            clearable
            filterable
            style="width: 150px"
            class="filter-item"
          >
            <el-option v-for="(value, name) in selectConfig.expertise" :key="name" :label="value" :value="+name" />
          </el-select>
        </el-form-item>
        <el-form-item label="名字">
          <el-input v-model="listQuery.keyname" placeholder="请输入名字"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="filter-item" type="primary" @click="queryUserList" size="small">查询</el-button>
          <el-button class="filter-item" @click="handleResetFilter" size="small">重置</el-button>
        </el-form-item>
      </el-form>
      <el-table border :data="userList" highlight-current-row height="500px" style="width: 100%;">
        <el-table-column label="人员ID" align="center" prop="pid" show-overflow-tooltip />
        <el-table-column label="成员姓名" align="center" prop="name" show-overflow-tooltip />
        <el-table-column label="性别" align="center" prop="sex" show-overflow-tooltip />
        <el-table-column label="机构类型" prop="type" align="center" show-overflow-tooltip>
          <template slot-scope="{ row }">
            {{ selectConfig.type[+row.type] }}
          </template>
        </el-table-column>
        <el-table-column label="所属市县" width="200px" align="center" prop="department" show-overflow-tooltip>
          <template slot-scope="{row}">
            {{ formatArea(row.location) }}
          </template>
        </el-table-column>
        <el-table-column label="工作状态" align="center" prop="isjob" show-overflow-tooltip />
        <el-table-column label="兼办项目" align="center" prop="projectnum" />
        <el-table-column label="操作" align="center">
          <template slot-scope="{row}">
            <!-- <el-button
              size="mini"
              type="text"
            >人员分析</el-button>-->
            <el-button
              v-if="activeName === 'second'"
              type="text"
              size="mini"
              :class="{
                'delete-row-class': addUser.indexOf(row.id) > -1
              }"
              @click="handleAuditOpt(row)"
            >{{ addUser.indexOf(row.id) > -1 || row.curType ? '解除' : '添加' }}</el-button>
            <el-button
              v-if="activeName === 'third'"
              type="text"
              size="mini"
              @click="handleAddJuge(row)"
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
        style="padding: 0"
      />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="memDialigVisible = false">取 消</el-button>
        <el-button type="primary" @click="memDialigVisible = false">确 定</el-button>
      </span>-->
    </el-dialog>
    <el-dialog
      title="更改审计组"
      :visible.sync="auditGroupVisible"
      width="500px"
      center
      @close="closeGroupDialog"
    >
      <el-form ref="groupForm" :model="groupForm">
        <el-form-item
          label="审计组"
          label-width="100px"
          prop="groupids"
          :rules="[{
            required: true,
            message: '请选择审计组'
          }]"
        >
          <el-select v-model="groupForm.groupids" multiple style="width: 100%;">
            <el-option v-for="(item, idx) in groupList" :key="item" :value="idx + 1" :label="`审计组${idx + 1}`"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="auditGroupVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleChangeGroup">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      title="填写审理人数"
      :visible.sync="auditDialogVisible"
      width="500px"
      center
      @close="closeAuditDialog"
    >
      <el-form ref="auditForm" :model="auditForm">
        <el-form-item
          label="审理人数"
          label-width="100px"
          prop="people"
          :rules="[{
            required: true,
            message: '请填写审理人数'
          }]"
        >
          <el-input v-model="auditForm.people" type="number" />
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
import Pagination from "@/components/Pagination"
import Evaluation from './components/Evaluation'
import {
  props,
  statusMap,
  operateMap,
  stsMap,
  auditStatusMap,
  auditOptMap,
  roleMap,
  memStatusMap
} from "./config"
import { parseTime } from "@/utils"
import {
  getDetail,
  updateAuditInfo,
  infoList,
  updateStatus,
  updateAuditStatus,
  unlock,
  updateRole,
  auditDelete,
  getUserList,
  auditAdd,
  reviewAdd,
  reviewList,
  jugeBind,
  judeUnbind,
  changeGroup,
  getAuditGroups
} from "@/api/project"
import { CodeToText, regionData } from '@/utils/china-area'
const query = {
  page: 1,
  length: 10,
  jobstatus: "",
  expertise: null,
  sex: null,
  education: null,
  position: null,
  techtitle: null,
  location: null,
  isinternal: 2,
  ismedium: 2,
  keyname: null,
  // query: "",
  type: ""
}
export default {
  components: {
    Pagination,
    Evaluation
  },
  data() {
    return {
      districts: regionData,
      detail: {
        head: {
          projectnum: ""
        },
        basic: {
          projdesc: ""
        },
        auditgroup: {}
      },
      basicForm: {
        projstart: "",
        projauditcontent: ""
      },
      basicEditing: false,
      props: props,
      statusMap: statusMap,
      operateMap: operateMap,
      stsMap: stsMap,
      activeName: "first",
      selectConfig: this.$store.getters.userSelectConfig,
      memDialigVisible: false,
      roleDialogVisible: false,
      auditStatusMap: auditStatusMap,
      auditOptMap: auditOptMap,
      roleMap: roleMap,
      memStatusMap: memStatusMap,
      currentGroudId: "",
      roleForm: {
        id: "",
        pid: "",
        role: ""
      },
      total: 0,
      listQuery: Object.assign({}, query),
      userList: [],
      copyUserList: [],
      auditDialogVisible: false,
      auditForm: {
        people: ""
      },
      showVerify: false,
      addUser: [],
      reviewUserList: [],
      reviewQuery: {
        page_size: 10,
        page: 1
      },
      reviewTotal: 0,
      needThird: 0,
      groupRow: {},
      auditGroupVisible: false,
      groupForm: {
        groupids: []
      },
      groupList: []
    }
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
    formatArea(val) {
      if (!val) return
      const areaCode = val.split(',')
      const areas = []
      areaCode.forEach(row => {
        areas.push(CodeToText[row])
      })
      return areas.join('/')
    },
    changeTab() {
      if (this.activeName === "third") {
        this.queryReviewUserList()
      }
      if (this.activeName === "second") {
        this.getInfoList()
      }
    },
    queryDetail() {
      getDetail({
        id: this.projectId
      }).then(res => {
        this.detail.head = res.data.head
        this.detail.basic = res.data.basic
        const item = JSON.parse(res.data.head["projtype"])
        this.detail.head.projtype = item.length > 0 ? item.join("/") : ""
        this.basicForm.projstart = this.detail.basic.projstart
        this.basicForm.projauditcontent = this.detail.basic.projauditcontent
      })
    },
    getInfoList() {
      infoList({
        id: this.projectId
      }).then(res => {
        this.detail.auditgroup = res.data.auditgroup || {}
      })
    },
    queryReviewUserList() {
      const params = Object.assign(
        {
          id: this.projectId
        },
        this.reviewQuery
      )
      reviewList(params).then(res => {
        this.reviewTotal = +res.data.total || 0
        this.reviewUserList = res.data.list
      })
    },
    handleSaveBasic() {
      this.$refs["auditInfoForm"].validate(valid => {
        if (valid) {
          const { basicForm, projectId } = this
          const params = {
            id: projectId,
            projstart: Math.floor(
              new Date(basicForm.projstart).getTime() / 1000
            ),
            projauditcontent: basicForm.projauditcontent
          }
          updateAuditInfo(params).then(res => {
            this.detail.basic.projstart = parseTime(
              basicForm.projstart,
              "{y}-{m}-{d}"
            )
            this.detail.basic.projauditcontent = basicForm.projauditcontent
            this.$message.success("修改成功")
            this.basicEditing = false
          })
        }
      })
    },
    changeStatus() {
      const status = this.detail.basic.projectstatus
      if (+status + 1 === 3) {
        this.auditDialogVisible = true
      } else {
        this.handleChangeStatus()
      }
    },
    handleChangeStatus() {
      const status = this.detail.basic.projectstatus
      const params = {
        operate: +status + 1,
        id: this.projectId
      }
      if (+params.operate === 3) {
        params.num = this.auditForm.people
      }
      updateStatus(params).then(res => {
        this.$message.success("操作成功")
        this.auditDialogVisible = false
        this.detail.basic.projectstatus = String(
          +this.detail.basic.projectstatus + 1
        )
        this.queryDetail()
      })
    },
    changeAuditStatus(opt, id) {
      updateAuditStatus({
        id: id,
        operate: opt
      }).then(res => {
        this.$message.success("操作成功")
        this.getInfoList()
        if (+opt === 6) {
          this.queryDetail()
        }
      })
    },
    handleShowRole(row, id) {
      this.roleForm.pid = row.id
      this.roleForm.id = id
      this.roleDialogVisible = true
    },
    handleUnlock(row, id) {
      unlock({
        pid: row.id,
        id: id
      }).then(res => {
        this.$message.success("解锁成功")
        this.getInfoList()
      })
    },
    handleUpdateRole() {
      this.$refs["roleForm"].validate(valid => {
        if (valid) {
          const { roleForm } = this
          updateRole(roleForm).then(res => {
            this.$message.success("修改成功")
            this.roleDialogVisible = false
            this.getInfoList()
          })
        }
      })
    },
    handleAuditDelete(row, id) {
      auditDelete({
        pid: row.id,
        id: id
      }).then(res => {
        this.$message.success("删除成功")
        this.getInfoList()
      })
    },
    closeRoleDialog() {
      this.$refs["roleForm"].resetFields()
    },
    closeAuditDialog() {
      this.$refs["auditForm"].resetFields()
    },
    closeGroupDialog() {
      this.$refs['groupForm'].resetFields()
    },
    queryUserList() {
      const { listQuery } = this
      const params = Object.assign({}, listQuery)
      let organType = [3]
      if (params.isinternal === 1) {
        organType.push(2)
        // delete params.isinternal
      }
      if (params.ismedium === 1) {
        organType.push(1)
        // delete params.ismedium
      }
      params.organType = organType.join()
      getUserList(params).then(res => {
        this.copyUserList = res.data.list || []
        this.userList = res.data.list || []
        this.total = +res.data.total || 0
      })
    },
    handleAdd(id = "") {
      if (id) {
        if (this.currentGroudI !== id) {
          this.addUser = []
          this.showVerify = false
        }
        this.currentGroudId = id
      }
      this.memDialigVisible = true
      this.queryUserList()
    },
    handleAuditOpt(row) {
      if (+row.type === 3) {
        if (row.curType) {
          this.handleAuditDelete(row, this.currentGroudId)
          this.$delete(row, 'curType')
        } else {
          auditAdd({
            id: this.currentGroudId,
            pid: row.id
          }).then(res => {
            this.$message.success("添加成功")
            this.$set(row, 'curType', 1)
            // row.curType = 1
          })
        }
      } else {
        const idx = this.addUser.indexOf(row.id)
        if (idx > -1) {
          this.addUser.splice(idx)
        } else {
          this.addUser.push(row.id)
        }
      }
    },
    handleResetFilter() {
      const { listQuery } = this
      this.listQuery = Object.assign({}, query, {
        isinternal: listQuery.isinternal,
        ismedium: listQuery.ismedium
      })
      this.queryUserList()
    },
    handleAudit() {
      this.$refs["auditForm"].validate(valid => {
        if (valid) {
          this.handleChangeStatus()
        }
      })
    },
    handleGroup(row) {
      this.groupRow = row
      if (row.group && row.group !== "0") {
        this.groupForm.groupids = row.group.split(',') || []
      }
      getAuditGroups({
        projid: this.projectId
      }).then(res => {
        this.groupList = res.data
      })
      this.auditGroupVisible = true
    },
    handleChangeGroup() {
      this.$refs["groupForm"].validate(valid => {
        if (valid) {
          const g = this.groupForm.groupids.map(r => +r)
          const params = {
            groupids: g,
            projid: +this.projectId,
            pid: +this.groupRow.id
          }
          changeGroup(params).then(res => {
            this.queryReviewUserList()
            this.auditGroupVisible = false
            this.$message.success('操作成功')
          })
        }
      })
    },
    closeAuditAddDialog() {
      if (this.activeName === "second") {
        if (this.addUser.length > 0) {
          this.showVerify = true
        }
        this.getInfoList()
      }
      if (this.activeName === "third") {
        this.queryReviewUserList()
      }
    },
    changeNeedThird() {
      if (this.needThird === 1) {
        this.listQuery.ismedium = 1
        this.listQuery.isinternal = 2
      }
      if (this.needThird === 2) {
        this.listQuery.ismedium = 2
        this.listQuery.isinternal = 1
      }
      this.showVerify = false
      this.addUser = []
    },
    handleVerify() {
      const {
        addUser,
        currentGroudId,
        listQuery: { isinternal, ismedium }
      } = this
      if (addUser.length > 0) {
        let type
        if (isinternal === 1) {
          type = 2
        }
        if (ismedium === 1) {
          type = 1
        }
        reviewAdd({
          id: currentGroudId,
          pids: addUser.map(row => +row),
          type: type
        }).then(res => {
          this.needThird = 0
          this.listQuery.ismedium = 2
          this.listQuery.isinternal = 2
          this.addUser = []
          this.showVerify = false
          this.$message.success("提交成功")
          this.getInfoList()
        })
      }
    },
    handleAddJuge(row) {
      jugeBind({
        pid: row.id,
        projid: this.projectId
      }).then(res => {
        this.$message.success("添加成功")
      })
    },
    handleUnbindJude(row) {
      judeUnbind({
        pid: row.id,
        projid: this.projectId
      }).then(res => {
        this.$message.success("解除成功")
        this.queryReviewUserList()
      })
    }
  }
}
</script>
<style lang="scss">
.project-detail-box {
  height: 100%;
  margin: 20px;
  .title {
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
  .el-card__header {
    padding: 0 20px !important;
  }
  .head-box {
    display: flex;
    .basic-box {
      font-size: 14px;
      width: calc(100% - 170px);
      &-col {
        padding: 10px 0;
      }
      &-label {
        font-weight: bold;
      }
    }
    .tag-box {
      width: 160px;
      &-label {
        margin-bottom: 10px;
      }
      &-value {
        font-size: 20px;
      }
    }
  }
  .basic-right-btn {
    float: right;
  }
  .delete-row-class {
    color: #f56c6c;
  }
}
</style>

<template>
  <el-card class="project-detail-box">
    <div slot="header" class="clearfix">
      <h4>项目详情</h4>
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
        <div class="tag-box-value">实施阶段</div>
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
      <el-tab-pane label="审计组" name="second">审计组</el-tab-pane>
      <el-tab-pane label="审理成员" name="third">审理成员</el-tab-pane>
      <el-tab-pane label="审计评价" name="fourth">审计评价</el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script>
import { props } from './config'
import { parseTime } from '@/utils'
import { getDetail, updateAuditInfo } from '@/api/project'
export default {
  data() {
    return {
      detail: {
        head: {
          projectnum: ''
        },
        basic: {
          projdesc: ''
        }
      },
      basicForm: {
        projstart: '',
        projauditcontent: ''
      },
      basicEditing: false,
      props: props,
      activeName: 'first'
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
    queryDetail() {
      getDetail({
        id: this.projectId
      }).then(res => {
        this.detail = res.data
        const item = JSON.parse(res.data.head['projtype'])
        this.detail.head.projtype = item[0]
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
    }
  }
}
</script>
<style lang="scss">
.project-detail-box{
  height: 100%;
  margin: 20px;
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

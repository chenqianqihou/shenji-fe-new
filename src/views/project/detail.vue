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
        <el-form ref="form" label-width="80px">
          <el-row>
            <el-col :span="16">
              <el-form-item label="活动名称">
                <el-input type="textarea" :rows="6"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-divider></el-divider>
          <el-row>
            <el-col :span="16">
              <el-form-item label="活动名称">
                <el-input></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" style="float: right">保存</el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="16">
              <el-form-item label="活动名称">
                <el-input type="textarea" :rows="6"></el-input>
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
import { getDetail } from '@/api/project'
export default {
  data() {
    return {
      detail: {
        head: {
          projectnum: ''
        }
      },
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
}
</style>

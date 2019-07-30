<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>人员信息</span>
    </div>
    <div v-for="(items, key) in detailProps" :key="key">
      <div class="form-set-title">{{ tagList[key] }}</div>
      <el-row
        v-if="key === 'base'"
        :gutter="20"
        class="row-class"
      >
        <el-col style="width: 200px;">人员ID</el-col>
        <el-col
          :span="18"
        >
          <span>{{ detail.pid }}</span>
        </el-col>
      </el-row>
      <template v-for="(item, idx) in items">
        <el-row
          v-if="!item.depend || (+detail.type === 3 && item.force === 3) || (+detail.type !== 3 && item.not === 3)"
          :key="idx"
          :gutter="20"
          class="row-class"
        >
          <el-col style="width: 200px;">{{ item.label }}</el-col>
          <el-col
            :span="18"
          >
            <span v-if="item.value === 'location'">{{ formatArea(detail.location) }}</span>
            <span v-else-if="item.value === 'qualification'">{{ formatQualification(detail.qualification) }}</span>
            <span v-else-if="item.type === 'datepicker'">{{ formatDate(detail[item.value]) }}</span>
            <span v-else>{{ formatVal(item.value, detail[item.value]) }}</span>
          </el-col>
        </el-row>
      </template>
    </div>
  </el-card>
</template>

<script>
import { getUserDetail } from '@/api/user'
import { getOrgListByType } from '@/api/org'
import { tagList, props } from './config'
import { isArray, parseTime } from '@/utils/index'
import { CodeToText } from 'element-china-area-data'

export default {
  data() {
    return {
      detail: {},
      detailProps: props,
      tagList: tagList,
      selectConfig: this.$store.getters.userSelectConfig,
      organizationList: [],
      departmentList: []
    }
  },
  created() {
    this.queryDetail()
  },
  methods: {
    queryDetail() {
      getUserDetail({
        account: this.$route.params.id
      }).then(res => {
        this.detail = res.data
        this.queryOrgListByType()
        const certificateNo = this.detail.cardid
        this.certificateNoParse(
          certificateNo,
          certificateNo.length === 15 ? 14 : 16,
          certificateNo.length === 15 ? 2 : 4
        )
      })
    },
    queryOrgListByType() {
      const {
        detail: { type }
      } = this
      getOrgListByType({
        type
      }).then(res => {
        this.organizationList = res.data || []
        if (this.detail.organization) {
          this.detail.organization = +this.detail.organization
          this.changeOrgLabel()
        }
      })
    },
    changeOrgLabel() {
      const {
        detail: { organization }
      } = this
      const item = this.organizationList.find(
        row => row.id === +organization
      )
      this.$set(this.detail, 'organization', item['name'])
      this.departmentList =
        item.partment.map(row => {
          return {
            id: Object.keys(row)[0],
            name: Object.values(row)[0]
          }
        }) || []

      if (this.detail.department) {
        const row = this.departmentList.find(row => row.id === this.detail.department)
        this.$set(this.detail, 'department', row['name'])
      }
    },
    certificateNoParse(certificateNo, idxSexStart, birthYearSpan) {
      const year =
        (birthYearSpan === 2 ? '19' : '') +
        certificateNo.substr(6, birthYearSpan)
      const month = certificateNo.substr(6 + birthYearSpan, 2)
      const day = certificateNo.substr(8 + birthYearSpan, 2)
      this.detail.birthday = year + '-' + month + '-' + day

      const d = new Date() // 当然，在正式项目中，这里应该获取服务器的当前时间
      const monthFloor =
        d.getMonth() + 1 < parseInt(month, 10) ||
        (d.getMonth() + 1 === parseInt(month, 10) &&
          d.getDate() < parseInt(day, 10))
          ? 1
          : 0
      this.detail.age = d.getFullYear() - parseInt(year, 10) - monthFloor
    },
    formatVal(key, val) {
      const { selectConfig } = this
      if (selectConfig[key]) {
        if (isArray(val)) {
          const newVal = []
          val.forEach(row => {
            newVal.push(selectConfig[key][row])
          })
          return newVal.join()
        }
        return selectConfig[key][val]
      } else if (isArray(val)) {
        return val.join()
      }
      return val
    },
    formatQualification(val) {
      if (val && val.length > 0) {
        let fv = ''
        val.forEach(row => {
          fv += `${row.info}(${parseTime(row.time * 1000, '{y}-{m}')})/`
        })
        return fv
      }
      return '-'
    },
    formatDate(val) {
      return val ? parseTime(val * 1000, '{y}-{m}-{d}') : val
    },
    formatArea(val) {
      if (!val) return
      const areaCode = val.split(',')
      const areas = []
      areaCode.forEach(row => {
        areas.push(CodeToText[row])
      })
      return areas.join('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  .form-set-title {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .row-class {
    font-size: 14px;
    margin-bottom: 15px;
    text-indent: 2em;
  }
}
</style>

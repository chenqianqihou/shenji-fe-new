<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>人员信息</span>
    </div>
    <div v-for="(items, key) in detailProps" :key="key">
      <div class="form-set-title">{{ tagList[key] }}</div>
      <template v-for="(item, idx) in items">
        <el-row
          :key="idx"
          :gutter="20"
          class="row-class"
        >
          <el-col style="width: 240px;">{{ item.label }}</el-col>
          <el-col
            :span="18"
          >
            <template v-if="item.isAddress">{{ formatArea(item) }}</template>
            <template v-if="item.type === 'datepicker'">{{ formatDate(item) }}</template>
            <template v-else>{{ formatVal(item.value, detail[item.value]) }}</template>
          </el-col>
        </el-row>
      </template>
    </div>
  </el-card>
</template>

<script>
import { getOrgDetail } from '@/api/org'
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
      options: {
        otypeList: [],
        qualiauditList: [{
          value: 1,
          label: '已审核'
        }, {
          value: 2,
          label: '未审核'
        }]
      }
    }
  },
  created() {
    this.initData()
    this.queryDetail()
  },
  methods: {
    queryDetail() {
      getOrgDetail({
        account: this.$route.params.id
      }).then(res => {
        this.detail = Object.assign({}, res.data)
        const props = this.mixProps()
        props.forEach(row => {
          if (row.type === 'inputnumber' && row.depend) {
            if (typeof this.detail[row.depend] === 'undefined') {
              this.detail[row.depend] = 0
            }
            this.detail[row.depend] = this.detail[row.depend] + (+this.detail[row.value])
          }
        })
      })
    },

    formatVal(key, val) {
      const { options } = this
      if (options[`${key}List`] && val) {
        let row = options[`${key}List`].find(r => r.value === +val)
        return row.label || val
      }
      return val
    },
    formatArea(val) {
      const { detail } = this
      if (!val) return
      if (detail[val.value[0]]) {
        const areaCode = detail[val.value[0]].split(',')
        const areas = []
        areaCode.forEach(row => {
          areas.push(CodeToText[row])
        })
        return areas.join('') + detail[val.value[1]]
      }
      return detail[val]
    },
    formatDate(item) {
      const { detail } = this
      return parseTime(detail[item.value] * 1000, '{y}-{m}-{d}')
    },
    mixProps() {
      const { detailProps } = this
      let props = []
      Object.values(detailProps).forEach(items => (props = props.concat(items)))
      return props
    },
    initData() {
      const props = this.mixProps()
      const { selectConfig: { type } } = this
      Object.keys(type).forEach(key => {
        if (+key !== 3) {
          this.options.otypeList.push({
            value: +key,
            label: type[key]
          })
        }
      }) 
    }
  }
}
</script>

<style lang="scss" scoped>
.box-card {
  height: 100%;
  margin: 20px;
  font-size: 14px;
  .form-set-title {
    font-size: 20px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
  .row-class {
    margin-bottom: 15px;
    text-indent: 2em;
  }
}
</style>

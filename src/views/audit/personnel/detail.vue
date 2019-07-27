<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>人员信息</span>
    </div>
    <div v-for="(items, key) in detailProps" :key="key">
      <div class="form-set-title">{{tagList[key]}}</div>
        <template v-for="(item, idx) in items" >
          <el-row
            :gutter="20"
            :key="idx"
            class="row-class" 
            v-if="!item.depend || (detail.type === 3 && item.force === 3) || (detail.type !== 3 && item.not === 3)">
          <el-col style="width: 200px;">
            {{item.label}}
          </el-col>
          <el-col :span="18">
            {{item.value === 'qualification' ? formatQualification(detail.qualification) : formatVal(item.value, detail[item.value])}}
          </el-col>
        </el-row>
      </template>
    </div>
  </el-card>
</template>

<script>
import { getUserDetail } from '@/api/user'
import { tagList, props } from './config'
import { isArray, parseTime } from '@/utils/index'
import { regionData } from 'element-china-area-data'
export default {
  data() {
    return {
      detail: {},
      detailProps: props,
      tagList: tagList,
      selectConfig: this.$store.getters.userSelectConfig,
    }
  },
  methods: {
    queryDetail() {
      getUserDetail({
        account: this.$route.params.id
      }).then(res => {
        this.detail = res.data
        const certificateNo = this.detail.cardid
        this.certificateNoParse(certificateNo, certificateNo.length == 15 ? 14 : 16, certificateNo.length == 15 ? 2 : 4)
      })
    },
    certificateNoParse(certificateNo, idxSexStart, birthYearSpan){  
      const year = (birthYearSpan == 2 ? '19' : '') + certificateNo.substr(6, birthYearSpan)  
      const month = certificateNo.substr(6 + birthYearSpan, 2)
      const day = certificateNo.substr(8 + birthYearSpan, 2)
      this.detail.birthday = year + '-' + month + '-' + day
                        
      const d = new Date(); //当然，在正式项目中，这里应该获取服务器的当前时间  
      const monthFloor = ((d.getMonth()+1) < parseInt(month,10) || (d.getMonth()+1) == parseInt(month,10) && d.getDate() < parseInt(day,10)) ? 1 : 0
      this.detail.age = d.getFullYear() - parseInt(year,10) - monthFloor
    },
    formatVal(key, val) {
      let { selectConfig } = this
      if (selectConfig[key]) {
        if (isArray(val)) {
          let newVal = []
          val.forEach(row => {
            newVal.push(selectConfig[key][row])
          })
          return newVal.join()
        }
        return selectConfig[key][val]
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
    }
  },
  created() {
    this.queryDetail()
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
    .row-class{
      margin-bottom: 15px;
      text-indent: 2em;
    }
  }
</style>

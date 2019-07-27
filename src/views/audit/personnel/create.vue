<template>
  <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>新建人员</span>
      </div>
    <el-form ref="personnelForm" :model="form" label-width="120px">
      <div v-for="(items, key) in formProps" :key="key">
        <div class="form-set-title">{{ tagObj[key] }}</div>
        <el-row :gutter="20" v-for="item in items">
          <el-col :span="12">
            <template v-if="!!item.canplus && (+form[item.depend] === item.force || (item.not && form[item.depend] && +form[item.depend] !== item.not))">
              <el-form-item
                v-for="(dd, index) in form[item.value]"
                :label="index === 0 ? item.label : ''"
                :key="index"
                :prop="item.value">
                <div class="form-plus">
                  <template v-if="item.value === 'qualification'">
                    <el-input v-model="form[item.value][index].info" placeholder="专业技术资质"></el-input>
                    <el-date-picker
                      v-model="form[item.value][index].time"
                      type="month"
                      value-format="timestamp"
                      placeholder="获取专业技术资质日期">
                    </el-date-picker>
                  </template>
                  <template v-else>
                    <el-input v-model="form[item.value][index]"></el-input>
                  </template>
                  <el-button v-if="index === 0" @click="handleAddTrain(item.value)">添加</el-button>
                  <el-button v-else @click="handleDeleteTrain(item.value, index)">删除</el-button>
                </div>
              </el-form-item>
            </template>
            <el-form-item :label="item.label" :prop="item.value" v-else-if="!item.depend || +form[item.depend] === item.force || (item.not && form[item.depend] && +form[item.depend] !== item.not)" :rules="[{
              required: !!item.required,
              message: (!item.type ? '请输入' : '请选择') + item.label
            }].concat(item.validator ? item.validator : [])">
              <el-cascader
                :props="{ checkStrictly: true }"
                class="full-width"
                :options="districts"
                v-model="form.location"
                v-if="item.value === 'location'">
              </el-cascader>
              <el-select
                class="full-width"
                v-else-if="item.type === 'combobox'"
                :multiple="item.multi || false"
                v-model="form[item.value]"
                :collapse-tags="true"
                @change="handleChange(item.value)">
                <template v-if="selectConfig[item.value]">
                  <el-option v-for="(v, k, idx) in selectConfig[item.value]" :value="k" :label="v" :key="idx"></el-option>
                </template>
                <template v-else>
                  <el-option v-for="(v, idx) in options[`${item.value}List`]" :value="v.id" :label="v.name" :key="idx"></el-option>
                </template>
              </el-select>
              <el-date-picker
                class="full-width"
                v-else-if="item.type === 'datepicker'"
                v-model="form[item.value]"
                type="month"
                value-format="timestamp"
                placeholder="选择月">
              </el-date-picker>
              <el-input v-model="form[item.value]" v-else-if="['achievements', 'comment'].includes(item.value)" maxlength="200" show-word-limit></el-input>
              <el-input v-model="readonly[item.value]" readonly v-else-if="!!item.readonly"></el-input>
              <el-input v-model="form[item.value]" v-else @change="handleChangeInput(item.value)"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button>重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getOrgListByType } from '@/api/org'
import { createUser } from '@/api/user'
import { tagList, props } from './config'
import { isArray } from '@/utils/index'
import { regionData } from 'element-china-area-data'

const qualiArray = [{
  info: '',
  time: ''
}]

export default {
  data() {
    return {
      tagObj: tagList,
      formProps: props,
      form: {
        train: [''],
        qualification: qualiArray,
        sex: ''
      },
      readonly: {
        birthday: '',
        age: '',
      },
      selectConfig: this.$store.getters.userSelectConfig,
      districts: regionData,
      options: {
        organizationList: [],
        departmentList: []
      }
    }
  },
  methods: {
    handleAddTrain(item) {
      if (item === 'qualification') {
        this.form[item].push(Array.from(qualiArray))
      } else {
        this.form[item].push('')
      }
    },
    handleDeleteTrain(item, index) {
      this.form[item].splice(index, 1)
    },
    handleChange(v) {
      if (v === 'type') {
        if (this.form.organization) {
          this.form.organization = ''
        }
        this.formProps.job.forEach(row => {
          if (!!row.canplus) {
            if (row.value === 'qualification') {
              this.form[row.value] = qualiArray
            } else {
              this.form[row.value] = ['']
            }
          } else if ((row.force === 3 || row.not === 3) && this.form[row.value]) {
            this.form[row.value] = ''
          }
        })
        this.queryOrgListByType()
      }
      if (v === 'organization') {
        if (this.form.department) {
          this.form.department = ''
        }
        const { form: { organization } } = this
        const item = this.options.organizationList.find(row => row.id === organization)
        this.options.departmentList = item.partment.map(row => {
          return {
            id: Object.keys(row)[0],
            name: Object.values(row)[0]
          }
        }) || []
      }
    },
    handleChangeInput(v) {
      if (v === 'cardid') {
        const certificateNo = this.form.cardid
        if (!/^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/.test(certificateNo)) {
          return false
        }
        this.certificateNoParse(certificateNo, certificateNo.length == 15 ? 14 : 16, certificateNo.length == 15 ? 2 : 4)
      }
    },
    certificateNoParse(certificateNo, idxSexStart, birthYearSpan){  
      const idxSex = 1 - certificateNo.substr(idxSexStart, 1) % 2
      this.form.sex = idxSex === 1 ? '2' : '1'

      const year = (birthYearSpan == 2 ? '19' : '') + certificateNo.substr(6, birthYearSpan)  
      const month = certificateNo.substr(6 + birthYearSpan, 2)
      const day = certificateNo.substr(8 + birthYearSpan, 2)
      this.readonly.birthday = year + '-' + month + '-' + day
                        
      const d = new Date(); //当然，在正式项目中，这里应该获取服务器的当前时间  
      const monthFloor = ((d.getMonth()+1) < parseInt(month,10) || (d.getMonth()+1) == parseInt(month,10) && d.getDate() < parseInt(day,10)) ? 1 : 0
      this.readonly.age = d.getFullYear() - parseInt(year,10) - monthFloor
    },
    queryOrgListByType () {
      const { form: { type } } = this
      getOrgListByType({
        type
      }).then(res => {
        this.options.organizationList = res.data || []
      })
    },
    handleSubmit() {
      console.log(this.form)
      this.$refs['personnelForm'].validate((valid) => {
        if (valid) {
          const form = Object.assign({}, this.form)
          const props = this.mixProps()
          props.forEach(row => {
            // if (row.value !== 'qualification' && form[row.value] && isArray(form[row.value])) {
            //   form[row.value] = form[row.value].join()
            // }
            if (form.type !== 3) {
              delete form.train
            } else {
              delete form.qualification
            }
            if (!!row.isToString) {
              form[row.value] = form[row.value].join()
            }
            if (row.value === 'qualification' && form.qualification) {
              if (form[row.value][0].time) {
                form['qualification'].forEach(r => {
                  r.time = r.time / 1000
                })
              }
            }
            if (row.type === 'datepicker' && String(form[row.value]).length === 13) {
              form[row.value] = form[row.value] / 1000
            }
            if (form[row.value] && row.type === 'combobox' && !row.multi) {
              form[row.value] = +form[row.value]
            }
            if (row.multi) {
              form[row.value] = form[row.value].join()
            }
          })
          createUser(form).then(res => {
            this.$message.success('操作成功')
            this.$router.push('/audit/personnel')
          })
        }
      })
    },
    mixProps() {
      const { formProps } = this
      let props = []
      Object.values(formProps).forEach(items => props = props.concat(items))
      return props
    },
    initData() {
      const props = this.mixProps()
      props.forEach(row => {
        if (row.multi && !row.depend) {
          this.form[row.value] = []
        }
      })
    }
  },
  mounted() {
    this.initData()
  }
}
</script>

<style lang="scss" scoped>
  .box-card {
    height: 100%;
    margin: 20px;
    .form-set-title {
      font-size: 20px;
      margin-bottom: 20px;
    }
    .form-plus {
      display: flex;
      width: 100%;
      justify-content:space-between;
      .el-input {
        margin-right: 10px;
      }
    }
    .full-width {
      width: 100%;
    }
  }
</style>

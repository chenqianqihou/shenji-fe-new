<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ isEdit ? '编辑' : '新建' }}人员</span>
    </div>
    <el-form ref="personnelForm" :model="form" label-width="120px">
      <div v-for="(items, key) in formProps" :key="key">
        <div class="form-set-title">{{ tagObj[key] }}</div>
        <el-row v-for="(item, idx) in items" :key="idx" :gutter="20">
          <el-col :span="12">
            <template
              v-if="!!item.canplus && (+form[item.depend] === item.force || (item.not && form[item.depend] && +form[item.depend] !== item.not))"
            >
              <el-form-item
                v-for="(dd, idex) in form[item.value]"
                :key="idex"
                :label="idex === 0 ? item.label : ''"
              >
                <div class="form-plus">
                  <template v-if="item.value === 'qualification'">
                    <el-input v-model="form[item.value][idex].info" placeholder="专业技术资质" />
                    <el-date-picker
                      v-model="form[item.value][idex].time"
                      type="month"
                      value-format="timestamp"
                      placeholder="获取专业技术资质日期"
                    />
                  </template>
                  <template v-else>
                    <el-input v-model="form[item.value][idex]" />
                  </template>
                  <el-button v-if="idex === 0" @click="handleAddTrain(item.value)">添加</el-button>
                  <el-button v-else @click="handleDeleteTrain(item.value, idex)">删除</el-button>
                </div>
              </el-form-item>
            </template>
            <el-form-item
              v-else-if="!item.depend || +form[item.depend] === item.force || (item.not && form[item.depend] && +form[item.depend] !== item.not)"
              :label="item.label"
              :prop="item.value"
              :rules="[{
                required: !!item.required,
                message: (!item.type ? '请输入' : '请选择') + item.label
              }].concat(item.validator ? item.validator : [])"
            >
              <el-cascader
                v-if="item.value === 'location'"
                v-model="form.location"
                :props="{ checkStrictly: true }"
                class="full-width"
                :options="districts"
              />
              <el-select
                v-else-if="item.type === 'combobox'"
                v-model="form[item.value]"
                class="full-width"
                :disabled="(item.value === 'type' && !!isEdit) || item.disabled"
                :multiple="item.multi || false"
                :collapse-tags="true"
                @change="handleChange(item.value)"
              >
                <template v-if="selectConfig[item.value]">
                  <el-option
                    v-for="(v, k, indx) in selectConfig[item.value]"
                    :key="indx"
                    :value="k"
                    :label="v"
                  />
                </template>
                <template v-else>
                  <el-option
                    v-for="(v, index) in options[`${item.value}List`]"
                    :key="index"
                    :value="v.id"
                    :label="v.name"
                  />
                </template>
              </el-select>
              <el-date-picker
                v-else-if="item.type === 'datepicker'"
                v-model="form[item.value]"
                class="full-width"
                type="month"
                value-format="timestamp"
                placeholder="选择月"
              />
              <el-input
                v-else-if="['achievements', 'comment'].includes(item.value)"
                v-model="form[item.value]"
                maxlength="200"
                show-word-limit
              />
              <el-input v-else-if="!!item.readonly" v-model="readonly[item.value]" readonly />
              <el-input v-else v-model="form[item.value]" @change="handleChangeInput(item.value)" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="$router.push('/audit/personnel')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { getOrgListByType } from '@/api/org'
import { createUser, getUserDetail, updateUser } from '@/api/user'
import { tagList, props } from '../config'
// import { isArray } from '@/utils/index'
import { regionData } from 'element-china-area-data'

const qualiArray = [
  {
    info: '',
    time: ''
  }
]

export default {
  name: 'AddEdit',
  data() {
    return {
      tagObj: tagList,
      formProps: props,
      form: {
        role: []
      },
      readonly: {
        birthday: '',
        age: ''
      },
      selectConfig: this.$store.getters.userSelectConfig,
      districts: regionData,
      options: {
        organizationList: [],
        departmentList: []
      }
    }
  },
  computed: {
    isEdit() {
      return this.$route.params.id
    }
  },
  mounted() {
    this.initData()
    if (this.$route.params.id) {
      this.queryDetail()
    }
  },
  methods: {
    queryDetail() {
      getUserDetail({
        account: this.$route.params.id
      }).then(res => {
        const location = []
        const sourceLocation = res.data.location.split(',')
        sourceLocation.forEach(row => {
          location.push(row)
        })
        this.form = Object.assign({}, this.form, res.data, { location })
        if (this.form.workbegin) {
          this.form.workbegin *= 1000
        }
        if (+this.form.type === 3) {
          if (this.form.auditbegin) {
            this.form.auditbegin *= 1000
          }
          if (this.form.train.length === 0) {
            this.form.train = ['']
          }
        } else {
          if (this.form.qualification.length > 0) {
            this.form.qualification.forEach(row => {
              if (row.time) {
                row.time *= 1000
              }
            })
          } else {
            this.form.qualification.push(Array.from(qualiArray))
          }
        }
        this.queryOrgListByType()
        const certificateNo = this.form.cardid
        this.certificateNoParse(
          certificateNo,
          certificateNo.length === 15 ? 14 : 16,
          certificateNo.length === 15 ? 2 : 4
        )
      })
    },
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
          if (row.canplus) {
            if (row.value === 'qualification') {
              this.$set(this.form, row.value, Array.from(qualiArray))
            } else {
              this.form[row.value] = ['']
            }
          } else if (
            (row.force === 3 || row.not === 3) &&
            this.form[row.value]
          ) {
            this.form[row.value] = ''
          }
        })
        this.queryOrgListByType()
      }
      if (v === 'organization') {
        const {
          form: { organization }
        } = this
        const item = this.options.organizationList.find(
          row => row.id === organization
        )
        this.options.departmentList =
          item.partment.map(row => {
            return {
              id: Object.keys(row)[0],
              name: Object.values(row)[0]
            }
          }) || []

        if (this.form.department) {
          this.form.department = String(this.form.department)
        }
      }
    },
    handleChangeInput(v) {
      if (v === 'cardid') {
        const certificateNo = this.form.cardid
        if (
          !/^\d{6}(((19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}([0-9]|x|X))|(\d{2}(0[1-9]|1[0-2])(0[1-9]|[1-2][0-9]|3[0-1])\d{3}))$/.test(
            certificateNo
          )
        ) {
          return false
        }
        this.certificateNoParse(
          certificateNo,
          certificateNo.length === 15 ? 14 : 16,
          certificateNo.length === 15 ? 2 : 4
        )
      }
    },
    certificateNoParse(certificateNo, idxSexStart, birthYearSpan) {
      const idxSex = 1 - (certificateNo.substr(idxSexStart, 1) % 2)
      this.form.sex = idxSex === 1 ? '2' : '1'

      const year =
        (birthYearSpan === 2 ? '19' : '') +
        certificateNo.substr(6, birthYearSpan)
      const month = certificateNo.substr(6 + birthYearSpan, 2)
      const day = certificateNo.substr(8 + birthYearSpan, 2)
      this.readonly.birthday = year + '-' + month + '-' + day

      const d = new Date() // 当然，在正式项目中，这里应该获取服务器的当前时间
      const monthFloor =
        d.getMonth() + 1 < parseInt(month, 10) ||
        (d.getMonth() + 1 === parseInt(month, 10) &&
          d.getDate() < parseInt(day, 10))
          ? 1
          : 0
      this.readonly.age = d.getFullYear() - parseInt(year, 10) - monthFloor
    },
    queryOrgListByType() {
      const {
        form: { type }
      } = this
      getOrgListByType({
        type
      }).then(res => {
        this.options.organizationList = res.data || []
        if (this.form.organization) {
          this.form.organization = +this.form.organization
          this.handleChange('organization')
        }
      })
    },
    handleSubmit() {
      this.$refs['personnelForm'].validate(valid => {
        if (valid) {
          const form = Object.assign({}, this.form)
          const props = this.mixProps()
          props.forEach(row => {
            // if (row.value !== 'qualification' && form[row.value] && isArray(form[row.value])) {
            //   form[row.value] = form[row.value].join()
            // }
            if (form.type !== 3) {
              form.role = [8] // 非审计机关默认审计组员
              if (row.value === 'position2') {
                form.position = form.position2
                delete form.position2
              }
              delete form.train
            } else {
              delete form.qualification
            }
            if (row.isToString) {
              form[row.value] = form[row.value].join()
            }
            if (row.value === 'qualification' && form.qualification) {
              form.qualification = form.qualification.filter(row => row.info && row.time)
              if (form.qualification.length > 0) {
                form['qualification'].forEach(r => {
                  r.time = r.time / 1000
                })
              }
            }
            if (
              row.type === 'datepicker' &&
              String(form[row.value]).length === 13
            ) {
              form[row.value] = form[row.value] / 1000
            }
            if (form[row.value] && row.type === 'combobox' && !row.multi) {
              form[row.value] = +form[row.value]
            }
            if (row.multi && form[row.value]) {
              form[row.value] = form[row.value].join()
            }
          })
          let optMethod = createUser
          if (this.$route.params.id) {
            optMethod = updateUser
          }
          optMethod(form).then(res => {
            this.$message.success('操作成功')
            this.$router.push('/audit/personnel')
          })
        }
      })
    },
    mixProps() {
      const { formProps } = this
      let props = []
      Object.values(formProps).forEach(items => (props = props.concat(items)))
      return props
    },
    initData() {
      const props = this.mixProps()
      props.forEach(row => {
        if (row.multi && !row.depend && row.value !== 'role') {
          this.form[row.value] = []
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
  .form-set-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .form-plus {
    display: flex;
    width: 100%;
    justify-content: space-between;
    .el-input {
      margin-right: 10px;
    }
  }
  .full-width {
    width: 100%;
  }
}
</style>

<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>{{ isEdit ? '编辑' : '新建' }}机构</span>
    </div>
    <el-form ref="agencyForm" :model="form" status-icon>
      <div v-for="(items, key) in formProps" :key="key">
        <div class="form-set-title">{{ tagObj[key] }}</div>
        <el-row v-for="(item, idx) in items" :key="idx" :gutter="20">
          <el-col :span="12">
            <el-form-item
              v-if="item.isAddress"
              class="is-required"
              label-width="220px"
              :label="item.label"
              :prop="item.value[0]"
              :rules="[{ validator: validateAddress, trigger: 'blur' }]"
            >
              <el-cascader
                v-model="form[item.value[0]]"
                class="full-width cascader"
                :options="districts"
              />
              <el-input v-model="form[item.value[1]]" />
            </el-form-item>
            <el-form-item
              v-if="!item.isAddress"
              label-width="220px"
              :label="item.label"
              :prop="item.value"
              :rules="[{
                required: !!item.required,
                message: (!item.type ? '请输入' : '请选择') + item.label
              }].concat(item.validator ? item.validator : [])"
            >
              <el-select
                v-if="item.type === 'combobox'"
                v-model="form[item.value]"
                class="full-width"
                :disabled="isEdit && item.value === 'otype'"
                :multiple="item.multi || false"
                :collapse-tags="true"
              >
                <el-option
                  v-for="(v, index) in options[`${item.value}List`]"
                  :key="index"
                  :value="v.value"
                  :label="v.label"
                />
              </el-select>
              <el-date-picker
                v-else-if="item.type === 'datepicker'"
                v-model="form[item.value]"
                class="full-width"
                value-format="timestamp"
                placeholder="请选择"
              />
              <el-input-number v-else-if="item.type === 'inputnumber'" v-model="form[item.value]" controls-position="right" :min="0" @change="handleChangeNum(item.value, item.depend)" />
              <el-input v-else-if="!!item.sum" v-model="form[item.value]" readonly />
              <el-input v-else v-model="form[item.value]" :type="item.type==='number' ? 'number' : 'text'" />
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">提交</el-button>
        <el-button @click="$router.push('/audit/agency')">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import { createOrg, updateOrg, getOrgDetail } from '@/api/org'
import { tagList, props } from '../config'
// import { isArray } from '@/utils/index'
import { regionData } from 'element-china-area-data'

export default {
  name: 'AddEdit',
  data() {
    return {
      tagObj: tagList,
      formProps: props,
      form: {},
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
  computed: {
    isEdit() {
      return this.$route.params.id
    },
    districts() {
      const { form: { otype }} = this
      return +otype === 2 ? regionData.filter(row => +row.value === 520000) : regionData
    }
  },
  created() {
    this.initData()
    if (this.$route.params.id) {
      this.queryDetail()
    }
  },
  methods: {
    validateAddress(rule, value, callback) {
      if (value === '') {
        callback(new Error('请输入地址'))
      } else {
        callback()
      }
    },
    handleChangeNum(value, depend) {
      if (depend) {
        this.form[depend] = String(+this.form[depend] + this.form[value])
      }
    },
    queryDetail() {
      getOrgDetail({
        oid: this.$route.params.id
      }).then(res => {
        const props = this.mixProps()
        this.form = Object.assign({}, this.form, res.data, {
          oid: this.$route.params.id
        })
        props.forEach(row => {
          if (row.isAddress) {
            row.value.forEach((r, i) => {
              if (i === 0) {
                this.form[r] = this.form[r].split(',')
              }
            })
          }
          if (row.type === 'number') {
            this.form[row.value] = +this.form[row.value]
          }
          if (row.type === 'datepicker') {
            this.form[row.value] *= 1000
          }
          if (row.type === 'combobox') {
            this.form[row.value] = +this.form[row.value]
          }
          if (row.type === 'inputnumber' && row.depend) {
            this.form[row.depend] = String(+this.form[row.depend] + +this.form[row.value])
          }
        })
      })
    },
    handleSubmit() {
      this.$refs['agencyForm'].validate(valid => {
        if (valid) {
          const form = Object.assign({}, this.form)
          const props = this.mixProps()
          props.forEach(row => {
            if (
              row.type === 'datepicker' &&
              String(form[row.value]).length === 13
            ) {
              form[row.value] = form[row.value] / 1000
            }
            if (row.notSubmit) {
              delete form[row.value]
            }
            if (row.isAddress) {
              form[row.value[0]] = form[row.value[0]].join()
            }
          })
          let optMethod = createOrg
          if (this.$route.params.id) {
            optMethod = updateOrg
          }
          optMethod(form).then(res => {
            this.$message.success('操作成功')
            this.$router.push('/audit/agency')
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
      const { selectConfig: { type }} = this
      props.forEach(row => {
        if (row.isAddress) {
          this.form[row.value[0]] = ''
        }
        if (row.sum) {
          this.form[row.value] = ''
        }
      })
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
  .form-set-title {
    font-size: 20px;
    margin-bottom: 20px;
  }
  .el-input-number .el-input__inner{
    text-align: left !important;
  }
  .cascader{
    margin-bottom: 20px;
  }
  .full-width {
    width: 100%;
  }
}
</style>

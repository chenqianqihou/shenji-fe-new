const props = {
  first: [{
    value: 'otype',
    label: '机构类型',
    required: true,
    type: 'combobox'
  }],
  back: [{
    value: 'name',
    label: '机构名称',
    required: true
  }, {
    value: 'deputy',
    label: '法定代表人',
    required: true
  }, {
    value: 'regtime',
    label: '注册时间',
    type: 'datepicker',
    required: true
  }, {
    value: ['regnum', 'regaddress'],
    label: '注册地址',
    required: true,
    isAddress: true
  }, {
    value: 'category',
    label: '资质类别',
    required: true
  }, {
    value: 'level',
    label: '资质等级',
    required: true
  }, {
    value: 'capital',
    label: '注册资金（万元）',
    required: true,
    type: 'inputnumber',
    validator: [{
      type: 'number',
      message: '注册资金格式错误'
    }]
  }],
  base: [{
    value: 'workbegin',
    label: '开始从业日期',
    required: true,
    type: 'datepicker'
  }, {
    value: 'allCount1',
    label: '在册专业技术人员总数（人）',
    notSubmit: true,
    sum: ['costeng', 'coster', 'accountant'],
    type: 'input'
  }, {
    value: 'costeng',
    label: '造价工程师（人）',
    required: true,
    type: 'inputnumber',
    depend: 'allCount1'
  }, {
    value: 'coster',
    label: '造价师（人）',
    required: true,
    type: 'inputnumber',
    depend: 'allCount1'
  }, {
    value: 'accountant',
    label: '注册会计员（人）',
    required: true,
    type: 'inputnumber',
    depend: 'allCount1'
  }, {
    value: 'allCount2',
    notSubmit: true,
    sum: ['highlevel', 'midlevel'],
    label: '有职称人员总数（人）',
    type: 'input'
  }, {
    value: 'highlevel',
    label: '高级职称（人）',
    required: true,
    type: 'inputnumber',
    depend: 'allCount2'
  }, {
    value: 'midlevel',
    label: '中级职称（人）',
    required: true,
    type: 'inputnumber',
    depend: 'allCount2'
  }, {
    value: 'retiree',
    label: '聘请退休人员专业'
  }, {
    value: 'parttimers',
    label: '兼职专业人员'
  }],
  contact: [{
    value: 'contactor',
    label: '联系人',
    required: true
  }, {
    value: 'contactphone',
    label: '联系人电话',
    required: true,
    type: 'number'
  }, {
    value: 'contactnumber',
    label: '联系电话',
    required: true,
    type: 'number'
  }, {
    value: ['officenum', 'officeaddress'],
    label: '办公地址',
    isAddress: true,
    required: true
  }],
  review: [{
    value: 'qualiaudit',
    label: '资质审核',
    type: 'combobox',
    required: true
  }]
}

const tagList = {
  back: '公司背景',
  base: '基本信息',
  contact: '联系方式',
  review: '审核情况'
}

export {
  tagList,
  props
}
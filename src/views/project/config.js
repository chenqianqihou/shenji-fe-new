const props = {
  first: [{
    value: 'name',
    label: '项目名称',
    required: true
  }, {
    value: 'plantime',
    label: '项目时长',
    append: '天',
    required: true
  }, {
    value: 'projyear',
    label: '项目年度',
    type: 'combobox',
    required: true
  }, {
    value: 'projdesc',
    label: '项目描述',
    type: 'textarea',
    required: true
  }, {
    value: 'projorgan',
    label: '项目单位',
    type: 'combobox',
    required: true
  }, {
    value: 'leadorgan',
    label: '牵头业务部门',
    type: 'combobox',
    required: true
  }, {
    value: 'projtype',
    label: '项目类型',
    type: 'combobox',
    required: true
  }, {
    value: 'projlevel',
    label: '项目层级',
    type: 'combobox',
    required: true
  }, {
    label: '角色人数',
    children: [{
      value: 'leadernum',
      label: '审计组长',
      required: true
    }, {
      value: 'masternum',
      label: '主审',
      required: true
    }, {
      value: 'auditornum',
      label: '审计成员',
      required: true
    }]
  }]
}

export {
  props
}

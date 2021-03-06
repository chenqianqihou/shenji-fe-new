const props = [{
  value: 'projectnum',
  label: '项目编号'
}, {
  value: 'projyear',
  label: '项目年度'
}, {
  value: 'projtype',
  label: '项目类型'
}, {
  value: 'projlevel',
  label: '项目层级'
}, {
  value: 'projorgan',
  label: '项目单位'
}, {
  value: 'leadernum',
  label: '审计组长',
  append: '人'
}, {
  value: 'masternum',
  label: '主审',
  append: '人'
}, {
  value: 'auditornum',
  label: '审计成员',
  append: '人'
}, {
  value: 'leadorgan',
  label: '牵头业务部门'
}, {
  value: 'plantime',
  label: '项目时长',
  append: '天'
}]

const detailMemProps = [{
  value: 'name',
  label: '姓名'
}, {
  value: 'pid',
  label: '人员ID'
}, {
  value: 'projrole',
  label: '项目角色'
}, {
  value: 'typeName',
  label: '机构类型'
}, {
  value: 'organizationLabel',
  label: '所属机构'
}, {
  value: 'departmentLabel',
  label: '所属部门'
}, {
  value: 'locationName',
  label: '所属市县'
}]

const statusMap = {
  0: '计划阶段',
  1: '计划阶段',
  2: '实施阶段',
  3: '审理阶段',
  4: '报告阶段',
  5: '项目结束'
}

const operateMap = {
  1: '确认计划',
  2: '启动项目',
  3: '开始审理',
  4: '结束审理'
}

const stsMap = {
  1: '无需审核',
  2: '待提审',
  3: '待审核',
  4: '审核通过',
  5: '审核未通过'
}

const auditOptMap = {
  1: '进点',
  2: '实施结束',
  3: '开始审理',
  4: '结束审理',
  5: '开始报告',
  6: '报告结束'
}

const auditStatusMap = {
  1: '应进点',
  2: '该进点而未进点',
  3: '已进点',
  4: '该结束未结束',
  5: '实施结束',
  6: '审理中',
  7: '审理结束',
  8: '待报告',
  9: '报告中',
  10: '报告结束'
}

const roleMap = {
  1: '审计组长',
  2: '主审',
  3: '审计成员'
}

const memStatusMap = {
  1: '在点',
  2: '不在点'
}

const scoreMap = {
  0: '无需评分',
  1: '未评分',
  2: '已评分'
}

export {
  props,
  stsMap,
  statusMap,
  operateMap,
  auditOptMap,
  roleMap,
  auditStatusMap,
  memStatusMap,
  scoreMap,
  detailMemProps
}

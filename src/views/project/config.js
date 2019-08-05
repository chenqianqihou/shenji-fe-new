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

const statusMap = {
  1: '计划阶段',
  2: '实施阶段',
  3: '审理阶段',
  4: '报告阶段',
  5: '项目结束'
}

export {
  props,
  statusMap
}

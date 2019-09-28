import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/project/list',
    params
  })
}

export function deleteProject(data) {
  return request({
    url: '/project/delete',
    method: 'post',
    data
  })
}

export function selectConfig() {
  return request({
    url: '/project/listselect'
  })
}

export function selectList() {
  return request({
    url: '/project/selectconfig'
  })
}

export function createProject(data) {
  return request({
    url: '/project/create',
    method: 'post',
    data
  })
}

export function getProjectDetail(params) {
  return request({
    url: '/project/editinfo',
    method: 'get',
    params
  })
}

export function updateProject(data) {
  return request({
    url: '/project/update',
    method: 'post',
    data
  })
}

export function getDetail(params) {
  return request({
    url: '/project/info',
    method: 'get',
    params
  })
}

export function updateAuditInfo(data) {
  return request({
    url: '/project/auditinfo',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  let url = ''
  switch (data.operate) {
    case 1:
      url = '/project/sure'
      break
    case 2:
      url = '/project/begin'
      break
    case 3:
      url = '/project/judge'
      break
    case 4:
      url = '/project/finishJudge'
      break
  }
  return request({
    // url: '/project/updatestatus',
    url,
    method: 'post',
    data
  })
}

export function updateAuditStatus(data) {
  return request({
    url: '/auditgroup/updatestatus',
    method: 'post',
    data
  })
}

export function unlock(data) {
  return request({
    url: '/auditgroup/unlock',
    method: 'post',
    data
  })
}

export function auditDelete(data) {
  return request({
    url: '/auditgroup/delete',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/auditgroup/updaterole',
    method: 'post',
    data
  })
}

export function getUserList(data) {
  return request({
    url: '/auditgroup/userlist',
    method: 'post',
    data
  })
}

export function auditAdd(data) {
  return request({
    url: '/auditgroup/add',
    method: 'post',
    data
  })
}

export function reviewAdd(data) {
  return request({
    url: '/auditgroup/reviewadd',
    method: 'post',
    data
  })
}

export function reviewList(params) {
  return request({
    url: '/auditgroup/jugelist',
    params
  })
}

export function jugeBind(data) {
  return request({
    url: '/auditgroup/jugebind',
    method: 'post',
    data
  })
}

export function judeUnbind(data) {
  return request({
    url: '/auditgroup/jugeunbind',
    method: 'post',
    data
  })
}

export function infoList(params) {
  return request({
    url: '/project/infolist',
    params
  })
}

export function getProjectTypeNum(data) {
  return request({
    url: '/project/projtypenum',
    method: 'post',
    data
  })
}

export function changeGroup(data) {
  return request({
    url: '/auditgroup/jugechange',
    method: 'post',
    data
  })
}

export function getLocationOrg(data) {
  return request({
    url: '/project/locationorgan',
    method: 'post',
    data
  })
}

export function getAuditGroups(params) {
  return request({
    url: '/auditgroup/ids',
    params
  })
}

export function downloadExcel(params) {
  return request({
    url: '/project/excel',
    responseType: 'blob',
    params
  })
}

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

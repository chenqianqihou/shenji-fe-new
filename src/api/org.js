import request from '@/utils/request'

export function getOrgListByType(data) {
  return request({
    url: '/organization/listbytype',
    method: 'post',
    data
  })
}

export function getOrgTree() {
  return request({
    url: '/organization/list'
  })
}

export function fetchList(params) {
  return request({
    url: '/organization/search',
    method: 'get',
    params
  })
}

export function deleteOrg(data) {
  return request({
    url: '/organization/delete',
    method: 'post',
    data
  })
}

export function createOrg(data) {
  return request({
    url: '/organization/add',
    method: 'post',
    data
  })
}

export function updateOrg(data) {
  return request({
    url: '/organization/update',
    method: 'post',
    data
  })
}

export function getOrgDetail(data) {
  return request({
    url: '/organization/info',
    method: 'post',
    data
  })
}

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

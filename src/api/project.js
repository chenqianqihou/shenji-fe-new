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

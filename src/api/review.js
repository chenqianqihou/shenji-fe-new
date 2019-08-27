import request from '@/utils/request'

export function fetchList(params) {
  return request({
    url: '/review/list',
    params
  })
}

export function fetchResultList(params) {
  return request({
    url: '/review/resultlist',
    params
  })
}

export function fetchConfig(params) {
  return request({
    url: '/review/listsetting',
    params
  })
}

import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/review/list',
    method: 'post',
    data
  })
}

export function fetchResultList(data) {
  return request({
    url: '/review/resultlist',
    method: 'post',
    data
  })
}

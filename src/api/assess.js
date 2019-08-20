import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/assess/statlist',
    method: 'post',
    data
  })
}

export function fetchScore(params) {
  return request({
    url: '/assess/scoreconfig',
    params
  })
}

export function fetchViolations(params) {
  return request({
    url: '/assess/violations',
    params
  })
}

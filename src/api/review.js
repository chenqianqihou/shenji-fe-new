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

export function reviewInfo(params) {
  return request({
    url: '/review/info',
    params
  })
}

export function reviewPeople(data) {
  return request({
    url: '/review/operate',
    method: 'post',
    data
  })
}

export function reviewDetail(params) {
  return request({
    url: '/review/resultdetails',
    params
  })
}

export function resultOperate(params) {
  return request({
    url: '/review/resultoperate',
    params
  })
}

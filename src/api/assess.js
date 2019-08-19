import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/assess/statlist',
    method: 'post',
    data
  })
}

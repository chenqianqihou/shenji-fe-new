import request from '@/utils/request'

export function getOrgListByType(data) {
  return request({
    url: '/organization/listbytype',
    method: 'post',
    data
  })
}
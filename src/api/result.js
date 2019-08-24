import request from '@/utils/request'

export function fetchList(data) {
  return request({
    url: '/auditresults/search',
    method: 'post',
    data
  })
}

export function downloadExcel() {
  return request({
    url: '/auditresults/excel'
  })
}

export function deleteResult(data) {
  return request({
    url: '/auditresults/delresult',
    method: 'post',
    data
  })
}

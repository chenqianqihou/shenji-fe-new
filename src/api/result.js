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

export function submitResult(data) {
  return request({
    url: '/auditresults/submitresult',
    method: 'post',
    data
  })
}

export function saveResult(data) {
  return request({
    url: '/auditresults/saveresult',
    method: 'post',
    data
  })
}

export function projectList(data) {
  return request({
    url: '/auditresults/projectlist',
    method: 'post',
    data
  })
}

export function getDetail(data) {
  return request({
    url: '/auditresults/details',
    method: 'post',
    data
  })
}

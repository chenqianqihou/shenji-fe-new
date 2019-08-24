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

export function saveConfig(data) {
  return request({
    url: '/assess/saveconfig',
    method: 'post',
    data
  })
}

export function deleteConfig(data) {
  return request({
    url: '/assess/deleteconfig',
    method: 'post',
    data
  })
}

export function fetchForm(data) {
  return request({
    url: '/assess/form',
    method: 'post',
    data
  })
}

export function submitForm(data) {
  return request({
    url: '/assess/submit',
    method: 'post',
    data
  })
}

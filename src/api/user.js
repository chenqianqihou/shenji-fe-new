import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function getUserConfig() {
  return request({
    url: '/user/selectconfig',
    method: 'get'
  })
}

export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

export function updateUserRole(data) {
  return request({
    url: '/user/updaterole',
    method: 'post',
    data
  })
}

export function getUserDetail(data) {
  return request({
    url: '/user/info',
    method: 'post',
    data
  })
}

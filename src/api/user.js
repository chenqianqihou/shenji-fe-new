import request from '@/utils/request'

// 登陆
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  })
}

// 获取当前登陆用户信息
export function getInfo() {
  return request({
    url: '/user/my',
    method: 'get'
  })
}

// 注销
export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

// 获取用户列表
export function fetchList(data) {
  return request({
    url: '/user/list',
    method: 'post',
    data
  })
}

export function fetchDownload(params) {
  return request({
    url: '/user/download',
    responseType: 'blob',
    params
  })
}

// 获取配置信息
export function getUserConfig() {
  return request({
    url: '/user/selectconfig',
    method: 'get'
  })
}

// 删除用户
export function deleteUser(data) {
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

// 创建用户
export function createUser(data) {
  return request({
    url: '/user/add',
    method: 'post',
    data
  })
}

// 更新用户信息
export function updateUser(data) {
  return request({
    url: '/user/update',
    method: 'post',
    data
  })
}

// 更新用户角色
export function updateUserRole(data) {
  return request({
    url: '/user/updaterole',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getUserDetail(data) {
  return request({
    url: '/user/info',
    method: 'post',
    data
  })
}

// 重置密码
export function resetPwd(data) {
  return request({
    url: '/user/pwdreset',
    method: 'post',
    data
  })
}

// 修改当前用户密码
export function changePwd(data) {
  return request({
    url: '/user/pwdupdate',
    method: 'post',
    data
  })
}

// 机构人员下载模板
export function downloadOrgUser(params) {
  return request({
    url: '/user/organsexcel',
    responseType: 'blob',
    params
  })
}

// 第三方人员下载模板
export function downloadThirdUser(params) {
  return request({
    url: '/user/thirdpartexcel',
    responseType: 'blob',
    params
  })
}

export function authList(data) {
  return request({
    url: '/auth/list',
    method: 'post',
    data
  })
}

export function changeAuth(data) {
  return request({
    url: '/auth/update',
    method: 'post',
    data
  })
}

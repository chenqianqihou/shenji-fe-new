import request from '@/utils/request'

export function getUserLocation(params) {
  return request({
    url: '/dashbord/userlocation',
    params
  })
}

export function getAll(params) {
  return request({
    url: '/dashbord/whole',
    params
  })
}

export function getExpertise(params) {
  return request({
    url: '/dashbord/expertise',
    params
  })
}

export function getSex(params) {
  return request({
    url: '/dashbord/sex',
    params
  })
}

export function getProject(params) {
  return request({
    url: '/dashbord/proj',
    params
  })
}
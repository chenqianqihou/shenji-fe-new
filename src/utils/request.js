import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['AUTHORIZATION'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['AUTHORIZATION'] = store.getters.token
    }
    return config
  },
  error => {
    // do something with request error
    // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    const { config, headers, status } = response
    if (status === 200 && config.responseType === 'blob') {
      return {
        data: res,
        headers
      }
    }
    if (res.error.returnCode !== 0 && res.error !== 0) {
      if (res.error.returnCode === 40100) {
        // to re-login
        MessageBox.confirm('登陆过期，请重新登陆', '提示', {
          confirmButtonText: '重新登陆',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      } else {
        if (document.getElementsByClassName('el-message').length === 0) {
          Message({
            message: res.error.returnMessage || 'Error',
            type: 'error'
          })
        }
      }
      return Promise.reject(new Error(res.error.returnMessage || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: '服务正在休息，请稍后片刻', // error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

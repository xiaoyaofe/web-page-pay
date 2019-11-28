import axios from 'axios'
import Vue from 'vue'
declare var CONFIG: Object;

// let axiosInstance = {}

let axiosInstance = axios.create({
  timeout: 30000,
  maxContentLength: 2000,
  headers: {}
})

function requestSuccessFunc(requestObj) {
  //自定义请求拦截逻辑，处理权限，请求发送监控
  return requestObj
}

function requestFailFunc(renderError) {
  //自定义请求发送失败逻辑
  return Promise.reject(renderError)
}

function responseSuccessFunc(responseObj) {
  //自定义响应成功逻辑，全局拦截接口，根据不同业务做处理，响应成功监控等
  let resData = responseObj.data
  let { code } = resData
  switch (code) {
    case 102:
      alert(CONFIG['language'].status['102'])
      return
    case 105:
      alert(CONFIG['language'].status['105'])
      return
    case 200:
      return resData;
    case 202:
      alert(CONFIG['language'].status['202'])
      return
    case 203:
      alert(CONFIG['language'].status['203'])
      return
    case 204:
      alert(CONFIG['language'].status['204'])
      return
    case 206:
      alert(CONFIG['language'].status['206'])
      return
    case 207:
      alert(CONFIG['language'].status['207'])
      return
    case 230:
      alert(CONFIG['language'].status['230'])
      return
    case 231:
      alert(CONFIG['language'].status['231'])
      return
    case 301:
      alert(CONFIG['language'].status['301'])
      return
    case 500:
      alert(CONFIG['language'].status['500'])
      return
    case 502:
      alert(CONFIG['language'].status['502'])
      return
    case 503:
      alert(CONFIG['language'].status['503'])
      return
    case 504:
      alert(CONFIG['language'].status['504'])
      return
    default:
      return Promise.reject(resData)
  }
}


function responseFailFunc(responseError) {
  //响应失败
  return Promise.reject(responseError)
}

//注入请求依赖
axiosInstance.interceptors.request.use(requestSuccessFunc, requestFailFunc)
//注入响应拦截
axiosInstance.interceptors.response.use(responseSuccessFunc, responseFailFunc)

export const get = function (url, params) {
  Vue.prototype.$dialog.show('loading');
  return axiosInstance.get(url, {
    params: params
  })
    .then(function (response) {
      Vue.prototype.$dialog.hide();
      return response
    })
    .catch(function (error) {
      console.log(error)
    })
}
export const post = function (url, params) {
  Vue.prototype.$dialog.show('loading');
  return axiosInstance.post(
    url,
    params,
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    .then(function (response) {
      Vue.prototype.$dialog.hide();
      return response
    })
    .catch(function (error) {
      Vue.prototype.$dialog.hide();
      console.log(error)
    })
}
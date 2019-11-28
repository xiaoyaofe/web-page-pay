/**
 * 活动ID：CONFIG['data'].actId[typeId]  
   礼包ID：CONFIG['data'].rewardId[typeId][0]*/
// import md5 from 'js-md5'
import md5 from 'md5'
import qs from 'qs'
import { get, post } from "./axios";
declare var CONFIG: Object;

// FB登录
export const loginWithFB = (token) => {
  let params = {
    clientId: CONFIG['data'].appId,
    code: token
  }
  return get(CONFIG['BASE_URL'] + CONFIG['api'].fb_login, params)
}

//网页登录
export const pageLogin = (data) => {
  return post(CONFIG['BASE_URL'] + CONFIG['api'].pageLogin, qs.stringify(data))
}
// 获取区服
export const getZoneList = () => {
  let params = {
    appId: CONFIG['data'].appId,
  }
  return get(CONFIG['BASE_URL'] + CONFIG['api'].zoneList, params)
}
// 获取角色
export const getRole = (params) => {
  return get(CONFIG['BASE_URL'] + CONFIG['api'].role, params)
}
// 退出登录
export const logout = () => {
  return get(CONFIG['BASE_URL'] + CONFIG['api'].logout, "")
}
// 获取支付列表
export const getPayList = (params) => {
  return post(CONFIG['BASE_URLS'] + CONFIG['api'].paylist, qs.stringify(params))
}
// 创建游戏订单
export const gameOrder = (params) => {
  return post(CONFIG['BASE_URL'] + CONFIG['api'].gameOrder, qs.stringify(params))
}
// 创建发货订单
export const gameShip = (params) => {
  return post(CONFIG['BASE_URL'] + CONFIG['api'].gameShip, qs.stringify(params))
}


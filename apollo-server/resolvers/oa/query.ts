import Axios from 'axios';
import { OA_CONST } from '../../utils/const';
import { access_token, user_info } from '../../utils/db';
import Chalk from 'chalk'
import { OA } from 'types';


export const accessToken = function () {
  return new Promise(function (resolve, reject) {
    const jsonTable = access_token()
    const expires_timestamp: number = jsonTable.get(OA_CONST.ACCESS_TOKEN_EXP_TIMESTAMP).value()
    if (!expires_timestamp || expires_timestamp <= Date.now()) {
      Axios.get(OA_CONST.BASE_URL + OA_CONST.QUERY_URL.ACCESS_TOKEN, {
        params: {
          corpid: OA_CONST.CORP_ID,
          corpsecret: OA_CONST.CORP_SECRET,
        }
      }).then(function (response) {
        return response.data
      }).then(function (data: OA.AccessTokenRes) {
        if (data.errcode === 0) {
          const access_token = data.access_token
          const timestamp = Date.now()
          const expiresTimestamp = timestamp + data.expires_in * 1000
          jsonTable.set(OA_CONST.ACCESS_TOKEN, access_token).set(OA_CONST.ACCESS_TOKEN_TIMESTAMP, timestamp).set(OA_CONST.ACCESS_TOKEN_EXP_TIMESTAMP, expiresTimestamp).write()
          resolve(access_token)
        } else {
          reject(data.errmsg)
        }
      }).catch(function (error) {
        reject(error)
      })
    } else {
      resolve(jsonTable.get(OA_CONST.ACCESS_TOKEN).value())
    }
  })
}

export const departmentList = function (access_token: string) {
  return new Promise(function (resolve, reject) {
    if (!access_token) {
      reject('!access_token')
      return
    }
    Axios.get(OA_CONST.BASE_URL + OA_CONST.QUERY_URL.DEPARTMENT_LIST, {
      params: {
        access_token
      }
    }).then(function (response) {
      return response.data
    }).then(function (data: OA.DEPARTMENT.DepartmentListRes) {
      if (data.errcode === 0) {
        resolve(data.department)
      } else {
        reject(data.errmsg)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

export const userInfo = function (access_token: string, code: string) {
  return new Promise(function (resolve, reject) {
    if (!access_token || !code) {
      reject('!access_token || !code')
      return
    }
    const jsonTable = user_info()
    const res = jsonTable.get(code).value()
    if (res) {
      resolve(res)
    } else {
      Axios.get(OA_CONST.BASE_URL + OA_CONST.QUERY_URL.USER_INFO, {
        params: {
          access_token,
          code
        }
      }).then(function (response) {
        return response.data
      }).then(function (data: OA.ServerRes) {
        if (data.errcode === 0) {
          jsonTable.set(code, data).write()
          resolve(data)
        } else {
          reject(data.errmsg)
        }
      }).catch(function (error) {
        reject(error)
      })
    }
  })
}

export const userList = function (access_token: string, department_id: number, fetch_child: number = 1) {
  return new Promise(function (resolve, reject) {
    if (!access_token || !department_id) {
      reject('!access_token || !department_id')
      return
    }
    Axios.get(OA_CONST.BASE_URL + OA_CONST.QUERY_URL.USER_LIST, {
      params: {
        access_token,
        department_id,
        fetch_child
      }
    }).then(function (response) {
      return response.data
    }).then(function (data: OA.USER.UserListRes) {
      if (data.errcode === 0) {
        resolve(data.userlist)
      } else {
        reject(data.errmsg)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}

export const user = function (access_token: string, userid: string) {
  return new Promise(function (resolve, reject) {
    if (!access_token || !userid) {
      reject('!access_token || !userid')
      return
    }
    Axios.get(OA_CONST.BASE_URL + OA_CONST.QUERY_URL.USER, {
      params: {
        access_token,
        userid
      }
    }).then(function (response) {
      return response.data
    }).then(function (data: OA.USER.UserRes) {
      if (data.errcode === 0) {
        resolve(data)
      } else {
        reject(data.errmsg)
      }
    }).catch(function (error) {
      reject(error)
    })
  })
}
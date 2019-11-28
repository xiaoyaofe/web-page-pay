
export namespace OA_CONST {
  export const BASE_URL = 'https://qyapi.weixin.qq.com'
  export const CORP_ID = 'wwc5265d7ecd0d5d29'
  export const AGENT_ID = '1000010'
  export const CORP_SECRET = 'cdQEytLiF7-qF9s8LwlqU7HRfX2yIyW8BJc8MlpAN_c'
  export const CODE = 'code'
  export const ACCESS_TOKEN = 'access_token'
  export const ACCESS_TOKEN_TIMESTAMP = 'timestamp'
  export const ACCESS_TOKEN_EXP_TIMESTAMP = 'expires_timestamp'
  export enum QUERY {
    ACCESS_TOKEN = 'accessToken',
    USER_INFO = 'userInfo',
    DEPARTMENT_LIST = 'departmentList',
    USER_LIST = 'userList',
    USER = 'user'
  }
  export enum QUERY_URL {
    ACCESS_TOKEN = '/cgi-bin/gettoken',
    USER_INFO = '/cgi-bin/user/getuserinfo',
    DEPARTMENT_LIST = '/cgi-bin/department/list',
    USER_LIST = '/cgi-bin/user/list',
    USER = '/cgi-bin/user/get'
  }
  export const DEPARTMENT_LIST_ROOT_PARENT_ID = 0

}
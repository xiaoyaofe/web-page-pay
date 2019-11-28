// 默认语言
let defaultLang = 'Vn'
const language_pak = require('./i18n.ts')
const language = language_pak[defaultLang]

const activityParam = {
  appId: "10062",
  redirect_uri: "",
  appKey: "f43968a73df747aab4b9b1e506265050",
  appSecret: "fdce048a87e94f48a0f67096b17cb221",
  fbId: "1887911061495843",
  kkId: "2aa46e2170d6d1b9268934304e63b35e",
  groupId: "5c3da368b5cb671f843bd10c",
  // 德法为de,越南、泰国攻城是v1，其他都是v3
  version: "v3",
  // 打点Id
  fb: '',
  ga: '',
  // 活动ID
  actId: {
    //  许愿
    wish: "5c3da383b5cb671f843bd10d",
    // 有奖竞猜
    prize: "",
    // 转盘
    rotate: "",
    // 宝箱
    box: "",
    // 翻翻乐
    flip: "",
    // 每日登录
    everyLogin: "5c25ce5db5cb670d500e1d5a",
    // 累计充值
    paySum: "",
    // 充值达成
    payReach: "",
    // 等级达成
    level: "",
    // 在线活跃
    active: "",
    // 老玩家回归
    oldPlayer: ""
  },
  // 礼包ID
  rewardId: {
    //  许愿（wish[0]：goosId；wish[1]：wishReward；wish[2]：luckyReward）
    wish: [
      '5c3da3aab5cb671f843bd10e',
      '5c3da3d1b5cb671f843bd110',
      '5c3da419b5cb671f843bd113'],
    // 有奖竞猜
    prize: [],
    // 转盘
    rotate: [],
    // 宝箱
    box: [],
    // 翻翻乐
    flip: [],
    // 每日登录
    everyLogin: [
      '5c25ce5db5cb670d500e1d5f',
      '5c25ce5db5cb670d500e1d60',
      '5c25ce5db5cb670d500e1d61',
      '5c25ce5db5cb670d500e1d62',
      '5c25ce5db5cb670d500e1d63',
      '5c25ce5db5cb670d500e1d64',
      '5c25ce5db5cb670d500e1d65',],
    // 累计充值
    paySum: [],
    // 充值达成
    payReach: [],
    // 等级达成
    level: [],
    // 在线活跃
    active: [],
    // 老玩家回归
    oldPlayer: []
  }
};

const api = {
  // 20190118
  //登录接口
  pageLogin: "/web/login", 
  // 登出接口
  logout:"/web/logout",
  //区服接口
  zoneList: "/web/getZoneList",
  //角色接口
  role: "/client/user/role",
  //支付列表接口
  paylist: "/client/config/paymentConfig/v4.0",
  // 游戏订单接口
  gameOrder:"/web/createOrder",
  // 订单发货接口
  gameShip:"/client/order/create/v4.0"
}
module.exports = {
  dev: {
    // 201901032    
    // // 测试
    // BASE_URL: "http://sdk-test.changic.net.cn:8191/pocketgames",
    // BASE_URLS: "http://sdk-test.changic.net.cn:8191/pocketgames",
    // 正式
    BASE_URL: "https://sdk-webpay-sg.pocketgamesol.com/pocketgames",
    BASE_URLS: "https://sdk-vn.pocketgamesol.com/pocketgames",


    api: api,
    // 提示
    language: language,
    //活动
    data: activityParam
  },
  build: {
    // 201901032
    BASE_URL: "https://sdk-webpay-sg.pocketgamesol.com/pocketgames",
    BASE_URLS: "https://sdk-vn.pocketgamesol.com/pocketgames",
    // BASE_URL: "http://sdk-test.changic.net.cn:8191/pocketgames",
    // BASE_URLS: "http://sdk-test.changic.net.cn:8191/pocketgames",
    
    // 接口
    api: api,
    // 提示
    language: language,
    //活动
    data: activityParam
  }

}
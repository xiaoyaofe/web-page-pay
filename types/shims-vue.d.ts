
interface Window {
  VueComponents: any;
  WwLogin: Function
  fbq: Function
  dataLayer: any[]
}

declare module "*.vue" {
  import Vue from "vue";
  export default Vue;
}

declare namespace QyWeixin {
  interface AccessTokenRes {
    errcode: number;
    errmsg: string;
    access_token: string;
    expires_in: number;
  }
  interface Main {
    access_token: string;
    timestamp: number;
    expires_timestamp: number;
  }
}

declare namespace OrderManagement {
  interface VerifyDataRes {
    code: number;
    message: string;
    data: {
      orderInfo: VerifyDataOrderInfo;
      productInfoList: VerifyDataProductInfoList;
    };
  }

  interface VerifyDataProductInfoList {
    advChannel: number;
    amount: number;
    appId: number;
    cardCode: number;
    createTime: string;
    currency: string;
    gameCoin: number;
    gameCoinCurrency: string;
    itemType: number;
    modifyTime: string;
    productDesc: string;
    productId: number;
    productName: string;
    showGameCoin: number;
    showIndex: number;
  }

  interface VerifyDataOrderInfo {
    advChannel: number;
    appId: number;
    cardCode: number;
    channel: number;
    chargingType: number;
    clientTime: string;
    country: string;
    createTime: string;
    errorCode: number;
    gameOrderId: string;
    ipAddress: number;
    modifyTime: string;
    orderId: number;
    postGameServer: number;
    productId: number;
    roleId: string;
    roleLevel: string;
    source: number;
    status: number;
    thirdGameZoneId: string;
    transactionId: string;
    userId: number;
  }

  interface AppInfoRes {
    code: number;
    message: string;
    data: {
      appInfos: AppInfo1[] & AppInfos2;
    };
  }

  interface AppInfo1 {
    appInfo: AppInfo;
    gameZones: ZoneInfo[];
  }

  type AppInfo2 = AppInfo & {
    gameZones: {
      [key: string]: ZoneInfo;
    };
  };

  interface AppInfos2 {
    [key: string]: AppInfo2;
  }

  interface AppInfo {
    appAlias: string;
    appId: number;
    appKey: string;
    appName: string;
    appSecret: string;
    checkNoticeUrl: string;
    country: string;
    createTime: string;
    id: number;
    language: string;
    localName: string;
    modifyTime: string;
    noticeUrl: string;
    parentAppId: number;
    parentAppName: string;
    status: number;
    timeZone: number;
  }

  interface ZoneInfo {
    appId: number;
    createTime: string;
    domain: string;
    gameZoneId: number;
    localName: string;
    modifyTime: string;
    openTime: string;
    status: number;
    thirdGameZoneId: string;
    zoneDesc: string;
    zoneName: string;
  }
}

// declare namespace ZoneManagement {
//   interface res {
//     code: number;
//     message: string;
//     data: {
//       appInfos: AppInfo;
//     };
//   }
//   interface AppInfo {
//     appAlias: string;
//     appId: number;
//     appKey: string;
//     appName: string;
//     appSecret: string;
//     country: string;
//     createTime: string;
//     id: number;
//     language: string;
//     localName: string;
//     modifyTime: string;
//     noticeUrl: string;
//     parentAppId: number;
//     parentAppName: string;
//     status: number;
//     timeZone: number;
//   }
// }

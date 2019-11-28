//判断玩家是否登录
// export const isLogin = function () {
//     if (localStorage.userId && localStorage.token && localStorage.playerId) {
//         var active = new Date().getTime();
//         active -= 1800000;
//         if (active < parseInt(localStorage.activetime) && localStorage.playerName) {
//             return true;
//         } else {
//             location.reload();
//             localStorage.clear();
//         }
//     } else {
//         return false;
//     }
// }
// 区服下拉框动画
declare var CONFIG: Object;
import md5 from 'md5'
export const zoneAnimate = (className, length, unit) => {
    var oBox: any = document.getElementsByClassName(className)[0];
    var flag = parseInt(oBox.style.height) ? parseInt(oBox.style.height) : 0;
    if (!length) {
        oBox.style.height = 0 + unit;
        return
    }
    let time = setInterval(() => {
        if (flag == length) {
            oBox.style.height = 0 + unit;
            clearInterval(time);
        } else {
            flag += 10;
            if (flag == length) {
                clearInterval(time);
            }
            oBox.style.height = flag + unit;
        }
    }, 20);
}
// 
export const getRem = (pwidth, prem) => {
    var html = document.getElementsByTagName("html")[0];
    var oWidth = document.body.clientWidth || document.documentElement.clientWidth;
    html.style.fontSize = oWidth / pwidth * prem + "px";
}
// 
export const createSigntrue = (params: any) => {
    var keys: any = [];
    for (var key in params) {
        keys.push(key);
    }
    keys.sort();
    var values: any = [];
    for (var i = 0; i < keys.length; i++) {
        values.push(params[keys[i]]);
    }
    var str = values.join("") + CONFIG['data'].appKey;
    return md5(str).toString();
}
// 
export const createPayListSign = (params: any) => {
    var values: any = [];
    for (const key in params) {
        values.push(params[key])
    }
    var str = values.join("") + CONFIG['data'].appKey;
    return md5(str).toString();
}

//
export const createRoleSignture = (params: any) => {
    var values: any = [];
    values.push(params.userId);
    values.push(params.gameZoneId);
    values.push(params.timestamp);
    var str = values.join("") + CONFIG['data'].appSecret;
    return md5(str).toString();
}

export const getSessionId = () => {
    var c_name = 'JSESSIONID';
    if (document.cookie.length > 0) {
        var c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            var c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end));
        }
    }
}

export const getCurrentTime = () => {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month: any = date.getMonth() + 1;
    var strDate: any = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate +
        " " + date.getHours() + seperator2 + date.getMinutes() +
        seperator2 + date.getSeconds();
    return currentdate;
}

export const getParameterByName = (name) => {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}
//判断玩家是否登录
export const isLogin = () => {
    var userId = sessionStorage.getItem("userId");
    var active = new Date().getTime();
    active -= 3600000;
    var sessTime: any = sessionStorage.getItem("activeTime");
    var activeTime = parseInt(sessTime);
    if (active < activeTime && userId) {
        return true;
    }
    sessionStorage.clear()
    return false;
}

export const isMobile = () => {
    var sUserAgent: any = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return true;
    }
    return false;
}

export const checkOrient = () => {
    if (window.orientation == 180 || window.orientation == 0) {
        alert("Xoay màn hình ngang để trải nghiệm tốt hơn~");
    }
}
// 获取网络类型
export const getNetworkType = () => {
    var ua: any = navigator.userAgent;
    var networkStr = ua.match(/NetType\/\w+/) ? ua.match(/NetType\/\w+/)[0] : 'NetType/other';
    networkStr = networkStr.toLowerCase().replace('nettype/', '');
    var networkType;
    switch (networkStr) {
        case 'wifi':
            return networkType = 0
        case '4g':
            return networkType = 1
        case '3g':
            return networkType = 1
        case '3gnet':
            return networkType = 1
        case '2g':
            return networkType = 1
        default:
            return networkType = 2
    }
}
// 获取系统版本
export const getOsVersion = () => {
    var u = navigator.userAgent, version = ''
    if (u.indexOf('Mac OS X') > -1) {
        // ios
        var regStr_saf = /OS [\d._]*/gi
        var verinfo = u.match(regStr_saf)
        version = 'IOS' + (verinfo + '').replace(/[^0-9|_.]/ig, '').replace(/_/ig, '.')
    } else if (u.indexOf('Android') > -1 ||
        u.indexOf('Linux') > -1) {
        // android
        version = 'Android' + u.substr(u.indexOf('Android') + 8, u.indexOf(';', u.indexOf('Android')) - u.indexOf('Android') - 8)
    } else if (u.indexOf('BB10') > -1) {
        // 黑莓bb10系统
        version = 'blackberry' + u.substr(u.indexOf('BB10') + 5, u.indexOf(';', u.indexOf('BB10')) - u.indexOf('BB10') - 5)
    } else if (u.indexOf('IEMobile') > -1) {
        // windows phone
        version = 'winphone' + u.substr(u.indexOf('IEMobile') + 9, u.indexOf(';', u.indexOf('IEMobile')) - u.indexOf('IEMobile') - 9)
    } else {
        var userAgent = navigator.userAgent.toLowerCase()
        if (userAgent.indexOf('windows nt 5.0') > -1) {
            version = 'Windows 2000'
        } else if (userAgent.indexOf('windows nt 5.1') > -1 || userAgent.indexOf('windows nt 5.2') > -1) {
            version = 'Windows XP'
        } else if (userAgent.indexOf('windows nt 6.0') > -1) {
            version = 'Windows Vista'
        } else if (userAgent.indexOf('windows nt 6.1') > -1 || userAgent.indexOf('windows 7') > -1) {
            version = 'Windows 7'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows 8') > -1) {
            version = 'Windows 8'
        } else if (userAgent.indexOf('windows nt 6.3') > -1) {
            version = 'Windows 8.1'
        } else if (userAgent.indexOf('windows nt 6.2') > -1 || userAgent.indexOf('windows nt 10.0') > -1) {
            version = 'Windows 10'
        } else {
            version = 'Unknown'
        }
    }
    return version
}
// 获取设备名称
export const getDeviceName = () => {
    // 获取初始信息
    var app = navigator.appVersion;
    // 根据括号进行分割
    var left = app.indexOf('(');
    var right = app.indexOf(')');
    var str = app.substring(left + 1, right);
    var Obj = str.split(";");
    Obj[0] = Obj[0].slice(0,str.indexOf(" "))
    if (Obj[0] == "Linux") {
        return Obj[2].split(" ")[1]
    }else{
        return Obj[0]
    }
}
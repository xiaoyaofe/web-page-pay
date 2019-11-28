import { AppInfos } from './db';
import { BASE_URL } from '../const';

const cron = require("cron-scheduler")
const request = require("request")

console.log('1232asfasdfsfasf13')

// 定时任务
const job1 = async function () {
  request(
    BASE_URL + "/pocketgames/orderRepair/appInfo/SDK/1",
    function (error, httpResponse, body) {
      if (error) {
        console.log("job1 v1 error: " + error)
      } else {
        const data: OrderManagement.AppInfoRes = JSON.parse(body)
        const appInfos: OrderManagement.AppInfos2 = {}
        data.data.appInfos.forEach((val, index, arr) => {
          const gameZones = {}
          const appId = val.appInfo.appId
          val.gameZones.forEach(val => {
            gameZones[appId + "-" + val.gameZoneId] = val
          });
          (val.appInfo as OrderManagement.AppInfo2).gameZones = gameZones
          appInfos[
            val.appInfo.appId
          ] = val.appInfo as OrderManagement.AppInfo2
        })
        data.data.appInfos = appInfos as any
        AppInfos().set("v1", data).write()
        console.log("appInfo data v1 request completed on " + new Date())
      }
    })

  request(
    BASE_URL + "/pocketgames/orderRepair/appInfo/SDK/2",
    function (error, httpResponse, body) {
      if (error) {
        console.log("job1 v2 error: " + error)
      } else {
        const data: OrderManagement.AppInfoRes = JSON.parse(body)
        const appInfos: OrderManagement.AppInfos2 = {}
        data.data.appInfos.forEach((val, index, arr) => {
          const gameZones = {}
          val.gameZones.forEach(val => {
            gameZones[val.appId + "-" + val.gameZoneId] = val
          });
          (val.appInfo as OrderManagement.AppInfo2).gameZones = gameZones
          appInfos[
            val.appInfo.appId
          ] = val.appInfo as OrderManagement.AppInfo2
        })
        data.data.appInfos = appInfos as any
        AppInfos().set("v2", data).write()
        console.log("appInfo data v2 request completed on " + new Date())
      }
    })
}

// 任务的执行函数
function Main() {
  job1()
  cron({ on: "*/10 * * * *" }, function () {
    job1()
  })
}

Main()

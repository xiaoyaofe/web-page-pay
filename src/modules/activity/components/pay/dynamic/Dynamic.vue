<template>
  <section class="content-right">
    <div class="bank-auto page active">
      <div class="title-line">
        <div>
          <img src="../img/icon-bank.png">
        </div>
        <div>
          <p class="I18N">{{everyData.name}}</p>
        </div>
      </div>
      <!-- 区服选择 -->
      <div class="box-select">
        <h3 class="I18N">{{language.public.changeServerOrZone}}</h3>
        <div class="zoneId">
          <button class="sel-zoneId" @click="dropZone">
            <span class="target">{{chooseZone}}</span>
            <span class="caret"></span>
          </button>
          <div class="box-zoneId" v-show="isZone">
            <ul class="list-zones">
              <li
                v-for="(item,index) in zoneArr"
                :key="index"
                @click="selectZone(index,item.localName)"
              >{{item.localName}}</li>
            </ul>
            <div class="pagination">
              <a href="javascript:void(0);" class="first" data-action="first">&laquo;</a>
              <a href="javascript:void(0);" class="previous" data-action="previous">&lsaquo;</a>
              <input type="text" readonly="readonly" :data-max-page="100">
              <a href="javascript:void(0);" class="next" data-action="next">&rsaquo;</a>
              <a href="javascript:void(0);" class="last" data-action="last">&raquo;</a>
            </div>
          </div>
        </div>

        <div class="playId">
          <button class="sel-playId" @click="dropRole">
            <span class="target I18N">{{choosePlayId}}</span>
            <span class="caret"></span>
          </button>
          <ul class="box-playId" v-show="isRole">
            <li
              v-for="(item,index) in roleArr"
              :key="index"
              @click="selectRole(index,item.roleName)"
            >{{item.roleName}}</li>
          </ul>
        </div>
      </div>
      <!-- 布局 -->
      <div class="box-pay">
        <!-- 九宫格 -->
        <section class="jiuGongGe" v-show="showMethod == 4">
          <h3 class="I18N">{{language.public.chooseServer}}</h3>
          <section class="payBox">
            <div
              class="pay-channel"
              v-for="(item,index) in payWayArr"
              :key="index"
              @click="goProduct(index)"
            >
              <img :src="item.codeImg" alt>
              <p>{{item.name}}</p>
            </div>
          </section>
        </section>
        <!-- 列表 -->
        <section class="productList" v-show="showMethod == 0">
          <h3 class="I18N">{{language.others.chooseCount}}</h3>
          <section class="payBox">
            <div class="pay-channel" v-for="(item,index) in nodesArr" :key="index">
              <p>
                <span>{{item.gameCurrency+'*'+item.gameCoin}}</span>
                <span>{{item.shortCurrency+' '+item.amount}}</span>
              </p>
              <button @click.prevent="gameOrderBtn(index)">{{language.public.charge}}</button>
            </div>
          </section>
        </section>
        <!-- 点卡 -->
        <section class="pointCard" v-show="showMethod == 1">
          <div class="list-provider">
            <img :src="pointCardImg.codeImg" alt data-id="0" data-exinfo="10005">
          </div>
          <div class="icon-tab" v-show="!(+$route.query.cardIndex>=0)">
            <div>
              <img src="../img/icon-question.png">
            </div>
            <div>
              <a href="#" @click.prevent="dialogBtn(true)" class="scale">
                *
                <span class="I18N">{{language.public.scale}}</span>
              </a>
            </div>
          </div>
          <div class="line-tab">
            <div>
              <hr>
            </div>
            <div class="tab-title">
              <p class="I18N">{{language.others.cardCharge}}</p>
            </div>
            <div>
              <hr>
            </div>
          </div>
          <div class="box-card-charge">
            <input type="text" :placeholder="language.public.code" v-model="cardInfo.serialNo" class="card-number">
            <input type="text" :placeholder="language.public.pin" v-model="cardInfo.pin" class="card-password">
          </div>
          <button class="btn-card-charge I18N" @click.prevent="gameOrderBtn(0,'card')">{{language.public.charge}}</button>
        </section>
      </div>
    </div>
    <transition name="fadeIn">
      <section class="content-dialog" v-show="isDialog">
        <div class="dialobBox">
          <button class="close" @click.prevent="dialogBtn(false)">X</button>
          <h3 class="alert-title I18N">{{language.public.scale}}</h3>
          <ul class="exchange">
            <li
              v-for="(item,index) in pointCardImg.products"
              :key="index"
            >{{item.amount+" "+item.currency+" "+'='+" "+item.gameCoin+item.gameCurrency}}</li>
          </ul>
        </div>
      </section>
    </transition>
  </section>
</template>
<script lang="ts">
import Vue from "vue";
import $ from "jquery";
import "../../../plugins/jquery.jqpagination.min.js";
declare var CONFIG: Object;
import { getZoneList, getRole, gameOrder, gameShip } from "../../../common/api";
import {
  checkOrient,
  isLogin,
  getDeviceName,
  getOsVersion,
  createSigntrue,
  getCurrentTime,
  getNetworkType,
  createPayListSign,
  createRoleSignture
} from "../../../common/common";
// window.addEventListener("popstate", function(e) {
// alert("我监听到了浏览器的返回按钮事件啦");//根据自己的需求实现自己的功能
// }, false);
export default Vue.extend({
  name: "Dynamic",
  props: {
    propsData: {}
  },
  data() {
    return {
      zoneArr: [],
      roleArr: [],
      propsAllData: [],
      everyData: [], //充值方式数组
      payWayArr: [], //渠道数组
      nodesArr: [], //商品数组
      showMethod: 0, //布局方式
      isZone: false, //区服是否可见
      isRole: false, //角色是否可见
      isDialog: false, //对话框是否可见
      pointCardImg: [], //点卡图片
      channelIndex: "", //渠道下标
      language: CONFIG["language"],
      cardInfo: {
        serialNo: "",
        pin: ""
      },
      level: sessionStorage.getItem("level"), //角色等级
      roleId: sessionStorage.getItem("roleId"), //角色ID
      userId: sessionStorage.getItem("userId"), //用户ID
      userName: sessionStorage.getItem("username"), //账号名
      chooseZone: CONFIG["language"].public.chooseZone, //区服名称
      choosePlayId: CONFIG["language"].public.choosePlayId //角色名称
    };
  },
  watch: {
    propsData(newValue, oldValue) {
      let index: any = this.$route.query.index;
      this.propsAllData = newValue;
      this.showMethod = newValue[index].showMethod;
      this.everyData = newValue[index]; //充值方式
      if (newValue[index].showMethod == 4) {
        this.payWayArr = newValue[index].nodes
          ? newValue[index].nodes
          : newValue[index].products; //渠道
        // this.nodesArr = ;//商品
      } else if (newValue[index].showMethod == 0) {
        this.nodesArr = newValue[index].nodes
          ? newValue[index].nodes
          : newValue[index].products; //渠道
      }
    },
    $route(to, from) {
      let index: any = this.$route.query.index;
      let newValue: any = this.propsAllData;
      let payArr: any = this.payWayArr;
      let page: any = this.$route.query.page;
      this.showMethod = newValue[index].showMethod;
      this.everyData = newValue[index]; //充值方式
      this.cardInfo.serialNo = "";
      this.cardInfo.pin = "";
      if (this.$route.query.page) {
        this.channelIndex = page;
        this.pointCardImg = this.payWayArr[page];
        // 判断是否是card分挡
        this.showMethod = payArr[page].showMethod;
        if (payArr[page].showMethod==1 && payArr[page].showProductList==1) {
          if (+this.$route.query.cardIndex>=0) {
            this.showMethod = 1;
            
          }else{
            this.showMethod = 0;
            let query = Object.assign({status: 0}, this.$route.query )
            this.$router.push({ query})
          }
        }
        this.nodesArr = payArr[page].nodes ? payArr[page].nodes : payArr[page].products;
        return;
      }
      if (newValue[index].showMethod == 4) {
        this.payWayArr = newValue[index].nodes
          ? newValue[index].nodes
          : newValue[index].products; //渠道
        return;
        // this.nodesArr = ;//商品
      } else if (newValue[index].showMethod == 0) {
        this.nodesArr = newValue[index].nodes
          ? newValue[index].nodes
          : newValue[index].products; //渠道
        return;
      }
      // 对路由变化作出响应...
    }
  },
  async created() {
    if (isLogin()) {
      // 获取区服
      let result: any = await getZoneList();
      if (result) {
        let zongIndex: any = sessionStorage.getItem("userzoneIndex");
        let roleIndex: any = sessionStorage.getItem("userroleIndex");
        this.chooseZone = result.data[zongIndex].localName;
        this.zoneArr = result.data.slice(0, 10);
        $(".pagination").jqPagination({
          paged: page => {
            this.zoneArr = result.data.slice((page - 1) * 10, page * 10);
          }
        });
        // 获取角色
        var data = {
          appId: CONFIG["data"].appId,
          gameZoneId: sessionStorage.getItem("gameZoneId"),
          userId: this.userId,
          timestamp: getCurrentTime(),
          sign: ""
        };
        data.sign = createRoleSignture(data);
        let val: any = await getRole(data);
        if (val) {
          this.roleArr = val.data;
          this.choosePlayId = val.data[roleIndex].roleName;
        }
      }
    }
  },
  methods: {
    // 选择区服 -> 获取角色
    dropZone() {
      if (isLogin()) {
        this.isZone = !this.isZone;
        this.isRole = false;
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },
    selectZone(index, name) {
      if (isLogin()) {
        let id: any = this.zoneArr[index];
        var data = {
          appId: CONFIG["data"].appId,
          gameZoneId: id.thirdGameZoneId,
          userId: this.userId,
          timestamp: getCurrentTime(),
          sign: ""
        };
        data.sign = createRoleSignture(data);
        getRole(data).then((result: any) => {
          if (result && result.data) {
            this.isZone = !this.isZone;
            this.chooseZone = name;
            this.choosePlayId = CONFIG["language"].public.choosePlayId;
            sessionStorage.setItem("gameZoneId", id.thirdGameZoneId);
            sessionStorage.setItem("userzoneIndex", index);
            this.roleArr = result.data;
          } else {
            this.isZone = false;
            this.isRole = false;
            this.chooseZone = CONFIG["language"].public.chooseZone;
            this.choosePlayId = CONFIG["language"].public.choosePlayId;
          }
        });
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },
    // 选择角色
    dropRole() {
      if (isLogin()) {
        if (
          this.chooseZone == CONFIG["language"].public.chooseZone ||
          !this.roleArr.length
        ) {
          alert(CONFIG["language"].public.chooseZone);
          return;
        }
        this.isRole = !this.isRole;
        this.isZone = false;
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },
    async selectRole(index, name) {
      if (isLogin()) {
        this.isRole = !this.isRole;
        this.choosePlayId = name;
        let userLevel: any = this.roleArr[index];
        this.level = userLevel.roleLevel;
        this.roleId = userLevel.roleId;
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },
    //切換渠道
    goProduct(index) {
      if (isLogin()) {
        let payArr: any = this.payWayArr;
        let allData: any = this.propsAllData;
        let route: any = this.$route;
        let routerIndex = route.query.index;
        this.$router.push({
          path:
            "/index/" +
            allData[routerIndex].name.slice(0, 4) +
            "/" +
            payArr[index].name,
          query: { index: routerIndex, page: `${index}` }
        });
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },
    // 对话框
    dialogBtn(val) {
      if (isLogin()) {
        this.isDialog = val;
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },

    // 游戏订单
    async gameOrderBtn(index,name) {
      if (isLogin()) {
        let everyDatas: any = this.everyData;
        let payWayArr: any = this.payWayArr[this.channelIndex];
        // 是否选中区服/角色
        if (this.chooseZone == CONFIG["language"].public.chooseZone) {
          alert(CONFIG["language"].public.chooseZone);
          return;
        } else if (this.choosePlayId == CONFIG["language"].public.choosePlayId) {
          alert(CONFIG["language"].public.choosePlayId);
          return;
        }
        // 是否输入卡密
        if (everyDatas.showMethod == 4 &&payWayArr.showMethod == 1 &&payWayArr.showProductList == 0 &&!this.cardInfo.serialNo && !this.cardInfo.pin) {
          alert(CONFIG["language"].others.pinNull);
          return;
        }
        // 是否是刮刮卡分档订单
        if (+this.$route.query.status == 0) {
          if(name){
            console.log('1','这是刮刮卡分档的下单按钮',index);
            // 是否输入卡密
            if (!this.cardInfo.serialNo && !this.cardInfo.pin) {
              alert(CONFIG["language"].others.pinNull);
              return;
            }
            // 修改index
            if(+this.$route.query.cardIndex>=0){
             console.log('3','这是刮刮卡分档的订单下标',index);
             index = +this.$route.query.cardIndex
            }
            this. gameShip(index)
          }else{
            let query = Object.assign({cardIndex:index}, this.$route.query )
            query.cardIndex = index
            this.$router.push({ query})
            console.log('2','这是刮刮卡分档的选档按钮',index);
          }
          return
        }
        this. gameShip(index)
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    },
    // order
    async gameShip(index){
        let everyDatas: any = this.everyData;
        let payWayArr: any = this.payWayArr[this.channelIndex];
        let data: any = {
          appId: CONFIG["data"].appId,
          clientDate: getCurrentTime(),
          gameZoneId: sessionStorage.getItem("gameZoneId"),
          level: this.level,
          roleId: this.roleId,
          userId: this.userId,
          sign: ""
        };
        data.sign = createPayListSign(data);
        data.gameOrderId = "";
        data.remoteAddress = "";
        data.advChannel = -2;
        let result: any = await gameOrder(data);
        if (result.error_msg) {
          let nodesArr: any = this.nodesArr[index];
          let roleArr: any = this.roleArr;
          let roleIndex: any = sessionStorage.getItem("userroleIndex");
          let roleName = roleArr[roleIndex].roleName;
          let signData = {
            appId: CONFIG["data"].appId,
            advChannel: -2,
            userId: this.userId,
            roleId: this.roleId,
            gameOrderId: result.error_msg,
            gameZoneId: sessionStorage.getItem("gameZoneId"),
            code: "",
            source: 2, //充值来源
            channel: "",
            amount: nodesArr.amount,
            currency: nodesArr.currency,
            productName: nodesArr.productName,
            exInfo: {},
            sign: ""
          };

          let data = {
            deviceNo: "",
            device: "",
            network: getNetworkType(), //网络类型(0:wifi 1:3g 2:其他)
            model: getDeviceName(),
            operatorOs: getOsVersion(),
            level: this.level,
            version: "1.0.0", //游戏版本
            clientDate: getCurrentTime(), //客户端时间
            roleName: roleName,
            amount: nodesArr.amount,
            sdkVersion: "4.0",
            clientTime: getCurrentTime(),
            isOfficial: "",
            itemType: nodesArr.itemType,
            remoteAddress: "" //Ip地址
          };
          if (everyDatas.showMethod == 4 && payWayArr.showMethod == 0) {
            //九宫格
            signData.code = payWayArr.code;
            signData.channel = payWayArr.channel;
            signData.exInfo = payWayArr.exInfo;
            data.isOfficial = payWayArr.isOfficial;
          } else if (everyDatas.showMethod == 0) {
            //列表
            signData.code = everyDatas.code;
            signData.channel = everyDatas.channel;
            signData.exInfo = everyDatas.exInfo ? everyDatas.exInfo : "";
            data.isOfficial = everyDatas.isOfficial;
          } else if (everyDatas.showMethod == 4 && payWayArr.showMethod == 1) {
            //点卡
            signData.code = payWayArr.code;
            signData.channel = payWayArr.channel;
            data.isOfficial = payWayArr.isOfficial;
            signData.exInfo = `{"serialNo":${this.cardInfo.serialNo},"pin":${
              this.cardInfo.pin
            }}`;
          }
          signData.sign = createPayListSign(signData);
          let params = Object.assign(signData, data);
          let newPage:any = window
          let val: any = await gameShip(params);
          if (val) {
            this.cardInfo.serialNo = "";
            this.cardInfo.pin = "";
            if (val.data.returnInfo && val.data.returnInfo.url) {
              newPage.location.href = val.data.returnInfo.url;
            }else{
              newPage.location.href = "https://sdk-webpay-sg.pocketgamesol.com/platform/paySuccess.jsp?transactionId="+val.data.transactionId;
              // alert(CONFIG["language"].public.chargeSuccess);
            }
          }
        }
    }
  }
});
</script>
<style lang="scss" scoped>
$pc: "screen and (min-width: 980px)";
$mobile: "screen and (max-width: 979px) and (min-width: 0px)";
@mixin mq($mqString) {
  @media #{$mqString} {
    @content;
  }
}
@include mq($pc) {
  .content-right {
    width: 1000px;
    height: auto;
    display: table-cell;
    position: relative;
    .page {
      width: 95%;
      height: auto;
      min-height: 644px;
      margin-top: 35px;
      margin-left: 25px;
      padding-bottom: 20px;
      position: relative;
      border-radius: 10px;
      border: solid 1px #b7b7b7;
      overflow: hidden;
      display: none;
    }
    .page.active {
      display: block;
    }
    .title-line {
      width: 100%;
      height: 45px;
      line-height: 45px;
      color: #6c818c;
      text-align: left;
      position: relative;
      overflow: hidden;
      border-radius: 10px 10px 0 0;
      background-color: #e6edf1;
      div {
        display: table-cell;
        vertical-align: middle;
      }
      img {
        float: left;
        display: block;
        padding: 0px 5px 0px 30px;
        position: relative;
      }
      p {
        line-height: 45px;
        display: block;
        float: left;
        font-size: 14px;
      }
    }
    .box-select {
      text-align: center;
      width: 80%;
      height: auto;
      margin-left: 0;
      z-index: 9;
      float: left;
      padding: 30px 30px 0px 30px;
      position: relative;
      h3 {
        color: #9f9f9f;
        font-size: 14px;
        padding-left: 30px;
        font-weight: 100;
        line-height: 30px;
        text-align: left;
        padding-bottom: 3px;
      }
      .playId,
      .zoneId {
        width: 150px;
        height: 33px;
        float: left;
        text-align: center;
        margin: 5px 5px;
        position: relative;
        .sel-playId,
        .sel-zoneId {
          width: 150px;
          height: 33px;
          float: left;
          color: #959595;
          text-align: center;
          border-radius: 5px;
          border: solid 1px #aacbd6;
          background-color: white;
          position: relative;
          cursor: pointer;
          .caret {
            display: inline-block;
            width: 0;
            height: 0;
            margin-left: 2px;
            vertical-align: middle;
            border-top: 4px solid;
            border-right: 4px solid transparent;
            border-left: 4px solid transparent;
          }
        }
        .sel-playId:hover,
        .sel-zoneId:hover {
          background-color: #eeeeee;
        }
        .box-zoneId {
          width: 450px;
          top: 37px;
          left: 0px;
          // display: none;
          z-index: 99;
          position: absolute;
          border: solid 1px #aacbd6;
          background-color: white;
          .list-zones {
            width: 100%;
            min-height: 180px;
            position: relative;
            height: auto;
            overflow: hidden;
            li {
              width: 47%;
              font-size: 12px;
              padding: 5px 0;
              margin: 5px;
              float: left;
              cursor: pointer;
              position: relative;
            }
            li:hover {
              background-color: #eeeeee;
            }
          }
        }
        .box-playId {
          width: 145px;
          max-height: 250px;
          overflow-y: scroll;
          overflow-x: hidden;
          // display: none;
          position: absolute;
          border: solid 1px #aacbd6;
          background-color: white;
          top: 37px;
          left: 0px;
          li {
            width: 100%;
            padding: 5px 0;
            margin-top: 5px;
            cursor: pointer;
            position: relative;
            font-size: 14px;
          }
          li:hover {
            background-color: #eeeeee;
          }
        }
      }
    }
    .box-pay {
      width: 92%;
      height: auto;
      margin: 30px 30px 0px 30px;
      float: left;
      // border: 1px solid;
      h3 {
        color: #9f9f9f;
        font-size: 14px;
        padding-left: 30px;
        font-weight: 100;
        line-height: 30px;
      }
      // 九宫格
      .jiuGongGe {
        .payBox {
          width: 100%;
          height: 500px;
          overflow: auto;
          .pay-channel {
            width: 220px;
            height: auto;
            float: left;
            margin: 10px;
            border: 1px solid #b7b7b7;
            background: #f7fbfd;
            border-radius: 10px;
            text-align: center;
            font-size: 16px;
            cursor: pointer;
            img {
              width: 150px;
              margin: 10px auto;
            }
          }
          .pay-channel:hover {
            opacity: 0.7;
            box-shadow: 0 0 15px 1px gray;
          }
        }
      }
      // 网页
      .productList {
        .payBox {
          width: 100%;
          height: 500px;
          overflow: auto;
          .pay-channel {
            width: 80%;
            height: auto;
            float: left;
            margin: 10px;
            padding-top: 10px;
            border-bottom: 1px solid #b7b7b7;
            background: #f7fbfd;
            font-size: 16px;
            // border-radius: 10px;
            text-align: center;
            cursor: pointer;
            p {
              font-size: 16px;
              color: #959595;
              span:nth-child(1) {
                // float: left;
                width: 50%;
                display: inline-block;
                text-align: left;
              }
              span:nth-child(2) {
                // float: right;
                width: 42%;
                display: inline-block;
                text-align: right;
                padding-left: -10%;
                color: black;
                font-weight: bold;
              }
            }
            button {
              width: 120px;
              height: 40px;
              margin: 10px auto 10px auto;
              letter-spacing: 1px;
              position: relative;
              background-color: #00a7de;
              border-radius: 40px;
              color: white;
              font-size: 16px;
              float: right;
              cursor: pointer;
            }
            button:hover {
              opacity: 0.7;
              box-shadow: 0 0 15px 1px gray;
            }
          }
        }
      }
      // 点卡
      .pointCard {
        width: 100%;
        padding: 10px 0;
        overflow: hidden;
        position: relative;
        text-align: left;
        .payBox {
          width: 100%;
          height: 500px;
          overflow: auto;
        }
        .list-provider {
          width: 90%;
          height: auto;
          // margin-left: 30px;
          margin-top: 5px;
          position: relative;
          overflow: hidden;
          text-align: center;
          img {
            width: 150px;
            border-radius: 10px;
            // float: left;
            padding: 20px 30px;
            border: solid 1px #c9ced2;
            // cursor: pointer;
          }
          li.active {
            border: solid 1px #00a7de;
          }
        }
        .icon-tab {
          height: 30px;
          padding-top: 15px;
          display: inherit;
          div {
            display: table-cell;
            vertical-align: middle;
          }
          a {
            color: #00a7de;
            font-size: 14px;
            padding-left: 5px;
            text-decoration: underline;
          }
        }
        .line-tab {
          width: 90%;
          height: 30px;
          position: relative;
          div {
            width: 500px;
            color: #9f9f9f;
            font-size: 14px;
            display: table-cell;
            vertical-align: middle;
            .tab-title {
              width: 200px;
            }
            p {
              text-align: center;
              padding: 5px 20px;
              white-space: nowrap;
            }
          }
        }
        .box-card-charge {
          width: 60%;
          height: 150px;
          margin: auto;
          min-width: 300px;
          padding: 20px 10px 37px 10px;
          margin-top: 30px;
          position: relative;
          text-align: center;
          background-color: #eef2f5;
          input {
            width: 70%;
            height: 44px;
            font-size: 14px;
            text-align: left;
            margin-top: 24px;
            line-height: 44px;
            border-radius: 5px;
            outline: none;
            padding-left: 10px;
            border: solid 1px #9f9f9f;
          }
        }
        .btn-card-charge {
          width: 235px;
          height: 55px;
          letter-spacing: 1px;
          position: relative;
          background-color: #00a7de;
          line-height: 40px;
          display: block;
          border-radius: 40px;
          color: white;
          font-size: 18px;
          margin-top: 10px;
          cursor: pointer;
        }
      }
    }
  }
  .content-dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .dialobBox {
      width: 600px;
      height: 400px;
      position: relative;
      top: 50%;
      left: 50%;
      margin-left: -300px;
      margin-top: -200px;
      background: white;
      border: 5px solid gainsboro;
      border-radius: 15px;
      .close {
        width: 50px;
        height: 50px;
        border-radius: 50%;
        color: gray;
        font-size: 24px;
        font-weight: bold;
        border: 5px solid gainsboro;
        background: white;
        position: absolute;
        top: -20px;
        right: -20px;
        z-index: 2;
      }
      .alert-title {
        font-size: 16px;
        color: #424242;
        padding: 20px;
        position: relative;
        text-align: left;
        border-bottom: solid 1px #9f9f9f;
      }
      .exchange {
        width: 91%;
        height: 300px;
        padding: 0 4.5%;
        padding-top: 3%;
        overflow: auto;
        color: #424242;
        li {
          width: 50%;
          height: auto;
          // border: 1px solid;
          padding: 10px 0;
          text-align: center;
          float: left;
          text-align: left;
          text-indent: 6%;
        }
      }
    }
  }
}

@include mq($mobile) {
  .content-right {
    width: 90%;
    height: auto;
    // display: table-cell;
    position: relative;
    .page {
      width: 100%;
      height: auto;
      margin: auto;
      margin-top: 0.35rem;
      padding-bottom: 0.15rem;
      position: relative;
      border-radius: 0.1rem;
      border: solid 1px #b7b7b7;
      overflow: hidden;
      display: none;
    }
    .page.active {
      display: block;
    }
    .title-line {
      width: 100%;
      height: 0.75rem;
      line-height: 0.6rem;
      color: #6c818c;
      text-align: left;
      position: relative;
      overflow: hidden;
      border-radius: 0.1rem 0.1rem 0 0;
      background-color: #e6edf1;
      div {
        display: table-cell;
        vertical-align: middle;
      }
      img {
        float: left;
        display: block;
        padding: 0px .05rem 0px 0.3rem;
        position: relative;
      }
      p {
        line-height: 0.65rem;
        display: block;
        float: left;
        font-size: 0.18rem;
      }
    }
    .box-select {
      text-align: center;
      width: 90%;
      height: auto;
      margin-left: 0.3rem;
      z-index: 9;
      float: left;
      padding: 0.15rem 0.3rem 0 0.15rem;
      position: relative;
      h3 {
        color: #9f9f9f;
        font-size: 0.18rem;
        padding-left: 0.15rem;
        font-weight: 300;
        line-height: 0.3rem;
        text-align: left;
        padding-bottom: .03rem;
      }
      .playId,
      .zoneId {
        width: 1.5rem;
        height: 0.33rem;
        float: left;
        text-align: center;
        margin: .05rem .05rem;
        position: relative;
        .sel-playId,
        .sel-zoneId {
          width: 1.5rem;
          height: 0.45rem;
          float: left;
          color: #959595;
          text-align: center;
          border-radius: 0.05rem;
          border: solid 1px #aacbd6;
          background-color: white;
          position: relative;
          cursor: pointer;
          .caret {
            display: inline-block;
            width: 0;
            height: 0;
            margin-left: .02rem;
            vertical-align: middle;
            border-top: .04rem solid;
            border-right: .04rem solid transparent;
            border-left: .04rem solid transparent;
          }
          span {
            font-size: 0.16rem;
          }
        }
        .sel-playId:hover,
        .sel-zoneId:hover {
          background-color: #eeeeee;
        }
        .box-zoneId {
          width: 5rem;
          top: 0.5rem;
          left: 0px;
          // display: none;
          z-index: 99;
          position: absolute;
          border: solid 1px #aacbd6;
          background-color: white;
          .list-zones {
            width: 100%;
            min-height: 2.5rem;
            position: relative;
            height: auto;
            overflow: hidden;
            li {
              width: 45%;
              font-size: .18rem;
              padding: .1rem 0;
              margin: .05rem;
              float: left;
              cursor: pointer;
              position: relative;
            }
            li:hover {
              background-color: #eeeeee;
            }
          }
          .pagination {
              width: 4.04rem;
              height: .5rem;
              display: inline-block;
              border: 1px solid #aacbd6;
              border-radius: .03rem;
              margin-top: -5%;
              // float: left;
              margin-left: 2.5%;
              a{
                width: .7rem;
                height: .5rem;
                line-height: .5rem;
              }
              input{
                height: .5rem;
              }
            }
        }
        .box-playId {
          width: 1.45rem;
          max-height: 2.5rem;
          overflow-y: scroll;
          overflow-x: hidden;
          // display: none;
          position: absolute;
          border: solid 1px #aacbd6;
          background-color: white;
          top: 0.5rem;
          left: 0px;
          li {
            width: 100%;
            padding: .05rem 0;
            margin-top: .05rem;
            cursor: pointer;
            position: relative;
            font-size: .15rem;
          }
          li:hover {
            background-color: #eeeeee;
          }
        }
      }
    }
    .box-pay {
      width: 90%;
      height: auto;
      margin: 0.1rem 0.3rem 0px 0.3rem;
      float: left;
      // border: 1px solid;
      h3 {
        color: #9f9f9f;
        font-size: 0.18rem;
        padding-left: 0.3rem;
        font-weight: 100;
        line-height: 0.5rem;
      }
      // 九宫格
      .jiuGongGe {
        .payBox {
          width: 100%;
          max-height: 6rem;
          overflow: auto;
          // border: 1px solid;
          padding-left: 0.1rem;
          margin-bottom: .3rem;
          .pay-channel {
            width: 1.58rem;
            height: auto;
            float: left;
            margin: 0.1rem 0.15rem 0.1rem 0.15rem;
            border: 1px solid #b7b7b7;
            background: #f7fbfd;
            border-radius: 0.1rem;
            text-align: center;
            font-size: 0.18rem;
            cursor: pointer;
            img {
              width: 1.5rem;
              margin: 0.1rem auto;
            }
          }
          .pay-channel:hover {
            opacity: 0.7;
            box-shadow: 0 0 0.15rem 1px gray;
          }
        }
      }
      // 网页
      .productList {
        .payBox {
          width: 100%;
          max-height: 6rem;
          overflow: auto;
          margin-bottom: .2rem;
          .pay-channel {
            width: 97%;
            height: auto;
            float: left;
            margin: 0.1rem;
            padding-top: 0.1rem;
            border-radius: 0.15rem;
            border-bottom: 1px solid #b7b7b7;
            background: #f7fbfd;
            // border-radius: 10px;
            text-align: center;
            cursor: pointer;
            p {
              font-size: 0.16rem;
              color: #959595;
              span:nth-child(1) {
                // float: left;
                width: 50%;
                display: inline-block;
                text-align: left;
              }
              span:nth-child(2) {
                // float: right;
                width: 37%;
                display: inline-block;
                text-align: right;
                color: black;
                padding-right: 5%;
                font-weight: bold;
              }
            }
            button {
              width: 1.2rem;
              height: 0.4rem;
              margin: 0.1rem 0.25rem 0.1rem auto;
              letter-spacing: 1px;
              position: relative;
              background-color: #00a7de;
              border-radius: 0.04rem;
              color: white;
              font-size: 0.16rem;
              float: right;
              cursor: pointer;
            }
            button:hover {
              opacity: 0.7;
              box-shadow: 0 0 0.15rem 1px gray;
            }
          }
        }
      }
      // 点卡
      .pointCard {
        width: 100%;
        padding: 0.1rem 0 0.5rem 0px;
        overflow: hidden;
        position: relative;
        text-align: left;
        .payBox {
          width: 100%;
          max-height: 5rem;
          overflow: auto;
        }
        .list-provider {
          width: 100%;
          height: auto;
          // margin-left: 30px;
          margin-top: 0.5rem;
          position: relative;
          overflow: hidden;
          text-align: center;
          img {
            width: 1.5rem;
            border-radius: 0.1rem;
            // float: left;
            padding: 0.2rem 0.3rem;
            border: solid 1px #c9ced2;
            // cursor: pointer;
          }
          li.active {
            border: solid 1px #00a7de;
          }
        }
        .icon-tab {
          height: 1rem;
          margin-top: -0.6rem;
          padding-left: 0.3rem;
          display: inherit;
          div {
            display: table-cell;
            vertical-align: middle;
          }
          a {
            color: #00a7de;
            font-size: 0.14rem;
            padding-left: 0.05rem;
            text-decoration: underline;
          }
          img {
            width: 0.17rem;
          }
        }
        .line-tab {
          width: 90%;
          height: 0.3rem;
          margin: auto;
          position: relative;
          div {
            width: 5rem;
            color: #9f9f9f;
            font-size: 0.14rem;
            display: table-cell;
            vertical-align: middle;
            .tab-title {
              width: 2rem;
            }
            p {
              text-align: center;
              padding: 0.05rem 0.2rem;
              white-space: nowrap;
            }
          }
        }
        .box-card-charge {
          width: 60%;
          height: 2rem;
          margin: auto;
          min-width: 3rem;
          padding: 0.2rem 0.1rem 0.37rem 0.1rem;
          margin-top: 0.3rem;
          position: relative;
          text-align: center;
          background-color: #eef2f5;
          input {
            width: 80%;
            height: 0.44rem;
            font-size: 0.14rem;
            text-align: left;
            float: left;
            margin-left: 8%;
            margin-top: 0.05rem;
            line-height: 0.44rem;
            border-radius: 0.05rem;
            outline: none;
            padding-left: 0.1rem;
            border: solid 1px #9f9f9f;
          }
          input:nth-child(2) {
            margin-top: 0.15rem;
          }
        }
        .btn-card-charge {
          width: 2.35rem;
          height: 0.55rem;
          letter-spacing: 1px;
          position: relative;
          background-color: #00a7de;
          line-height: 0.4rem;
          display: block;
          border-radius: 0.4rem;
          color: white;
          font-size: 0.18rem;
          margin-top: -0.8rem;
          margin-bottom: 0.2rem;
          cursor: pointer;
        }
      }
    }
  }
  .content-dialog {
    width: 100%;
    height: 100%;
    position: fixed;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    .dialobBox {
      width: 6rem;
      height: 4rem;
      position: relative;
      top: 50%;
      left: 50%;
      margin-left: -3rem;
      margin-top: -2rem;
      background: white;
      border: 0.05rem solid gainsboro;
      border-radius: 0.15rem;
      .close {
        width: 0.5rem;
        height: 0.5rem;
        border-radius: 50%;
        color: gray;
        font-size: 0.24rem;
        font-weight: bold;
        border: 0.05rem solid gainsboro;
        background: white;
        position: absolute;
        top: -0.2rem;
        right: -0.2rem;
        z-index: 2;
      }
      .alert-title {
        font-size: 0.16rem;
        color: #424242;
        padding: 0.2rem;
        position: relative;
        text-align: left;
        border-bottom: solid 1px #9f9f9f;
      }
      .exchange {
        width: 91%;
        height: 3rem;
        padding: 0 4.5%;
        padding-top: 3%;
        overflow: auto;
        color: #424242;
        li {
          width: 50%;
          height: auto;
          font-size: 0.16rem;

          // border: 1px solid;
          padding: 0.1rem 0;
          text-align: center;
          float: left;
          text-align: left;
          text-indent: 6%;
        }
      }
    }
  }
  @media only screen and (orientation: landscape) {
    .content-right {
      width: 90%;
      height: auto;
      display: table-cell;
      position: relative;
      .page {
        width: 95%;
        height: auto;
        max-height: 7rem;
        min-height: 0;
        margin-top: 0.15rem;
        margin-left: 0.15rem;
        padding-bottom: 0.2rem;
        position: relative;
        border-radius: 0.1rem;
        border: solid 1px #b7b7b7;
        overflow: hidden;
      }
      .page.active {
        display: block;
      }
      .title-line {
        width: 100%;
        height: 0.45rem;
        line-height: 0.6rem;
        color: #6c818c;
        text-align: left;
        position: relative;
        overflow: hidden;
        border-radius: 0.1rem 0.1rem 0 0;
        background-color: #e6edf1;
        div {
          display: table-cell;
          vertical-align: middle;
        }
        img {
          float: left;
          display: block;
          padding: 0px 0.05rem 0px 0.15rem;
          position: relative;
        }
        p {
          line-height: 0.45rem;
          display: block;
          float: left;
          font-size: 0.14rem;
        }
      }
      .box-select {
        text-align: center;
        width: 90%;
        height: auto;
        margin-left: 0rem;
        z-index: 9;
        float: left;
        padding: 0.15rem 0.3rem 0 0.15rem;
        position: relative;
        h3 {
          color: #9f9f9f;
          font-size: 0.14rem;
          padding-left: 0.15rem;
          font-weight: 300;
          line-height: 0.3rem;
          text-align: left;
          padding-bottom: .03rem;
        }
        .playId,
        .zoneId {
          width: 1.5rem;
          height: 0.33rem;
          float: left;
          text-align: center;
          margin: .05rem .05rem;
          position: relative;
          .sel-playId,
          .sel-zoneId {
            width: 1.25rem;
            height: 0.3rem;
            float: left;
            color: #959595;
            text-align: center;
            border-radius: 0.05rem;
            border: solid 1px #aacbd6;
            background-color: white;
            position: relative;
            cursor: pointer;
            .caret {
              display: inline-block;
              width: 0;
              height: 0;
              margin-left: .02rem;
              vertical-align: middle;
              border-top: .04rem solid;
              border-right: .04rem solid transparent;
              border-left: .04rem solid transparent;
            }
            span {
              font-size: 0.14rem;
            }
          }
          .sel-playId:hover,
          .sel-zoneId:hover {
            background-color: #eeeeee;
          }
          .box-zoneId {
            width: 3rem;
            top: 0.4rem;
            left: 0px;
            // display: none;
            z-index: 99;
            position: absolute;
            border: solid 1px #aacbd6;
            background-color: white;
            .list-zones {
              width: 100%;
              min-height: 1.8rem;
              position: relative;
              height: auto;
              overflow: hidden;
              li {
                width: 45%;
                font-size: .15rem;
                padding: .05rem 0;
                margin: .05rem;
                float: left;
                cursor: pointer;
                position: relative;
              }
              li:hover {
                background-color: #eeeeee;
              }
            }
            .pagination {
              width: 2.65rem;
              height: .35rem;
              display: inline-block;
              border: 1px solid #aacbd6;
              border-radius: .03rem;
              margin: .1rem;
              // float: left;
              margin-left: 4.5%;
              a{
                width: .35rem;
                height: .35rem;
                line-height: .35rem;
              }
              input{
                height: .35rem;
              }
            }
          }
          .box-playId {
            width: 1.45rem;
            max-height: 2.5rem;
            overflow-y: scroll;
            overflow-x: hidden;
            // display: none;
            position: absolute;
            border: solid 1px #aacbd6;
            background-color: white;
            top: 0.4rem;
            left: 0px;
            li {
              width: 100%;
              padding: .05rem 0;
              margin-top: .05rem;
              cursor: pointer;
              position: relative;
              font-size: .14rem;
            }
            li:hover {
              background-color: #eeeeee;
            }
          }
        }
        .zoneId {
          margin-left: 0.1rem;
        }
      }
      .box-pay {
        width: 90%;
        height: auto;
        margin: 0.1rem 0.3rem 0 0.3rem;
        float: left;
        // border: 1px solid;
        h3 {
          color: #9f9f9f;
          font-size: 0.14rem;
          padding-left: 0rem;
          font-weight: 300;
          line-height: 0.35rem;
        }
        // 九宫格
        .jiuGongGe {
          .payBox {
            width: 100%;
            max-height: 5.5rem;
            overflow: auto;
            margin-left: -0.2rem;
            margin-bottom: .1rem;
            // border: 1px solid;
            .pay-channel {
              width: 1rem;
              height: auto;
              float: left;
              margin: 0.1rem 0.1rem 0.05rem 0.05rem;
              border: 1px solid #b7b7b7;
              background: #f7fbfd;
              border-radius: 0.1rem;
              text-align: center;
              font-size: 0.12rem;
              cursor: pointer;
              img {
                width: 0.8rem;
                margin: 0.1rem auto;
              }
            }
            .pay-channel:hover {
              opacity: 0.7;
              box-shadow: 0 0 0.15rem 1px gray;
            }
          }
        }
        // 网页
        .productList {
          .payBox {
            width: 100%;
            height: 5.5rem;
            overflow: auto;
            margin-left: -0.05rem;
            .pay-channel {
              width: 97%;
              height: auto;
              float: left;
              // border:1px solid;
              margin: 0.1rem 0rem;
              padding-top: 0.1rem;
              border-radius: 0.15rem;
              border-bottom: 1px solid #b7b7b7;
              background: #f7fbfd;
              // border-radius: 10px;
              text-align: center;
              cursor: pointer;
              p {
                font-size: 0.14rem;
                color: #959595;
                span:nth-child(1) {
                  // float: left;
                  width: 50%;
                  display: inline-block;
                  text-align: left;
                }
                span:nth-child(2) {
                  // float: right;
                  width: 37%;
                  display: inline-block;
                  text-align: right;
                  color: black;
                  padding-right: 5%;
                  font-weight: bold;
                }
              }
              button {
                width: 0.8rem;
                height: 0.3rem;
                margin: 0.1rem 0.25rem 0.1rem auto;
                letter-spacing: 1px;
                position: relative;
                background-color: #00a7de;
                border-radius: 0.04rem;
                color: white;
                font-size: 0.12rem;
                float: right;
                cursor: pointer;
              }
              button:hover {
                opacity: 0.7;
                box-shadow: 0 0 0.15rem 1px gray;
              }
            }
          }
        }
        // 点卡
        .pointCard {
          width: 100%;
          // padding: 0.1rem 0 0.5rem 0px;
          overflow: hidden;
          position: relative;
          text-align: left;
          .payBox {
            width: 100%;
            height: 5rem;
            overflow: auto;
          }
          .list-provider {
            width: 100%;
            height: auto;
            // margin-left: 30px;
            margin-top: -.3rem;
            position: relative;
            overflow: hidden;
            text-align: center;
            img {
              width: .6rem;
              border-radius: 0.1rem;
              // float: left;
              padding: 0.2rem 0.3rem;
              border: solid 1px #c9ced2;
              // cursor: pointer;
            }
            li.active {
              border: solid 1px #00a7de;
            }
          }
          .icon-tab {
            height: 1rem;
            margin-top: -0.8rem;
            padding-left: 0.3rem;
            display: inherit;
            div {
              display: table-cell;
              vertical-align: middle;
            }
            a {
              color: #00a7de;
              font-size: 0.14rem;
              padding-left: 0.05rem;
              text-decoration: underline;
            }
            img {
              width: 0.17rem;
            }
          }
          .line-tab {
            width: 90%;
            height: 0.3rem;
            margin: auto;
            position: relative;
            div {
              width: 5rem;
              color: #9f9f9f;
              font-size: 0.14rem;
              display: table-cell;
              vertical-align: middle;
              .tab-title {
                width: 2rem;
              }
              p {
                text-align: center;
                padding: 0.05rem 0.2rem;
                white-space: nowrap;
              }
            }
          }
          .box-card-charge {
            width: 60%;
            height: 1.5rem;
            margin: auto;
            min-width: 3rem;
            padding: 0.2rem 0.1rem 0.37rem 0.1rem;
            margin-top: 0.3rem;
            position: relative;
            text-align: center;
            background-color: #eef2f5;
            input {
              width: 80%;
              height: 0.35rem;
              font-size: 0.14rem;
              text-align: left;
              float: left;
              margin-left: 8%;
              margin-top: 0.05rem;
              line-height: 0.44rem;
              border-radius: 0.05rem;
              outline: none;
              padding-left: 0.1rem;
              border: solid 1px #9f9f9f;
            }
            input:nth-child(2) {
              margin-top: 0.15rem;
            }
          }
          .btn-card-charge {
            width: 1.25rem;
            height: 0.35rem;
            letter-spacing: 1px;
            position: relative;
            background-color: #00a7de;
            line-height: 0.4rem;
            display: block;
            border-radius: 0.4rem;
            color: white;
            font-size: 0.14rem;
            cursor: pointer;
          }
        }
      }
    }
    .content-dialog {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 999;
      .dialobBox {
        width: 6rem;
        height: 4rem;
        position: relative;
        top: 50%;
        left: 50%;
        margin-left: -3rem;
        margin-top: -2rem;
        background: white;
        border: 0.05rem solid gainsboro;
        border-radius: 0.15rem;
        .close {
          width: 0.5rem;
          height: 0.5rem;
          border-radius: 50%;
          color: gray;
          font-size: 0.24rem;
          font-weight: bold;
          border: 0.05rem solid gainsboro;
          background: white;
          position: absolute;
          top: -0.2rem;
          right: -0.2rem;
          z-index: 2;
        }
        .alert-title {
          font-size: 0.16rem;
          color: #424242;
          padding: 0.2rem;
          position: relative;
          text-align: left;
          border-bottom: solid 1px #9f9f9f;
        }
        .exchange {
          width: 91%;
          height: 3rem;
          padding: 0 4.5%;
          padding-top: 3%;
          overflow: auto;
          color: #424242;
          li {
            width: 50%;
            height: auto;
            font-size: 0.16rem;

            // border: 1px solid;
            padding: 0.1rem 0;
            text-align: center;
            float: left;
            text-align: left;
            text-indent: 6%;
          }
        }
      }
    }
  }
}
</style>

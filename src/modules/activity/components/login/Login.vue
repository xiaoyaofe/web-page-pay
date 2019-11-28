<template>
  <div class="container">
    <div class="header">
      <div class="box-title">
        <!-- <img src="./img/logo.png" alt="POCKET" class="logo"> -->
        <img src="./img/logo2.png" class="logo2">
        <p class="title">{{language.headerTitle}}</p>
      </div>
    </div>
    <div class="content">
      <!-- 登录 -->
      <div class="box-login" v-show="showLogin">
        <div class="line-tab">
          <div>
            <hr>
          </div>
          <div class="tab-title">
            <p class>{{language.login.login}}</p>
          </div>
          <div>
            <hr>
          </div>
        </div>
        <input type="text" placeholder="username" class="username" v-model="userName">
        <input type="password" placeholder="password" class="password" v-model="passWord">
        <div class="check">
          <label class="remember">
            <input type="checkbox" :checked="isChecked" id="checkbox">
            <span class>{{language.login.remenber}}</span>
          </label>
          <!-- <a
            href="./auto_download.html?game=kdyg3ds"
            target="_blank"
            class="link-register"
          >{{language.login.register}}</a>-->
        </div>
        <button class="btn-login" @click="lobinBtn">{{language.login.login}}</button>
        <button class="btn-facebook" @click="facebook">FACEBOOK</button>
      </div>
      <!-- 选服 -->
      <div class="box-login" v-show="!showLogin">
        <div class="line-tab">
          <div>
            <hr>
          </div>
          <div class="tab-title">
            <p class>{{language.login.zone}}</p>
          </div>
          <div>
            <hr>
          </div>
        </div>
        <input
          type="text"
          :placeholder="language.public.chooseZone"
          readonly
          class="userzone"
          v-model="chooseZone"
          @click="dropZone"
        >
        <section class="zoneBox" v-show="showZone">
          <li
            v-for="(item,index) in zoneArr"
            :key="index"
            @click="selectZone(index,item.localName)"
          >{{item.localName}}</li>
        </section>
        <input
          type="text"
          :placeholder="language.public.choosePlayId"
          readonly
          class="userrole"
          v-model="choosePlayId"
          @click="dropRole"
        >
        <section class="roleBox" v-show="showRole">
          <li
            v-for="(item,index) in roleArr"
            :key="index"
            @click="selectRole(index,item.roleName)"
          >{{item.roleName}}</li>
        </section>
        <div class="check">
          <label class="remember">
            <span @click="changeUser">&lt;&lt;&lt; {{language.login.changUser}}</span>
          </label>
        </div>
        <button class="btn-login" @click="zoneBtn()">{{language.login.login}}</button>
      </div>

      <div class="menu">
        <h2 class>{{language.login.buyCard}}</h2>
        <img class="imgs" src="./img/line-wave.png">
        <ul>
          <li v-for="(item,index) in listArr" :key="index">
            <h3>
              <img src="./img/icon-list.png" alt>
              <span>{{language.login[item.title]}}</span>
            </h3>
            <p>{{language.login[item.text]}}</p>
          </li>
        </ul>
      </div>
    </div>

    <!-- <div class="footer">
      <p>Copyright © 2014-2016 88box.com Limited. All Rights Reserved</p>
    </div> -->
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import md5 from "md5";
import {
  getZoneList,
  getRole,
  logout,
  getPayList,
  pageLogin
} from "../../common/api";
import {
  isLogin,
  isMobile,
  getDeviceName,
  zoneAnimate,
  checkOrient,
  createSigntrue,
  getCurrentTime,
  createPayListSign,
  createRoleSignture
} from "../../common/common";
declare var CONFIG: Object;
declare var window: any;
declare var FB: any;
export default Vue.extend({
  name: "Index",
  data() {
    return {
      language: CONFIG["language"],
      userName: "",
      passWord: "",
      isChecked:false,
      userId: "",
      zoneArr: [],
      roleArr: [],
      showZone: false,
      showRole: false,
      showLogin: true,
      listArr: [
        { title: "bankHuman", text: "bankHumanInfo" },
        { title: "bankAuto", text: "bankAutoInfo" },
        { title: "card", text: "cardInfo" },
        { title: "sms", text: "smsInfo" }
      ],
      chooseZone: "", //区服名称
      choosePlayId: "" //角色名称
    };
  },
  created() {
    // 記住密碼自動填充
    if (this.getCookie("username") && this.getCookie("password")) {
      let username:any = this.getCookie("username")
      let password:any = this.getCookie("password")
      this.isChecked = true;
      this.userName = username;
      this.passWord = password;
    }
    if (isLogin()) {
      this.showLogin = false;
      // 获取区服
      getZoneList().then((result: any) => {
        if (result.data) {
          this.zoneArr = result.data;
        }
      });
    }
  },
  watch: {
    userId() {
      // 获取区服
      getZoneList().then((result: any) => {
        if (result.data) {
          this.zoneArr = result.data;
        }
      });
    }
  },
  methods: {
    // FB登录
    async facebook() {
      let that = this;
      FB.getLoginStatus(function(response) {
        if (response.status === "connected") {
          that.FBSdkLogin(response.authResponse.accessToken);
        } else {
          FB.login(function(response) {
            if (response.status === "connected") {
              // Logged into your app and Facebook.
              that.FBSdkLogin(response.authResponse.accessToken);
            } else {
              // The person is not logged into this app or we are unable to tell.
            }
          });
        }
      });
    },
    async FBSdkLogin(code) {
      var data = {
        appId: CONFIG["data"].appId,
        userName: "",
        password: "",
        accountType: 2,
        code: code,
        redirectUrl: "",
        exInfo: "",
        sign: ""
      };
      data.sign = createSigntrue(data);
      await pageLogin(data).then((result: any) => {
        if (result.data) {
          var checkbox: any = document.getElementById("checkbox");
          if (checkbox.checked) {
            console.log("記住密碼");
            this.setCookie("username", this.userName, "d3");
            this.setCookie("password", this.passWord, "d3");
          } else {
            this.delCookie("username");
            this.delCookie("password");
            console.log("不記住密碼");
          }
          this.userId = result.data.userId;
          sessionStorage.setItem("userId", result.data.userId);
          sessionStorage.setItem("username", result.data.userName);
          var myTimer: any = new Date().getTime();
          sessionStorage.setItem("activeTime", myTimer);
          this.showLogin = false;
        } else {
          alert(CONFIG["language"].login.LoginFail);
          console.log("登录失败" + result.data);
        }
      });
    },
    // 账号登录
    async lobinBtn() {
      let this_ = this;
      if (this.userName && this.passWord) {
        var data = {
          appId: CONFIG["data"].appId,
          accountType: 0,
          userName: this.userName,
          password: md5(this.passWord),
          code: "",
          redirectUrl: "",
          exInfo: "",
          sign: ""
        };
        data.sign = createSigntrue(data);
        await pageLogin(data).then((result: any) => {
          if (result.data) {
            var checkbox: any = document.getElementById("checkbox");
            if (checkbox.checked) {
              console.log("記住密碼");
              this.setCookie("username", this.userName, "d3");
              this.setCookie("password", this.passWord, "d3");
            } else {
              this.delCookie("username");
              this.delCookie("password");
              console.log("不記住密碼");
            }
            sessionStorage.setItem("userId", result.data.userId);
            sessionStorage.setItem("username", result.data.userName);
            var myTimer: any = new Date().getTime();
            sessionStorage.setItem("activeTime", myTimer);
            this.showLogin = false;
            this.userId = result.data.userId;
          } else {
            alert(CONFIG["language"].login.LoginFail);
            console.log("登录失败" + result.data);
          }
        });
      } else {
        alert(CONFIG["language"].login.alertBlank);
      }
    },
    // 切換賬號
    async changeUser() {
      logout().then((result: any) => {
        this.userName = "";
        this.passWord = "";
        this.showLogin = true;
        sessionStorage.clear();
        this.$router.push({ name: "login" });
        this.chooseZone = "";
        this.choosePlayId = "";
        zoneAnimate("roleBox", 0, "px");
        console.log("退出登录 \r\n" + result.data);
      });
    },
    // 添加Cookie
    setCookie(name, value, time) {
      var strsec: any = this.getsec(time);
      var exp: any = new Date();
      exp.setTime(exp.getTime() + strsec * 1);
      document.cookie =
        name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    },
    getsec(str) {
      var str1 = str.substring(1, str.length) * 1;
      var str2 = str.substring(0, 1);
      if (str2 == "s") {
        return str1 * 1000;
      } else if (str2 == "h") {
        return str1 * 60 * 60 * 1000;
      } else if (str2 == "d") {
        return str1 * 24 * 60 * 60 * 1000;
      }
    },
    //读取cookies
    getCookie(name) {
      var arr,
        reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2]);
      } else {
        return null;
      }
    },
    //删除cookies
    delCookie(name) {
      var exp: any = new Date();
      exp.setTime(exp.getTime() - 1);
      var cval = this.getCookie(name);
      if (cval != null)
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    },
    // 选择区服 -> 获取角色
    dropZone() {
      if (isLogin()) {
        this.showRole = false;
        if (!this.showZone) {
          this.showZone = true;
          zoneAnimate("zoneBox", 280, "px");
        } else {
          this.showZone = false;
          zoneAnimate("zoneBox", 0, "px");
          zoneAnimate("roleBox", 0, "px");
        }
      } else {
        alert(CONFIG["language"].login.expired);
        window.location.reload();
      }
    },
    selectZone(index, name) {
      if (isLogin()) {
        let id: any = this.zoneArr[index];
        var data = {
          appId: CONFIG["data"].appId,
          gameZoneId: id.thirdGameZoneId,
          userId: sessionStorage.getItem("userId"),
          timestamp: getCurrentTime(),
          sign: ""
        };
        data.sign = createRoleSignture(data);
        getRole(data).then((result: any) => {
          if (result && result.data) {
            this.showZone = false;
            zoneAnimate("zoneBox", 0, "px");
            zoneAnimate("roleBox", 0, "px");
            this.chooseZone = name;
            this.choosePlayId = "";
            this.roleArr = result.data;
            sessionStorage.setItem("gameZoneId", id.thirdGameZoneId);
            sessionStorage.setItem("userzoneIndex", index);
          } else {
            this.showZone = false;
            zoneAnimate("zoneBox", 0, "px");
            zoneAnimate("roleBox", 0, "px");
            this.showRole = false;
            this.chooseZone = "";
            this.choosePlayId = "";
          }
        });
      } else {
        alert(CONFIG["language"].login.expired);
        window.location.reload();
      }
    },
    // 選擇角色
    dropRole() {
      if (isLogin()) {
        if (
          this.chooseZone == CONFIG["language"].public.chooseZone ||
          !this.roleArr.length
        ) {
          alert(CONFIG["language"].public.chooseZone);
          return;
        }
        this.showZone = false;
        if (!this.showRole) {
          // debugger
          this.showRole = true;
          zoneAnimate("roleBox", 60, "px");
        } else {
          this.showRole = false;
          zoneAnimate("roleBox", 0, "px");
        }
      } else {
        alert(CONFIG["language"].login.expired);
        window.location.reload();
      }
    },
    selectRole(index, name) {
      if (isLogin()) {
        zoneAnimate("roleBox", 0, "px");
        this.showRole = !this.showRole;
        this.choosePlayId = name;
        let userLevel: any = this.roleArr[index];
        sessionStorage.setItem("level", userLevel.roleLevel);
        sessionStorage.setItem("roleId", userLevel.roleId);
        sessionStorage.setItem("userroleIndex", index);
      } else {
        alert(CONFIG["language"].login.expired);
        window.location.reload();
      }
    },
    // 區服按鈕
    zoneBtn() {
      if (isLogin()) {
        if (this.choosePlayId && this.chooseZone) {
          this.$router.push({ name: "index" });
          // this.showLogin = true;
        } else {
          alert(CONFIG["language"].login.zoneNull);
        }
      } else {
        alert(CONFIG["language"].login.expired);
        window.location.reload();
      }
    }
  }
});
</script>
<style lang="scss" scoped>
// /*---- variables ----*/
$pc: "screen and (min-width: 980px)";
$mobile: "screen and (max-width: 979px) and (min-width: 0px)";

// /*---- Mixins ----*/
@mixin mq($mqString) {
  @media #{$mqString} {
    @content;
  }
}
@include mq($pc) {
  .container {
    position: relative;
    background: url("./img/bg-login.png") center top no-repeat;
    .header {
      width: 100%;
      height: 100px;
      border-bottom: solid 5px #0088b8;
      position: relative;
      overflow: hidden;
      background-color: #00a0d8;
      .box-title {
        max-width: 1100px;
        min-width: 300px;
        height: 100px;
        position: relative;
        margin: 0 auto;
      }

      .logo,
      .logo2 {
        float: left;
        position: relative;
        margin: 20px 0 20px 20px;
        display: table-cell;
      }

      .title {
        line-height: 100px;
        width: 1000px;
        color: white;
        font-size: 28px;
        text-align: center;
        display: table-cell;
        /*letter-spacing: 30px;*/
        text-shadow: 0px 2px 5px #000;
        // background: red;
      }
    }
    .content {
      max-width: 1000px;
      min-width: 300px;
      min-height: 796px;
      position: relative;
      margin: 0 auto;
      overflow: hidden;
      .box-login {
        width: 332px;
        height: 386px;
        /*min-width: 240px;*/
        /*margin-top: 35px;*/
        margin: 50px 24px 0 100px;
        // overflow: hidden;
        text-align: center;
        position: relative;
        float: right;
        border-radius: 10px;
        border: solid 1px #b7b7b7;
        background-color: white;
        .line-tab {
          width: 80%;
          height: 30px;
          padding: 25px 0;
          position: relative;
          margin: auto;
          div {
            width: 500px;
            color: #9f9f9f;
            font-size: 14px;
            display: table-cell;
            vertical-align: middle;
            p {
              text-align: center;
              padding: 5px 20px;
              white-space: nowrap;
            }
          }
          div.tab-title {
            width: 200px;
            font-size: 20px;
          }
        }
        .zoneBox,
        .roleBox {
          width: 81.5%;
          height: 0;
          position: absolute;
          background: white;
          border: 1px solid rgb(177, 176, 176);
          z-index: 2;
          top: 33%;
          left: 9%;
          overflow-x: auto;
          li {
            list-style: none;
            width: 40%;
            font-size: 12px;
            padding: 5px 0;
            margin: 5px;
            float: left;
            cursor: pointer;
            position: relative;
            float: left;
          }
          li:hover {
            background-color: #7acae6;
          }
        }
        .roleBox {
          top: 46%;
        }
        .username,
        .password,
        .userzone,
        .userrole {
          width: 75%;
          height: 40px;
          line-height: 40px;
          font-size: 16px;
          padding-left: 20px;
          margin: 5px auto;
          position: relative;
          border-radius: 5px;
          border: solid 1px #b7b7b7;
        }
        .userzone,
        .userrole {
          background: url("./img/drop.png") no-repeat;
          background-size: 6%;
          background-position: 85% 50%;
          cursor: pointer;
          color: #9f9f9f;
        }
        .check {
          font-size: 14px;
          margin-bottom: 30px;
          overflow: hidden;
          .remember {
            display: block;
            float: left;
            position: relative;
            color: #b7b7b7;
            margin-left: 10%;
            line-height: 30px;
            input {
              margin-right: 5px;
            }
          }
        }
        .btn-login,
        .btn-facebook {
          width: 75%;
          height: 40px;
          line-height: 40px;
          display: block;
          position: relative;
          border-radius: 40px;
          color: white;
          font-size: 14px;
          margin-top: 20px;
          cursor: pointer;
        }
        .btn-login {
          background-color: #00a7de;
        }

        .btn-facebook {
          background-color: #528ade;
        }
      }
      .menu {
        width: 400px;
        height: 332px;
        color: white;
        float: right;
        margin-left: 135px;
        margin-top: 121px;
        ul {
          padding: 20px 0;
        }
        h2 {
          font-size: 24px;
          text-align: center;
          letter-spacing: 1px;
          text-shadow: 0px 2px 5px #000;
        }
        h3 {
          font-size: 17px;
          text-align: center;
          letter-spacing: 1px;
          line-height: 30px;
        }
        li {
          width: 100%;
          height: 60px;
          text-align: center;
        }
      }
    }
    .footer {
      width: 100%;
      height: 188px;
      color: #5f6d72;
      white-space: nowrap;
      text-align: center;
      line-height: 188px;
      background-color: white;
    }
  }
}

@include mq($mobile) {
  .container {
    position: relative;
    background: url("./img/bg-login.png") center top no-repeat;
    background-size: cover;
    .header {
      width: 100%;
      height: 1rem;
      border-bottom: solid 0.05rem #0088b8;
      position: relative;
      overflow: hidden;
      background-color: #00a0d8;
      .box-title {
        max-width: 100%;
        min-width: 3rem;
        height: 1rem;
        position: relative;
        margin: 0 auto;
      }

      .logo,
      .logo2 {
        float: left;
        position: relative;
        margin: 0.2rem 0 0.1rem 0.2rem;
        display: table-cell;
      }
      .logo {
        width: 1.87rem;
        position: relative;
        margin-top: -0.25rem;
        top: 50%;
      }
      .logo2 {
        width: 1.12rem;
        position: relative;
        margin-top: -.34rem;
        top: 50%;
      }

      .title {
        line-height: 1rem;
        min-width: 4rem;
        color: white;
        font-size: 0.3rem;
        text-align: center;
        display: table-cell;
        text-shadow: 0 0.02rem 0.05rem #000;
      }
    }
    .content {
      width: 6.5rem;
      height: 15rem;
      position: relative;
      margin: 0 auto;
      overflow: hidden;
      // border: 1px solid;
      .box-login {
        width: 6rem;
        height: 6.25rem;
        /*min-width: 240px;*/
        /*margin-top: 35px;*/
        margin: 0.5rem 0.24rem 0 1rem;
        // overflow: hidden;
        text-align: center;
        position: relative;
        float: right;
        border-radius: 0.1rem;
        border: solid 0.01rem #b7b7b7;
        background-color: white;
        .line-tab {
          width: 80%;
          height: 0.3rem;
          padding-top: 0.5rem;
          position: relative;
          margin: auto;
          div {
            width: 5rem;
            color: #9f9f9f;
            font-size: 0.14rem;
            display: table-cell;
            vertical-align: middle;
            p {
              text-align: center;
              padding: 0.05rem 0.2rem;
              white-space: nowrap;
            }
          }
          div.tab-title {
            width: 2rem;
            font-size: 0.3rem;
          }
        }
        .zoneBox,
        .roleBox {
          width: 78.5%;
          height: 0;
          position: absolute;
          background: white;
          border: 1px solid rgb(177, 176, 176);
          z-index: 2;
          top: 32%;
          left: 10.5%;
          overflow-x: auto;
          li {
            list-style: none;
            width: 40%;
            font-size: .18rem;
            padding: .1rem 0;
            margin: .05rem;
            float: left;
            cursor: pointer;
            position: relative;
            float: left;
          }
          li:hover {
            background-color: #7acae6;
          }
        }
        .roleBox {
          top: 48%;
        }
        .username,
        .password,
        .userzone,
        .userrole {
          width: 75%;
          height: 0.75rem;
          line-height: 0.4rem;
          font-size: 0.24rem;
          padding-left: 0.2rem;
          margin: 0.05rem auto;
          position: relative;
          border-radius: 0.05rem;
          border: solid 1px #b7b7b7;
          color: #b7b7b7;
        }
        .userrole,
        .password {
          margin-top: -0.25rem;
          vertical-align: middle;
        }
        .check {
          font-size: 0.18rem;
          margin-bottom: 0.3rem;
          overflow: hidden;
          .remember {
            display: block;
            float: left;
            position: relative;
            color: #b7b7b7;
            margin-left: 10%;
            line-height: 0.3rem;
            input {
              margin-right: 0.05rem;
            }
            span {
              font-size: 0.2rem;
            }
          }
        }
        .btn-login,
        .btn-facebook {
          width: 75%;
          height: 0.75rem;
          line-height: 0.4rem;
          display: block;
          position: relative;
          border-radius: 0.4rem;
          color: white;
          font-size: 0.24rem;
          margin-top: 0.2rem;
          cursor: pointer;
        }
        .btn-login {
          margin-top: 0.25rem;
          background-color: #00a7de;
        }

        .btn-facebook {
          background-color: #528ade;
        }
      }
      .menu {
        width: 100%;
        height: 6rem;
        color: white;
        float: right;
        margin-left: 1.35rem;
        margin-top: 1.21rem;
        // border: 1px solid;
        position: relative;
        ul {
          padding: 0.2rem 0;
          li {
            font-size: 0.17rem;
            width: 100%;
            height: 1rem;
            text-align: center;
            h3 {
              font-size: 0.24rem;
              text-align: center;
              letter-spacing: 1px;
              line-height: 0.45rem;
            }
          }
        }
        h2 {
          width: 100%;
          position: absolute;
          top: 0.3rem;
          font-size: 0.35rem;
          text-align: center;
          letter-spacing: 1px;
          text-shadow: 0 0.02rem 0.05rem #000;
        }
        .imgs {
          width: 7rem;
          margin-left: -1rem;
        }
      }
      @media only screen and (max-width: 600px) {
        .box-login {
          float: none;
          margin: 1rem auto 0;
          .title {
            letter-spacing: 0;
          }
        }

        .menu {
          max-width: 100%;
          margin: 0.5rem auto;
          float: none;
        }
      }
    }
    .footer {
      width: 100%;
      height: 1.88rem;
      font-size: 0.24rem;
      color: #5f6d72;
      white-space: nowrap;
      text-align: center;
      line-height: 1.88rem;
      background-color: white;
    }
  }
  @media only screen and (orientation: landscape) {
    .container {
      position: relative;
      background: url("./img/bg-login.png") center top no-repeat;
      background-size: cover;
      .header {
        width: 100%;
        height: 0.6rem;
        border-bottom: solid 0.05rem #0088b8;
        position: relative;
        overflow: hidden;
        background-color: #00a0d8;
        .box-title {
          max-width: 100%;
          min-width: 3rem;
          height: 1rem;
          position: relative;
          margin: 0 auto;
        }

        .logo,
        .logo2 {
          float: left;
          position: relative;
          margin: 0.1rem 0 0.1rem 0.2rem;
          display: table-cell;
        }
        .logo {
          width: 1.1rem;
          position: relative;
          margin-top: -0.34rem;
          top: 50%;
        }
        .logo2 {
          width: 0.7rem;
          position: relative;
          margin-top: -0.42rem;
          top: 50%;
        }

        .title {
          line-height: 0.6rem;
          min-width: 4rem;
          color: white;
          font-size: 0.2rem;
          text-align: center;
          display: table-cell;
          /*letter-spacing: 30px;*/
          text-shadow: 0 0.02rem 0.05rem #000;
        }
      }
      .content {
        width: 90%;
        height: 4rem;
        position: relative;
        margin: 0 auto;
        overflow: hidden;
        .box-login {
          width: 45%;
          height: 3rem;
          /*min-width: 240px;*/
          /*margin-top: 35px;*/
          margin: 0.25rem 0.24rem 0 0rem;
          // overflow: hidden;
          text-align: center;
          position: relative;
          float: right;
          border-radius: 0.1rem;
          border: solid 0.01rem #b7b7b7;
          background-color: white;
          .line-tab {
            width: 80%;
            height: 0.3rem;
            padding-top: 0.15rem;
            position: relative;
            margin: auto;
            div {
              width: 5rem;
              color: #9f9f9f;
              font-size: 0.14rem;
              display: table-cell;
              vertical-align: middle;
              p {
                text-align: center;
                padding: 0.05rem 0.2rem;
                white-space: nowrap;
              }
            }
            div.tab-title {
              width: 2rem;
              font-size: 0.14rem;
            }
          }
          .zoneBox,
          .roleBox {
            width: 78.5%;
            height: 0;
            position: absolute;
            background: white;
            border: 1px solid rgb(177, 176, 176);
            z-index: 2;
            top: 30%;
            left: 10.5%;
            overflow-x: auto;
            li {
              list-style: none;
              width: 40%;
              font-size: .1rem;
              padding: .05rem 0;
              margin: .05rem;
              float: left;
              cursor: pointer;
              position: relative;
              float: left;
            }
            li:hover {
              background-color: #7acae6;
            }
          }
          .roleBox {
            top: 48%;
          }

          .username,
          .password,
          .userzone,
          .userrole {
            width: 75%;
            height: 0.4rem;
            line-height: 0.4rem;
            font-size: 0.14rem;
            padding-left: 0.2rem;
            margin: 0.05rem auto;
            position: relative;
            border-radius: 0.05rem;
            border: solid 1px #b7b7b7;
            color: #b7b7b7;
          }
          .userzone{
              float: left;
              margin-left: 9%;
          }
          .username {
            float: left;
            margin: 0.15rem 0 0 0.27rem;
          }          
          .userrole,
          .password {
            margin-top: -0.65rem;
            vertical-align: middle;
          }
          .check {
            font-size: 0.14rem;
            margin-top: -.6rem;
            margin-bottom: 0.3rem;
            overflow: hidden;
            .remember {
              display: block;
              float: left;
              position: relative;
              color: #b7b7b7;
              margin-left: 10%;
              line-height: 0.3rem;
              input {
                margin-right: 0.05rem;
              }
              span {
                font-size: 0.12rem;
              }
            }
          }
          .btn-login,
          .btn-facebook {
            width: 75%;
            height: 0.35rem;
            line-height: 0.4rem;
            display: block;
            position: relative;
            border-radius: 0.4rem;
            color: white;
            font-size: 0.14rem;
            margin-top: 0.15rem;
            cursor: pointer;
          }
          .btn-login {
            margin-top: -.3rem;
            background-color: #00a7de;
          }

          .btn-facebook {
            background-color: #528ade;
          }
        }
        .menu {
          width: 40%;
          height: 3rem;
          color: white;
          float: left;
          margin-left: 0.25rem;
          margin-top: 0.25rem;
          position: relative;
          ul {
            color: white;
            padding: 0.2rem 0;
            li {
              font-size: 0.14rem;
              width: 100%;
              height: .7rem;
              text-align: center;
              h3 {
                font-size: 0.16rem;
                text-align: center;
                letter-spacing: 1px;
                line-height: 0.35rem;
              }
              h3:nth-child(1){
                    padding-top: .1rem;
              }
            }
          }
          h2 {
            width: 100%;
            position: absolute;
            top: 0;
            font-size: 0.18rem;
            text-align: center;
            letter-spacing: 1px;
            text-shadow: 0 0.02rem 0.05rem #000;
          }
          .imgs {
            width: 100%;
            margin-left: 0rem;
            float: left;
            margin-top: .4rem
          }
        }
        @media only screen and (max-width: 600px) {
          .box-login {
            float: none;
            margin: 1rem auto 0;
            .title {
              letter-spacing: 0;
            }
          }

          .menu {
            max-width: 100%;
            margin: 0.5rem auto;
            float: none;
          }
        }
      }
      .footer {
        width: 100%;
        height: .6rem;
        font-size: 0.14rem;
        color: #5f6d72;
        white-space: nowrap;
        text-align: center;
        line-height: .6rem;
        background-color: white;
      }
    }
  }
}
</style>

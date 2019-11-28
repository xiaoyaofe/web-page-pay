<template>
  <div class="container">
    <div class="header">
      <div class="box-title">
        <!-- <img src="../login/img/logo.png" alt="POCKET" class="logo"> -->
        <img src="../login/img/logo2.png" class="logo2">
        <p class="title">{{language.headerTitle}}</p>
      </div>
    </div>
    <div class="contents">
      <section class="content-left">
        <div class="box-info">
          <div class="box-head">
            <img src="./img/head.png">
          </div>
          <div class="box-balance">
            <p>{{userName}}</p>
            <button class="btn-logout" @click="logOut">{{language.login.logout}}</button>
          </div>
        </div>

        <div class="box-menu" v-show="1">
          <h1>
            <img src="./img/icon-chargetype.png">
            <p class="I18N">{{language.public.chooseType}}</p>
          </h1>
          <ul class="recharge-type">
            <li
              v-for="(item,index) in payWayArr"
              :key="index"
              :class="index==payWayIndex?'active':''"
              @click="selectPayWay(index,item.name.slice(0,4))"
            >
              {{item.name}}
              <span>&gt;&gt;&gt;</span>
            </li>
          </ul>
        </div>
      </section>
      <dynamic :propsData="payWayArr" v-show="1"></dynamic>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import $ from "jquery";
import "../../plugins/jquery.jqpagination.min.js";
import Dynamic from "./dynamic/Dynamic.vue";
declare var CONFIG: Object;
import { getZoneList, getRole, logout, getPayList } from "../../common/api";
import {
  isMobile,
  checkOrient,
  isLogin,
  createSigntrue,
  getCurrentTime,
  createPayListSign,
  createRoleSignture
} from "../../common/common";

export default Vue.extend({
  name: "Index",
  components: {
    Dynamic
  },
  data() {
    return {
      payWayArr: [], //支付列表
      nodesArr: [], //支付子类
      payWayIndex: 0,
      payChange: false,
      language: CONFIG["language"],
      level: sessionStorage.getItem("level"), //角色等级
      roleId: sessionStorage.getItem("roleId"), //角色ID
      userId: sessionStorage.getItem("userId"), //用户ID
      userName: sessionStorage.getItem("username") //账号名
    };
  },
  watch: {
    $route(to, from) {
      let index: any = this.$route.query.index;
      this.payWayIndex = index;
    }
  },
  async created() {
    if (isLogin()) {
      // 初始化获取支付列表
      let data: any = {
        appId: CONFIG["data"].appId,
        advChannel: "-2",
        userId: this.userId,
        gameCoin:50,
        level: this.level,
        // source: "",
        // network: "",
        network: 2,
        source: 2,
        sign: ""
      };
      data.sign = createPayListSign(data);
      data.roleId = this.roleId;
      data.version = "10.0.0";
      await getPayList(data).then((result: any) => {
        this.payWayArr = result.payments;
        this.nodesArr = result.payments[0];
        let index: any = this.payWayIndex;
        this.$router.push({
          path: "/index/" + result.payments[0].name.slice(0, 4),
          query: { index: index }
        });
      });
    } else {
      // console.log(isLogin());
      this.$router.push({ name: "login" });
    }
  },
  methods: {
    // 登出
    logOut() {
      logout().then(result => {
        sessionStorage.clear();
        this.$router.push({ name: "login" });
        console.log("退出登录 \r\n" + result);
      });
    },
    //切换支付方式
    selectPayWay(index, path) {
      if (isLogin()) {
        let arr: any = this.payWayArr;
        this.payWayIndex = index;
        this.nodesArr = arr[this.payWayIndex];
        this.$router.push({ path: "/index/" + path, query: { index: index } });
        this.payChange = true;
      } else {
        alert(CONFIG["language"].login.expired);
        this.$router.push({ name: "login" });
      }
    }
  }
});
</script>
<style lang="scss" scoped>
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
      }
    }
    .contents {
      max-width: 1100px;
      min-width: 300px;
      position: relative;
      margin: 0 auto;
      background-color: white;
      .content-left {
        width: 240px;
        vertical-align: top;
        display: table-cell;
        .box-info,
        .box-menu {
          width: 98%;
          min-width: 240px;
          margin-top: 35px;
          padding: 20px 0;
          overflow: hidden;
          text-align: center;
          position: relative;
          border-radius: 10px;
          border: solid 1px #b7b7b7;
        }
        .btn-sms-charge,
        .btn-bank-charge,
        .btn-card-charge,
        .btn-question,
        .btn-pay,
        .btn-logout,
        .btn-login,
        .link-facebook {
          width: 75%;
          height: 40px;
          line-height: 40px;
          display: block;
          position: relative;
          border-radius: 40px;
          color: white;
          font-size: 14px;
          margin-top: 10px;
          cursor: pointer;
        }
        .btn-logout {
          height: 30px;
          line-height: 30px;
          color: #555;
          font-size: 12px;
          letter-spacing: 2px;
          border-radius: 30px;
          border: solid 1px #b7b7b7;
          background-color: white;
        }
        .link-facebook {
          background-color: #528ade;
        }

        .box-menu {
          margin-top: 23px;
          h1 {
            font-size: 14px;
            color: #3f5761;
            overflow: hidden;
            padding-bottom: 10px;
            border-bottom: solid 1px #b7b7b7;
            img {
              display: block;
              float: left;
              padding: 0 15px;
            }
            p {
              display: block;
              float: left;
            }
          }
          .recharge-type {
            padding: 10px 0;
            line-height: 44px;
            font-size: 14px;
            text-align: left;
            color: #424242;
            li.active {
              color: #1598d0;
              background-color: #eef2f5;
              border-left: solid 2px #1598d0;
            }
            li.active a {
              color: #1598d0;
            }
            li {
              padding-left: 50px;
              margin-top: 10px;
              cursor: pointer;
              a {
                color: #424242;
              }
              span {
                display: none;
              }
            }
          }
        }
        .box-head {
          width: 100%;
          position: relative;
          overflow: hidden;
          margin-bottom: 5px;
          img {
            /*margin-left: 20px;*/
            display: block;
            /*float: left;*/
            border-radius: 27px;
            border: solid 1px #b7b7b7;
          }
          p {
            display: block;
            /*float: left;*/
            /*line-height: 54px;*/
            line-height: 50px;
            font-size: 14px;
            padding-left: 10px;
          }
        }
        .box-balance {
          width: 100%;
          h3 {
            font-size: 12px;
            line-height: 30px;
            color: #aabac0;
            font-weight: 100;
          }
          p {
            line-height: 35px;
            font-size: 12px;
            color: #2996c4;
          }
          span {
            font-size: 16px;
            font-weight: bold;
            font-family: Arial, sans-serif;
          }
        }
      }
    }
  }
}

@include mq($mobile) {
  .container {
    position: relative;
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
        /*letter-spacing: 30px;*/
        text-shadow: 0 0.02rem 0.05rem #000;
      }
    }
    .contents {
      width: 98%;
      height: 16.5rem;
      position: relative;
      margin: 0 auto;
      // border: 1px solid;
      overflow: hidden;
      .content-left {
        width: 90%;
        vertical-align: top;
        // display: table-cell;
        // border: 1px solid;
        .box-info,
        .box-menu {
          width: 100%;
          // min-width: 240px;
          margin-top: 0.35rem;
          padding: 0.2rem 0;
          overflow: hidden;
          text-align: center;
          position: relative;
          border-radius: 0.1rem;
          border: solid 1px #b7b7b7;
        }
        .btn-sms-charge,
        .btn-bank-charge,
        .btn-card-charge,
        .btn-question,
        .btn-pay,
        .btn-logout,
        .btn-login,
        .link-facebook {
          width: 75%;
          height: 0.4rem;
          line-height: 0.4rem;
          display: block;
          position: relative;
          border-radius: 0.4rem;
          color: white;
          font-size: 0.14rem;
          margin-top: 0.1rem;
          cursor: pointer;
        }
        .btn-logout {
          height: 0.45rem;
          line-height: 0.3rem;
          color: #555;
          font-size: 0.14rem;
          letter-spacing: 0.02rem;
          border-radius: 0.3rem;
          border: solid 1px #b7b7b7;
          background-color: white;
        }
        .link-facebook {
          background-color: #528ade;
        }

        .box-menu {
          margin-top: 0.23rem;
          h1 {
            font-size: 0.24em;
            color: #3f5761;
            overflow: hidden;
            padding-bottom: 0.1rem;
            border-bottom: solid 1px #b7b7b7;
            img {
              width: 0.25rem;
              display: block;
              float: left;
              padding: 0.05rem 0.15rem 0 0.3rem;
            }
            p {
              display: block;
              float: left;
            }
          }
          .recharge-type {
            padding: 0.1rem 0;
            line-height: 0.6rem;
            font-size: 0.18rem;
            text-align: left;
            color: #424242;
            li.active {
              color: #1598d0;
              background-color: #eef2f5;
              border-left: solid 2px #1598d0;
            }
            li.active a {
              color: #1598d0;
            }
            li {
              padding-left: 0.5rem;
              padding-right: 0.5rem;
              margin-top: 0.1rem;
              cursor: pointer;
              a {
                color: #424242;
              }
              span {
                color: gray;
                float: right;
              }
            }
          }
        }
        .box-head {
          width: 20%;
          float: left;
          position: relative;
          overflow: hidden;
          margin-bottom: 5px;
          img {
            width: 0.9rem;
            margin-left: 0.35rem;
            margin-top: 0.1rem;
            border: none;
            display: block;
            float: left;
            border-radius: 27px;
            // border: solid 1px #b7b7b7;
          }
          p {
            display: block;
            float: left;
            /*line-height: 54px;*/
            line-height: 0.45rem;
            font-size: 0.24rem;
            padding-top: 0.15rem;
            padding-left: 0.5rem;
          }
        }
        .box-balance {
          width: 45%;
          float: left;
          // margin-top: -5%;
          // margin-left: 22%;
          p {
            display: block;
            float: left;
            line-height: 0.6rem;
            font-size: 0.24rem;
            // padding-top: 0.15rem;
            padding-left: 0.5rem;
            // color: #2996c4;
          }
          // h3 {
          //   font-size: 12px;
          //   line-height: 30px;
          //   color: #aabac0;
          //   font-weight: 100;
          // }
          // p {
          //   line-height: 35px;
          //   font-size: 12px;
          //   color: #2996c4;
          // }
          // span {
          //   font-size: 16px;
          //   font-weight: bold;
          //   font-family: Arial, sans-serif;
          // }
        }
      }
    }
  }
  @media only screen and (orientation: landscape) {
    .container {
      position: relative;
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
      .contents {
        width: 98%;
        height: auto;
        position: relative;
        margin: 0 auto;
        margin-bottom: 0.3rem;
        // border: 1px solid;
        overflow: hidden;
        .content-left {
          width: 1.8rem;
          margin-right: 0.15rem;
          vertical-align: top;
          display: table-cell;
          .box-info,
          .box-menu {
            width: 98%;
            min-width: 1.8rem;
            margin-top: 0.15rem;
            padding: 0.2rem 0;
            overflow: hidden;
            text-align: center;
            position: relative;
            border-radius: 0.1rem;
            border: solid 1px #b7b7b7;
          }
          .box-info {
            padding: 0.1rem 0 0 0;
          }
          .btn-sms-charge,
          .btn-bank-charge,
          .btn-card-charge,
          .btn-question,
          .btn-pay,
          .btn-logout,
          .btn-login,
          .link-facebook {
            width: 75%;
            height: 0.4rem;
            line-height: 0.4rem;
            display: block;
            position: relative;
            border-radius: 0.4rem;
            color: white;
            font-size: 0.14rem;
            margin-top: 0.1rem;
            cursor: pointer;
          }
          .btn-logout {
            height: 0.3rem;
            line-height: 0.3rem;
            color: #555;
            font-size: 0.12rem;
            letter-spacing: 2px;
            margin-bottom: 0.2rem;
            margin-left: 13%;
            border-radius: 0.3rem;
            border: solid 1px #b7b7b7;
            background-color: white;
          }
          .link-facebook {
            background-color: #528ade;
          }

          .box-menu {
            // margin-top: .23rem;
            h1 {
              font-size: 0.12rem;
              color: #3f5761;
              overflow: hidden;
              padding-bottom: 0.1rem;
              border-bottom: solid 1px #b7b7b7;
              img {
                width: 0.17rem;
                display: block;
                float: left;
                padding: 0 0.15rem;
              }
              p {
                display: block;
                float: left;
              }
            }
            .recharge-type {
              padding: 0.1rem 0;
              line-height: 0.44rem;
              font-size: 0.14rem;
              text-align: left;
              color: #424242;
              li.active {
                color: #1598d0;
                background-color: #eef2f5;
                border-left: solid 2px #1598d0;
              }
              li.active a {
                color: #1598d0;
              }
              li {
                padding-left: 0.15rem;
                margin-top: 0.1rem;
                cursor: pointer;
                a {
                  color: #424242;
                }
                span {
                  display: none;
                }
              }
            }
          }
          .box-head {
            width: 100%;
            position: relative;
            overflow: hidden;
            margin-bottom: 5px;
            text-align: center;
            img {
              margin-left: 25%;
              display: block;
              border-radius: 50%;
              // border: solid 1px #b7b7b7;
            }
            p {
              display: block;
              /*float: left;*/
              /*line-height: 54px;*/
              line-height: 0.5rem;
              font-size: 0.14rem;
              padding-left: 0.1rem;
            }
          }
          .box-balance {
            width: 100%;
            float: none;
            position: static;
            margin: auto;
            h3 {
              font-size: 0.12rem;
              line-height: 30px;
              color: #aabac0;
              font-weight: 100;
            }
            p {
              width: 100%;
              line-height: 0.35rem;
              font-size: 0.12rem;
              color: #2996c4;
              text-align: center;
              padding-left: 0;
              padding-top: 0;
            }
            span {
              font-size: 0.16rem;
              font-weight: bold;
              font-family: Arial, sans-serif;
            }
          }
        }
      }
    }
  }
}
</style>

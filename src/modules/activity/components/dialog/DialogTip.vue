<template>
  <transition name="fadeIn">
    <div class="DialogTip" v-show="showDialog">
      <!--提示窗  -->
      <div class="tipBox" v-show="toastName == 'tip'">
        <p class="tipTxt">{{content}}</p>
        <button @click="close" class="close"></button>
      </div>
      <!-- loading窗 -->
      <div class="loadingBox" v-show="toastName == 'loading'"></div>
      <!-- 礼包弹窗 -->
      <div class="rewardBox" v-show="toastName === 'reward'">
        <button @click="close" class="close">X</button>
        <section v-if="!rewardArr.length">当前没有礼包数据</section>
        <section class="rewardContainer"  v-if="rewardArr.length">
          <div class="table-head">
            <div class="table-head-wrap">
              <table class="grid" style="width：745px">
                <!-- <colgroup>
                  <col style="width:80px">
                  <col>
                  <col style="width:150px">
                </colgroup>-->
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>礼包名</th>
                    <th>时间</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div class="table-content">
            <table class="grid">
              <!-- <colgroup>
                <col style="width:80px">
                <col>
                <col>
                <col style="width:150px">
              </colgroup>-->
              <tbody>
                <tr v-for="(item,index) in rewardArr" :key="index">
                  <td
                    :style="parseInt(index%2)?{ background:'#DADADA' }:{ background:'#e9f5ff' }"
                  >{{index+1}}</td>
                  <td
                    :style="parseInt(index%2)?{ background:'#DADADA' }:{ background:'#e9f5ff' }"
                  >{{item.rewardName}}</td>
                  <td
                    :style="parseInt(index%2)?{ background:'#DADADA' }:{ background:'#e9f5ff' }"
                  >{{item.time}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
      <!-- 愿望弹窗 -->
      <div class="rewardBox" v-show="toastName === 'lucky'">
        <button @click="close" class="close">X</button>
        <section v-if="!luckyArr.length">当前没有礼包数据</section>
        <section v-if="luckyArr.length" class="rewardContainer">
          <p>Lucky List</p>
          <div class="table-head">
            <div class="table-head-wrap">
              <table class="grid" >
                <!-- <colgroup>
                  <col style="width:80px">
                  <col>
                  <col style="width:150px">
                </colgroup>-->
                <thead>
                  <tr>
                    <th>序号</th>
                    <th>区服</th>
                    <th>角色</th>
                  </tr>
                </thead>
              </table>
            </div>
          </div>
          <div class="table-content">
            <table class="grid">
              <!-- <colgroup>
                <col style="width:80px">
                <col>
                <col>
                <col style="width:150px">
              </colgroup>-->
              <tbody>
                <tr v-for="(item,index) in luckyArr" :key="index">
                  <td
                    :style="parseInt(index%2)?{ background:'#DADADA' }:{ background:'#e9f5ff' }"
                  >{{index+1}}</td>
                  <td
                    :style="parseInt(index%2)?{ background:'#DADADA' }:{ background:'#e9f5ff' }"
                  >{{item.server}}</td>
                  <td
                    :style="parseInt(index%2)?{ background:'#DADADA' }:{ background:'#e9f5ff' }"
                  >{{item.player}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  </transition>
</template>
<script lang="ts">
import Vue from "vue";
export default Vue.extend({
  name: "DialogTip",
  props: {
    InstatceShowDialog: {
      type: Boolean,
      default: false
    },
    content: {
      type: String,
      default: "提示信息"
    }
  },
  data() {
    return {
      toastName: "",
      toastHide: true,
      showDialog: false,
      rewardArr: [],
      luckyArr: []
    };
  },
  watch: {
    // InstatceShowDialog(newValue, oldValue) {
    //   this.showDialog = newValue;
    // },
  },
  methods: {
    close() {
      this.showDialog = false;
    },
    open() {
      this.showDialog = true;
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
.DialogTip {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  background: rgba(17, 31, 50, 0.5);
  .tipBox {
    width: 600px;
    height: 150px;
    background: rgb(194, 226, 236);
    border: 8px solid white;
    border-radius: 15px;
    position: fixed;
    top: 50%;
    left: 50%;
    margin-left: -300px;
    margin-top: -75px;
    .tipTxt {
      width: 865px;
      position: absolute;
      top: 50%;
      left: 46%;
      -webkit-transform: translate(-50%, -50%);
      -moz-transform: translate(-50%, -50%);
      -o-transform: translate(-50%, -50%);
      -ms-transform: translate(-50%, -50%);
      transform: translate(-50%, -50%);
      text-align: center;
      padding: 0 30px;
      font-size: 22px;
      color: gray;
    }
    .close {
      width: 75px;
      height: 75px;
      border: none;
      border-radius: 50%;
      background: none;
      outline: none;
      position: absolute;
      top: 0;
      right: 0;
      cursor: pointer;
    }
  }
  @include mq($pc) {
    .loadingBox {
      width: 80px;
      height: 80px;
      position: fixed;
      top: 50%;
      left: 50%;
      background: url("./img/loading.gif");
      margin-left: -40px;
      margin-top: -40px;
    }
  }
    @include mq($mobile) {
    .loadingBox {
      width: .8rem;
      height: .8rem;
      position: fixed;
      top: 50%;
      left: 50%;
      background: url("./img/loading.gif");
      background-size: 100%;
      margin-left: -.4rem;
      margin-top: -.4rem;
    }
  }

  
  .rewardBox {
    width: 800px;
    height: 600px;
    position: relative;
    top: 50%;
    left: 50%;
    margin-left: -400px;
    margin-top: -300px;
    background: lightblue;
    border: 5px solid white;
    border-radius: 15px;
    .close {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: red;
      color: white;
      font-size: 30px;
      border: 5px solid white;
      position: absolute;
      top: -25px;
      right: -25px;
    }
    .rewardContainer {
      width: 750px;
      height: 550px;
      margin-left: -375px;
      margin-top: -275px;
      position: relative;
      top: 50%;
      left: 50%;
      .grid {
        margin: 0px;
        table-layout: fixed;
        width: 100%;
        max-width: none;
        border-spacing: 0px;
        empty-cells: show;
        border-width: 0px;
        outline: 0px none;
        border-collapse: collapse;
      }
      .grid tr th {
        padding: 0.929em 0.5em;
        vertical-align: bottom;
        overflow: hidden;
        border: 1px #e6e6e6 solid;
        background: rgb(218, 218, 218);
        font-weight: normal;
        white-space: nowrap;
        text-overflow: ellipsis;
        text-align: center;
      }
      .grid tr th:first-child {
        border-left-width: 0;
      }
      .grid tr td {
        border-left: 1px #e6e6e6 solid;
        border-bottom: 1px #e6e6e6 solid;
        padding: 0.929em 0.5em;
        overflow: hidden;
        line-height: 1.6em;
        vertical-align: middle;
        text-overflow: ellipsis;
        text-align: center;
      }
      .grid tr td:first-child {
        border-left-width: 0px;
      }
      .grid tr:last-child td {
        border-bottom: none;
      }
      .tab-link {
        display: block;
        min-height: 18px;
        line-height: 18px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .table-content {
        height: 500px;
        white-space: normal;
        position: relative;
        width: 100%;
        overflow-x: auto;
        overflow-y: scroll;
        min-height: 0;
      }
      .data-grid {
        width: 698px;
        height: 201px;
        position: relative;
        overflow: hidden;
        font-size: 14px;
        color: #444;
        box-sizing: border-box;
        border-color: #95b8e7;
        border-width: 1px;
        border-style: solid;
      }
      .data-view {
        width: 698px;
        position: absolute;
        overflow: hidden;
        top: 0px;
        right: 0px;
      }
      .grid-head {
        width: 698px;
        height: 30px;
        border-color: #ddd;
        overflow: hidden;
        cursor: default;
        border-width: 0px 0px 1px;
        border-style: solid;
        background-color: #efefef;
      }
      .grid-head-inner {
        display: block;
        float: left;
      }
      // .tbody {
      //   width: 100%;
      //   height: 500px;
      //   border: 1px solid;
      //   overflow-y: scroll;
      // }
      // table thead,
      // tbody tr {
      //   display: table;
      //   width: 100%;
      //   table-layout: fixed;
      // }
      // .tabtop13 td {
      //   background-color: #dadada;
      //   height: 55px;
      //   line-height: 150%;
      //   text-align: center;
      // }
    }
  }
}
</style>

<template>
  <el-row class="zone-management" type="flex" justify="center" align="middle">
    <el-card class="main">
      <el-tabs v-model="version" type="card" @tab-click="ChangeVersion">
         <!-- version1的面板 -->
        <el-tab-pane class="pane" label="区服管理v1.0" name="v1">
           <!--version1的面板 -->
          <el-container v-show='version === "v1"' style="width:100%; height:100%; min-width:1200px; margin:0 auto;">
             <ApolloQuery :query="require('@/graphql/ZoneManagement.gql').games" :variables="{version:versionNum}"  @result="DoneOfGames">
              <template slot-scope="{ result: { data } }">
                <el-aside width="16vw" style="min-width: 250px;background-color: rgb(238, 241, 246); height:100%">
                  <el-menu :default-active="defaultGame" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-submenu index="1">
                      <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">游戏应用</span>
                      </template>
                        <el-menu-item v-for="(item,index) in games" :key='item.id' :index="'1-' + (index + 1)" @click="selectGame($event,item)">{{item.appName}}</el-menu-item>
                    </el-submenu>
                  </el-menu>
                </el-aside>
              </template>
            </ApolloQuery>
            <ApolloQuery v-if='appId' :query="require('@/graphql/ZoneManagement.gql').zones" 
            :variables="{version: versionNum,data:{appId,pageCount:currentPage, refresh}}" 
             @result="DoneOfZones">
              <template slot-scope="{ result: { data} }">
                <el-main style="height:100%; width:82vw;min-width:750px;padding-top:0;">
                  <el-row type="flex" justify='end'>
                    <el-button type="primary" @click="dialogVisible(true,'add')" size="small">
                      添加<i class="el-icon-plus el-icon--right"></i>
                    </el-button>
                  </el-row>
                  <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="zones1"
                    height='88%'
                    :row-style="{height:'20px'}"
                    :cell-style="{textAlign:'center'}"
                    :header-cell-style="{textAlign:'center', color:'#000'}"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="zoneId"
                      label="游戏区ID"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="mainGameZoneId"
                      label="主区ID">
                    </el-table-column>
                    <el-table-column
                      prop="zoneName"
                      label="游戏区名">
                    </el-table-column>
                    <el-table-column
                      prop="gameZoneId"
                      label="第三方游戏区ID"
                      >
                    </el-table-column>
                     <el-table-column
                      prop="status"
                      label="状态">
                    </el-table-column>
                    <el-table-column
                      prop="openTime"
                      label="开服时间">
                    </el-table-column>
                   
                    <el-table-column
                      width='120px'
                      label="操作">
                      <template slot-scope="scope">
                        <span class="el-icon-edit-outline"></span>
                        <el-button
                          @click="handleEditer(scope.$index, scope.row)"
                          type="text"
                          size="small">
                          编辑
                        </el-button>
                        <span class="el-icon-edit-outline"></span>
                        <el-button
                          @click="mergeZone(scope.$index, scope.row)"
                          type="text"
                          size="small">
                          合区
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-row type="flex" class="row-bg _pagination" justify="space-around">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[15]"
                      :page-size="15"
                      layout="total, sizes, prev, pager, next"
                      background
                      :total="zonesSize">
                    </el-pagination>
                  </el-row>
                  <el-dialog title="" :visible.sync="dialogTableVisible"  :append-to-body='true' center>
                    <el-form :model="form1" :rules="rules1" :label-width="formLabelWidth" >
                      <el-form-item v-if="formItemVariable.zoneId" label="游戏区ID：" prop="zoneId">
                        <el-input v-model="form1.zoneId" autocomplete="off" :placeholder="translation.placeholder.zoneId" disabled></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.zoneName" label="游戏区名称：" prop="zoneName" >
                        <el-input v-model="form1.zoneName" autocomplete="off" :placeholder="translation.placeholder.zoneName" :disabled='form1EditDISable.zoneName'></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.mainGameZoneId && !dialogTableVisible3" label="主区ID：" prop="mainGameZoneId" >
                        <el-input v-model="form1.mainGameZoneId" autocomplete="off" :placeholder="translation.placeholder.mainGameZoneId" :disabled='form1EditDISable.mainGameZoneId'></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.gameZoneId" label="第三方游戏区ID：" prop="gameZoneId">
                        <el-input v-model="form1.gameZoneId" autocomplete="off" :placeholder="translation.placeholder.thirdGameZoneId" :disabled='form1EditDISable.gameZoneId'></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.status" label="区服状态："  prop="status">
                        <el-radio-group v-model="form1.status">
                          <el-radio :label="1">正常(1)</el-radio>
                          <el-radio :label="2">测试待开服(2)</el-radio>
                          <el-radio :label="3">待处理(3)</el-radio>
                          <el-radio :label="0">已合区(0)</el-radio>
                          <el-radio :label="-1">停止运营(-1)</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.openTime" label="开服时间：" class="zone-time" prop="openTime"> 
                        <el-date-picker
                          v-model="form1.openTime"
                          type="datetime"
                          placeholder="选择日期时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          >
                        </el-date-picker>
                      </el-form-item>
                       <ApolloQuery :query="require('@/graphql/ZoneManagement.gql').mainZoneList" :variables="{version:'1',data:{appId}}"  @result="DoneOfMainZoneList">
                        <template slot-scope="{ result: { data } }">   
                          <el-form-item v-if="formItemVariable.mainGameZoneId && dialogTableVisible3" label="主区服名称：" :label-width="formLabelWidth" prop="mainGameZoneId">
                            <el-select v-model="form1.mainGameZoneId" :placeholder="translation.placeholder.mainGameZoneName">
                              <el-option v-for="(item,index) in mainZoneList" :key="item.id" :label="item.zoneName" :value="index"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </ApolloQuery>  
                    </el-form>

                    <ApolloMutation v-if='dialogTableVisible1' :mutation="require('@/graphql/ZoneManagement.gql').addZoneInfo" @done="DoneOfAddZone">
                     <template slot-scope="{ mutate }">
                        <div  slot="footer" class="dialog-footer">
                          <el-row type="flex" justify='center'>
                            <el-button @click="dialogVisible (false,'add')">取 消</el-button>
                            <el-button type="primary" @click="addZone2(mutate)">保 存</el-button>
                          </el-row>
                        </div>
                      </template>
                    </ApolloMutation>

                    <ApolloMutation v-else-if="dialogTableVisible2" :mutation="require('@/graphql/ZoneManagement.gql').editZoneInfo" @done="DoneOfEditZone">
                      <template slot-scope="{ mutate }">
                        <div  slot="footer" class="dialog-footer">
                          <el-row type="flex" justify='center'>
                            <el-button @click="dialogVisible (false,'edit')">取 消</el-button>
                            <el-button type="primary" @click="editZone2(mutate)">保 存</el-button>
                          </el-row>
                        </div>
                      </template>
                    </ApolloMutation> 

                    <ApolloMutation v-else-if="dialogTableVisible3" :mutation="require('@/graphql/ZoneManagement.gql').mergeZone" @done="DoneOfMergeZone">
                      <template slot-scope="{ mutate }">
                        <div  slot="footer" class="dialog-footer">
                          <el-row type="flex" justify='center'>
                            <el-button @click="dialogVisible (false,'merge')">取 消</el-button>
                            <el-button type="primary" @click="mergeZone2(mutate)">保 存</el-button>
                          </el-row>
                        </div>
                      </template>
                    </ApolloMutation>
                  </el-dialog>
                </el-main>
             </template>
            </ApolloQuery>
          </el-container>
        </el-tab-pane>
        <!-- version2的面板 -->
        <el-tab-pane class="pane" label="区服管理v2.0" name="v2">
          
          <el-container v-show='version === "v2"' style="width:100%; height:100%; min-width:1200px; margin:0 auto;">
            <ApolloQuery :query="require('@/graphql/ZoneManagement.gql').games" :variables="{version:versionNum}"  @result="DoneOfGames">
              <template slot-scope="{ result: { data } }">
                <el-aside width="16vw" style="min-width: 250px;background-color: rgb(238, 241, 246); height:100%">
                  <el-menu :default-active="defaultGame" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
                    <el-submenu index="1">
                      <template slot="title">
                        <i class="el-icon-menu"></i>
                        <span slot="title">游戏应用</span>
                      </template>
                        <el-menu-item v-for="(item,index) in games" :key='item.id' :index="'1-' + (index + 1)" @click="selectGame($event,item)">{{item.appName}}</el-menu-item>
                    </el-submenu>
                  </el-menu>
                </el-aside>
              </template>
            </ApolloQuery>
            <ApolloQuery v-if='appId' :query="require('@/graphql/ZoneManagement.gql').zones" 
            :variables="{version: versionNum,data:{appId,pageCount:currentPage, refresh}}" 
             @result="DoneOfZones">
              <template slot-scope="{ result: { data} }">
                <el-main style="height:100%; width:80vw;min-width:750px;padding-top:0;">
                  <el-row type="flex" justify='end'>
                    <el-button type="primary" @click="dialogVisible(true,'add')" size="small">
                      添加<i class="el-icon-plus el-icon--right"></i>
                    </el-button>
                  </el-row>
                  <el-table
                    v-loading="loading"
                    element-loading-text="拼命加载中..."
                    element-loading-spinner="el-icon-loading"
                    element-loading-background="rgba(0, 0, 0, 0.8)"
                    :data="zones"
                    height='88%'
                    :row-style="{height:'20px'}"
                    :cell-style="{textAlign:'center'}"
                    :header-cell-style="{textAlign:'center', color:'#000'}"
                    border
                    style="width: 100%">
                    <el-table-column
                      prop="appId"
                      width='80px'
                      label="应用ID"
                      >
                    </el-table-column>
                    <el-table-column
                      prop="gameZoneId"
                      label="区服ID"
                      width='50px'
                      >
                    </el-table-column>
                    <el-table-column
                      prop="openTime"
                      label="开服时间"
                      width="200px">
                    </el-table-column>
                    <el-table-column
                      prop="zoneName"
                      label="区服名称">
                    </el-table-column>
                    <el-table-column
                      prop="localName"
                      width='60px'
                      label="本地化区服名称">
                    </el-table-column>
                    <el-table-column
                      prop="zoneDesc"
                      label="区服描述">
                    </el-table-column>
                    <el-table-column
                      prop="thirdGameZoneId"
                      width='60px'
                      label="游戏的区服ID">
                    </el-table-column>
                    <el-table-column
                      prop="createTime"
                      label="创建时间">
                    </el-table-column>
                    <el-table-column
                      prop="modifyTime"
                      label="修改时间">
                    </el-table-column>
                    <el-table-column
                      prop="domain"
                      width='60px'
                      label="区服域名">
                    </el-table-column>
                    <el-table-column
                      prop="mainGameZoneId"
                      width='60px'
                      label="主区服ID">
                    </el-table-column>
                    <el-table-column
                      prop="status"
                      width='100px'
                      label="状态">
                    </el-table-column>
                    <el-table-column
                      width='120px'
                      label="操作">
                      <template slot-scope="scope">
                        <span class="el-icon-edit-outline"></span>
                        <el-button
                          @click="handleEditer(scope.$index, scope.row)"
                          type="text"
                          size="small">
                          编辑
                        </el-button>
                        <span class="el-icon-edit-outline"></span>
                        <el-button
                          @click="mergeZone(scope.$index, scope.row)"
                          type="text"
                          size="small">
                          合区
                        </el-button>
                      </template>
                    </el-table-column>
                  </el-table>
                  <el-row type="flex" class="row-bg _pagination" justify="space-around">
                    <el-pagination
                      @size-change="handleSizeChange"
                      @current-change="handleCurrentChange"
                      :current-page="currentPage"
                      :page-sizes="[15]"
                      :page-size="15"
                      layout="total, sizes, prev, pager, next"
                      background
                      :total="zonesSize"></el-pagination>
                  </el-row>
                  <!-- 所有的表单-->
                  <el-dialog v-if='version === "v2"' title="" :visible.sync="dialogTableVisible"  :append-to-body='true' center>
                    <el-form :model="form1" :rules="rules1" :label-width="formLabelWidth" >
                      <el-form-item v-if="formItemVariable.appId" label="游戏名称：" prop="appId" >
                        <!-- <el-input v-model="form1.appId" autocomplete="off" :placeholder="translation.placeholder.id"></el-input> -->
                        <el-select v-model="form1.appId" :placeholder="translation.placeholder.appId" :disabled='form1EditDISable.appId'>
                          <el-option v-for="item in games" :key="item.id" :label="item.appName" :value="item.appId" :disabled='form1EditDISable.appId'></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.gameZoneId" label="区服ID：" prop="gameZoneId">
                        <el-input v-model="form1.gameZoneId" autocomplete="off" :placeholder="translation.placeholder.gameZoneId" :disabled='form1EditDISable.gameZoneId'></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.zoneName" label="区服名称：" prop="zoneName" >
                        <el-input v-model="form1.zoneName" autocomplete="off" :placeholder="translation.placeholder.zoneName" :disabled='form1EditDISable.zoneName'></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.localName" label="本地化区服名称：" prop="localName">
                        <el-input v-model="form1.localName" autocomplete="off" :placeholder="translation.placeholder.localName"></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.zoneDesc" label="区服描述：" prop="zoneDesc">
                        <el-input v-model="form1.zoneDesc" autocomplete="off" :placeholder="translation.placeholder.zoneDesc"></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.thirdGameZoneId" label="游戏区服ID：" prop="thirdGameZoneId">
                        <el-input v-model="form1.thirdGameZoneId" autocomplete="off" :placeholder="translation.placeholder.thirdGameZoneId"></el-input>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.domain" label="区服域名：">
                        <el-input v-model="form1.domain" autocomplete="off" :placeholder="translation.placeholder.domain"></el-input>
                      </el-form-item>

                      <ApolloQuery :query="require('@/graphql/ZoneManagement.gql').mainZoneList" :variables="{version:'2',data:{appId}}"  @result="DoneOfMainZoneList">
                        <template slot-scope="{ result: { data } }">   
                          <el-form-item v-if="formItemVariable.mainGameZoneId" label="区服名称：" :label-width="formLabelWidth" prop="mainGameZoneId">
                            <el-select v-model="form1.mainGameZoneId" :placeholder="translation.placeholder.mainGameZoneId">
                              <el-option v-for="(item,index) in mainZoneList" :key="item.id" :label="item.mainGameZoneName" :value="index"></el-option>
                            </el-select>
                          </el-form-item>
                        </template>
                      </ApolloQuery>
                      <el-form-item v-if="formItemVariable.status" label="区服状态："  prop="status">
                        <el-radio-group v-model="form1.status">
                          <el-radio :label="1">正常(1)</el-radio>
                          <el-radio :label="2">测试待开服(2)</el-radio>
                          <el-radio :label="3">待处理(3)</el-radio>
                          <el-radio :label="0">已合区(0)</el-radio>
                          <el-radio :label="-1">停止运营(-1)</el-radio>
                        </el-radio-group>
                      </el-form-item>
                      <el-form-item v-if="formItemVariable.openTime" label="开服时间：" class="zone-time" prop="openTime"> 
                        <el-date-picker
                          v-model="form1.openTime"
                          type="datetime"
                          placeholder="选择日期时间"
                          format="yyyy-MM-dd HH:mm:ss"
                          value-format="yyyy-MM-dd HH:mm:ss"
                          >
                        </el-date-picker>
                      </el-form-item>  
                    </el-form>

                    <ApolloMutation v-if='dialogTableVisible1' :mutation="require('@/graphql/ZoneManagement.gql').addZoneInfo" @done="DoneOfAddZone">
                     <template slot-scope="{ mutate }">
                        <div  slot="footer" class="dialog-footer">
                          <el-row type="flex" justify='center'>
                            <el-button @click="dialogVisible (false,'add')">取 消</el-button>
                            <el-button type="primary" @click="addZone1(mutate)">保 存</el-button>
                          </el-row>
                        </div>
                      </template>
                    </ApolloMutation>

                    <ApolloMutation v-else-if="dialogTableVisible2" :mutation="require('@/graphql/ZoneManagement.gql').editZoneInfo" @done="DoneOfEditZone">
                      <template slot-scope="{ mutate }">
                        <div  slot="footer" class="dialog-footer">
                          <el-row type="flex" justify='center'>
                            <el-button @click="dialogVisible (false,'edit')">取 消</el-button>
                            <el-button type="primary" @click="editZone1(mutate)">保 存</el-button>
                          </el-row>
                        </div>
                      </template>
                    </ApolloMutation> 

                    <ApolloMutation v-else-if="dialogTableVisible3" :mutation="require('@/graphql/ZoneManagement.gql').mergeZone" @done="DoneOfMergeZone">
                      <template slot-scope="{ mutate }">
                        <div  slot="footer" class="dialog-footer">
                          <el-row type="flex" justify='center'>
                            <el-button @click="dialogVisible (false,'merge')">取 消</el-button>
                            <el-button type="primary" @click="mergeZone1(mutate)">保 存</el-button>
                          </el-row>
                        </div>
                      </template>
                    </ApolloMutation>
                  </el-dialog>
                </el-main>
             </template>
            </ApolloQuery>
          </el-container>
        </el-tab-pane>
      </el-tabs>
    </el-card>

  </el-row>
</template>
<style lang="scss">
body {
  background: #888;
}
.zone-management {
  height: 100%;
  min-width: 1200px;
  .main {
    width: 100%;
    height: 100%;
    .el-card__body {
      height: 100%;
      .el-tabs {
        height: 100%;
      }
      .el-tabs__header {
        // height: 5%;
        .el-tabs__nav-wrap {
          top: 1px;
        }
        .el-tabs__item.is-active {
          background-color: rgb(238, 241, 246);
        }
      }
      .el-tabs__content {
        height: 100%;
        .el-tab-pane.pane {
          height: 100%;
          overflow-x: scroll !important;
        }
      }
    }
  }
  .querying input::placeholder {
    color: red !important;
  }
  .el-input.is-disabled .el-input__inner {
    color: #606266 !important;
  }
  .el-select,
  .el-input {
    width: 100%;
    max-width: 305px;
  }
  ._pagination {
    margin-top: 16px;
  }
}
.zone-time {
  margin-bottom: 10px;
}
.el-radio__label {
  line-height: 2;
}
.el-menu::after {
  height: 15px;
}
</style>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Notification, version } from "element-ui";
// import gql from 'graphql-tag'

/** 常量 */
const EMPTY_STRING: string = "";
const VER_1: string = "v1";
const VER_2: string = "v2";

@Component<ZoneManagement>({
  computed: {
    currentPage: {
      set(val) {
        if (this.version === VER_1) {
          this.currentPageV1 = val;
          return;
        }
        this.currentPageV2 = val;
      },
      get() {
        if (this.version === VER_1) {
          return this.currentPageV1;
        }
        return this.currentPageV2;
      }
    },
    defaultGame: {
      set(val) {
        if (this.version === VER_1) {
          this.defaultGameV1 = val;
          return;
        }
        this.defaultGameV2 = val;
      },
      get() {
        if (this.version === VER_1) {
          return this.defaultGameV1;
        }
        return this.defaultGameV2;
      }
    },
    appId: {
      set(val) {
        if (this.version === VER_1) {
          this.appIdV1 = val;
          return;
        }
        this.appIdV2 = val;
      },
      get() {
        if (this.version === VER_1) {
          return this.appIdV1;
        }
        return this.appIdV2;
      }
    },
    versionNum (){
      return this.version.split('')[1] + '';
    }
  },
  mounted() {
    const ZoneManagement = this;
    window.VueComponents = { ...window.VueComponents, ...{ ZoneManagement } };
  }
})
export default class ZoneManagement extends Vue {
  constructor() {
    super();
  }

  /** 翻译 */
  private translation = {
    tabs: {
      [VER_1]: "区服管理v1.0",
      [VER_2]: "区服管理v2.0"
    },
    text: {},
    placeholder: {
      confId: "请输入游戏配置ID",
      gameZoneId: "请输入区服ID",
      zoneName: "请输入区服名称",
      status: "请输入区服状态",
      openTime: "请输入开服时间",
      mainGameZoneId: "请输入主区服ID",
      mainGameZoneName: "请选择主区服名称",
      appId: "请输入游戏ID",
      localName: "请输入本地化区服名称",
      zoneDesc: "请输入区服描述",
      thirdGameZoneId: "请输入游戏区服ID",
      domain: "请输入区服域名",
      zoneId: "请输入游戏区ID"
    }
  };
  private timer = 0;
  private countDown = 0;
  /** el-tabs: v-model */
  private version = VER_1;
  private isCollapse = false;
  // loading
  private loading = false;
  private refresh = 0;
  // 区服管理一的数据
  private defaultGameV1 = "1-1";
  private appIdV1 = '';
  private confId;
  private zones1 = [{status:0}];
  // 区服管理二的数据
  private defaultGameV2 = "1-1";
  private appIdV2 = '';
  private mainZoneList = [];
  // 所有游戏的数组
  private games = [];
  private zones = [{status:0}];
  private zonesSize = 0;
  // 分页
  private currentPageV1 = 1;
  private currentPageV2 = 1;

  // 弹层表单
  private dialogTableVisible = false;
  private dialogTableVisible1 = false;
  private dialogTableVisible2 = false;
  private dialogTableVisible3 = false;

  private formLabelWidth = "150px";
  // 收集添加新区服信息的表单
  private form1 = {
    appId: "",
    gameZoneId: "",
    zoneName: "",
    localName: "",
    zoneDesc: "",
    status: 2,
    thirdGameZoneId: "",
    openTime: "",
    domain: "",
    mainGameZoneId: "",
    confId: "",
    zoneId: ""
  };

  private form1EditDISable = {
    appId: false,
    gameZoneId: false,
    zoneName: false,
    localName: false,
    zoneDesc: false,
    status: false,
    thirdGameZoneId: false,
    openTime: false,
    domain: false,
    mainGameZoneId: false,
    confId: false,
    zoneId: false
  };
  // 表单验证规则
  private rules1 = {
    confId: [
      { required: true, message: "游戏配置ID不能为空", trigger: "blur" }
    ],
    gameZoneId: [
      { required: true, message: "区服ID不能为空", trigger: "blur" }
    ],
    zoneName: [
      { required: true, message: "区服名称不能为空", trigger: "blur" }
    ],
    status: [
      { required: true, message: "区服状态不能为空", trigger: "change" }
    ],
    openTime: [
      { required: true, message: "开服时间不能为空", trigger: "blur" }
    ],
    mainGameZoneId: [
      { required: true, message: "主区服ID不能为空", trigger: "blur" }
    ],
    appId: [{ required: true, message: "游戏ID不能为空", trigger: "blur" }],
    localName: [
      { required: true, message: "本地化区服名称不能为空", trigger: "blur" }
    ],
    zoneDesc: [
      { required: true, message: "区服描述不能为空", trigger: "blur" }
    ],
    thirdGameZoneId: [
      { required: true, message: "游戏区服ID不能为空", trigger: "blur" }
    ],
    zoneId: [{ required: true, message: "游戏区ID不能为空", trigger: "blur" }]
  };

  // 显示的表单项
  private formItemVariable = {
    appId: false,
    gameZoneId: false,
    zoneName: false,
    localName: false,
    zoneDesc: false,
    status: false,
    thirdGameZoneId: false,
    openTime: false,
    domain: false,
    mainGameZoneId: false,
    confId: false,
    zoneId: false
  };

  ChangeVersion(tab, event) {
    // console.log(tab, event);
  }

  handleOpen(key, keyPath) {
    // console.log(key, keyPath);
  }
  handleClose(key, keyPath) {
    // console.log(key, keyPath);
  }

  async selectGame(event, item) {
    let index = event.index.split("-")[1];
    if (this.version === VER_1) {
      this.appIdV1 = item.appId;
      this.defaultGameV1 = "1-" + index;
      this.form1.confId = item.confId;
    } else {
      this.appIdV2 = item.appId;
      this.defaultGameV2 = "1-" + index;
    }
    this.handleCurrentChange(1);
  }
  // 更改每页显示数据的多少，暂时废弃
  handleSizeChange(val) {}

  handleCurrentChange(val) {
    if (this.version === VER_1) {
      this.currentPageV1 = val;
      return;
    }
    this.currentPageV2 = val;

    // this.currentPage = val
  }

  // 弹出面板的函数
  dialogVisible(val, str) {
    this.form1.appId = "";
    this.form1.gameZoneId = "";
    this.form1.zoneName = "";
    this.form1.localName = "";
    this.form1.zoneDesc = "";
    this.form1.status = 2;
    this.form1.thirdGameZoneId = "";
    this.form1.openTime = "";
    this.form1.domain = "";
    this.form1.mainGameZoneId = "";
    this.form1.zoneId = "";

    this.dialogTableVisible1 = false;
    this.dialogTableVisible2 = false;
    this.dialogTableVisible3 = false;

    if (str === "add") {
      this.dialogTableVisible1 = val;
    } else if (str === "edit") {
      this.dialogTableVisible2 = val;
    } else if (str === "merge") {
      this.dialogTableVisible3 = val;
    }
    this.getFormItem();
    this.dialogTableVisible = val;
    
    if(this.version === VER_1) {
      this.form1.appId = this.appIdV1;
    }else{
      this.form1.appId = this.appIdV2;
    }
    this.form1EditDISable.appId = true;
  }
  // 判断显示表单项的函数
  getFormItem() {
    // 清空所有的项
    this.formItemVariable.appId = false;
    this.formItemVariable.gameZoneId = false;
    this.formItemVariable.zoneName = false;
    this.formItemVariable.localName = false;
    this.formItemVariable.zoneDesc = false;
    this.formItemVariable.status = false;
    this.formItemVariable.thirdGameZoneId = false;
    this.formItemVariable.openTime = false;
    this.formItemVariable.domain = false;
    this.formItemVariable.mainGameZoneId = false;
    this.formItemVariable.confId = false;
    this.formItemVariable.zoneId = false;
    if (this.version === VER_1) {
      if (this.dialogTableVisible1) {
        this.formItemVariable.gameZoneId = true;
        this.formItemVariable.zoneName = true;
        this.formItemVariable.status = true;
        this.formItemVariable.openTime = true;
        this.formItemVariable.mainGameZoneId = true;
      } else if (this.dialogTableVisible2) {
        this.formItemVariable.zoneId = true;
        this.formItemVariable.mainGameZoneId = true;
        this.formItemVariable.zoneName = true;
        this.formItemVariable.gameZoneId = true;
        this.formItemVariable.status = true;
        this.formItemVariable.openTime = true;
      } else if (this.dialogTableVisible3) {
        this.formItemVariable.zoneId = true;
        this.formItemVariable.zoneName = true;
        this.formItemVariable.mainGameZoneId = true;
      }
    } else {
      if (this.dialogTableVisible1) {
        this.formItemVariable.appId = true;
        this.formItemVariable.gameZoneId = false;
        this.formItemVariable.zoneName = false;
        this.formItemVariable.localName = true;
        this.formItemVariable.zoneDesc = true;
        this.formItemVariable.status = true;
        this.formItemVariable.thirdGameZoneId = true;
        this.formItemVariable.openTime = true;
        this.formItemVariable.domain = true;
        this.formItemVariable.mainGameZoneId = true;
      } else if (this.dialogTableVisible2) {
        this.formItemVariable.appId = true;
        this.formItemVariable.gameZoneId = true;
        this.formItemVariable.zoneName = true;
        this.formItemVariable.localName = true;
        this.formItemVariable.zoneDesc = true;
        this.formItemVariable.status = true;
        this.formItemVariable.thirdGameZoneId = true;
        this.formItemVariable.openTime = true;
        this.formItemVariable.domain = true;
      } else if (this.dialogTableVisible3) {
        this.formItemVariable.appId = true;
        this.formItemVariable.gameZoneId = true;
        this.formItemVariable.zoneName = true;
        this.formItemVariable.mainGameZoneId = true;
      }
    }
  }
  handleEditer(index, data) {
    this.dialogVisible(true, "edit");
    if (this.version === VER_1) {
      this.form1.zoneId = data.zoneId;
      this.form1.mainGameZoneId = data.mainGameZoneId;
      this.form1.zoneName = data.zoneName;
      this.form1.gameZoneId = data.gameZoneId;
      this.form1.status = this.getStatus(data.status, false) as number;
      this.form1.openTime = data.openTime;
    } else {
      this.form1.appId = data.appId;
      this.form1.gameZoneId = data.gameZoneId;
      this.form1.zoneName = data.zoneName;
      this.form1.localName = data.localName;
      this.form1.zoneDesc = data.zoneDesc;
      this.form1.status = this.getStatus(data.status, false) as number;
      this.form1.thirdGameZoneId = data.thirdGameZoneId;
      this.form1.openTime = data.openTime;
      this.form1.domain = data.domain;
      this.form1EditDISable.zoneName = true;
      this.form1EditDISable.gameZoneId = true;
    }
   
  }
  mergeZone(index, data) {
    this.dialogVisible(true, "merge");
    if (this.version === VER_1) {
      this.form1.zoneId = data.zoneId;
      // this.form1.mainGameZoneId = data.mainGameZoneId;
      this.form1.zoneName = data.zoneName;

      this.form1EditDISable.zoneId = true;
      this.form1EditDISable.zoneName = true;
    } else {
      this.form1.appId = data.appId;
      this.form1.gameZoneId = data.gameZoneId;
      this.form1.zoneName = data.zoneName;
      this.form1.mainGameZoneId = data.mainGameZoneId;

      this.form1EditDISable.zoneId = true;
      this.form1EditDISable.zoneName = true;
      this.form1EditDISable.gameZoneId = true;
    }
  }
  addZone1(mutate) {
    if( this.form1.appId ||
        this.form1.gameZoneId ||
        this.form1.zoneName ||
        this.form1.localName ||
        this.form1.zoneDesc ||
        this.form1.status ||
        this.form1.thirdGameZoneId ||
        this.form1.openTime ||
        this.form1.domain ||
        this.form1.mainGameZoneId
      ){
        mutate({
                variables: {
                  version: "2",
                  data: {
                  appId:this.form1.appId,
                  gameZoneId:this.mainZoneList[this.form1.mainGameZoneId].mainGameZoneId,
                  zoneName:this.mainZoneList[this.form1.mainGameZoneId].mainGameZoneName,
                  localName:this.form1.localName,
                  zoneDesc:this.form1.zoneDesc,
                  status:this.form1.status,
                  thirdGameZoneId:this.form1.thirdGameZoneId,
                  openTime:this.form1.openTime,
                  domain:this.form1.domain,
                  mainGameZoneId:this.mainZoneList[this.form1.mainGameZoneId].mainGameZoneId
                  }
                }
              });
    }else{
      Notification.warning('请将表单信息填写完整');
    }
  }
  editZone1(mutate) {
     if(this.form1.appId ||
        this.form1.gameZoneId ||
        this.form1.localName ||
        this.form1.zoneDesc ||
        this.form1.status ||
        this.form1.thirdGameZoneId ||
        this.form1.openTime ||
        this.form1.domain
      ){
        mutate({
                variables: {
                  version: "2",
                  data: {
                  appId:this.form1.appId,
                  gameZoneId:this.form1.gameZoneId,
                  localName:this.form1.localName,
                  zoneDesc:this.form1.zoneDesc,
                  status:this.form1.status,
                  thirdGameZoneId:this.form1.thirdGameZoneId,
                  openTime:this.form1.openTime,
                  domain:this.form1.domain
                  }
                }
              });
    }else{
      Notification.warning('请将表单信息填写完整');
    }
  }
  mergeZone1(mutate) {
    if( this.form1.appId ||
        this.form1.gameZoneId ||
        this.form1.mainGameZoneId
      ){
        mutate({
                variables: {
                  version: "2",
                  data: {
                  appId:this.form1.appId,
                  gameZoneId:this.form1.gameZoneId,
                  mainGameZoneId:this.mainZoneList[this.form1.mainGameZoneId].mainGameZoneId
                  }
                }
              });
    }else{
      Notification.warning('请将表单信息填写完整');
    }
  }

  addZone2(mutate) {
    if(
        this.form1.gameZoneId ||
        this.form1.zoneName ||
        this.form1.status ||
        this.form1.openTime ||
        this.form1.mainGameZoneId
      ){
        mutate({
                variables: {
                  version: "1",
                  data: {
                  confId:this.form1.confId,
                  gameZoneId:this.form1.gameZoneId,
                  zoneName:this.form1.zoneName,
                  status:this.form1.status,
                  openTime:this.form1.openTime,
                  mainGameZoneId:this.form1.mainGameZoneId
                  }
                }
              });
    }else{
      Notification.warning('请将表单信息填写完整');
    }
  }
  editZone2(mutate) {
     if(this.form1.zoneId ||
        this.form1.mainGameZoneId ||
        this.form1.zoneName ||
        this.form1.gameZoneId ||
        this.form1.status ||
        this.form1.openTime
      ){
        mutate({
                variables: {
                  version: "1",
                  data: {
                  zoneId:this.form1.zoneId,
                  mainGameZoneId:this.form1.mainGameZoneId,
                  zoneName:this.form1.zoneName,
                  gameZoneId:this.form1.gameZoneId,
                  status:this.form1.status,
                  openTime:this.form1.openTime
                  }
                }
              });
    }else{
      Notification.warning('请将表单信息填写完整');
    }
  }
  mergeZone2(mutate) {
    if( this.form1.zoneId ||
        this.form1.mainGameZoneId
      ){
        mutate({
                variables: {
                  version: "1",
                  data: {
                  zoneId:this.form1.zoneId,
                  mainGameZoneId:this.mainZoneList[this.form1.mainGameZoneId].mainGameZoneId
                  }
                }
              });
    }else{
      Notification.warning('请将表单信息填写完整');
    }
  }

  // 处理数据
  // 所有的游戏的数据
  DoneOfGames({
    data: {
      get: { code, data }
    }
  }) {
    let index =
      this.version === VER_1
        ? this.defaultGameV1.split("-")[1]
        : this.defaultGameV2.split("-")[1];
    if (code === 200) {
      this.games = data.appInfos;
      if (this.version === VER_1) {
        this.appIdV1 = data.appInfos[+index - 1].appId;
        this.confId = data.appInfos[+index - 1].confId;
      } else {
        this.appIdV2 = data.appInfos[+index - 1].appId;
      }
    }

    // console.log(data)
  }
  // 所有的区服的数据
  DoneOfZones({
    data: {
      post: { code, data }
    }
  }) {
    if (code === 200) {
      let zones = JSON.parse(JSON.stringify(data.gameZones))
 
      zones.forEach((item, index) => {
        if(this.version === VER_2){
        zones[index].createTime = this.changeTime(item.createTime);
        zones[index].modifyTime = this.changeTime(item.modifyTime);
        }
        zones[index].openTime = this.changeTime(item.openTime);
        zones[index].status = this.getStatus(item.status);
         
      });
      if(this.version === VER_1){
         this.zones1 = zones;
      }else{
        this.zones = zones;
      }
        
      this.zonesSize = data.total;
    }
  }

  //添加新的区服的数据
  DoneOfAddZone({
    data: {
      post: { code, data, message }
    }
  }) {
      if(code === 200){
        this.currentPageV1 = 1
        this.dialogVisible (false,'add')
        Notification.success(message);
        this.refresh++;
        return ;
      }
      Notification.warning(message)
  }
  // 编辑区服的数据
  DoneOfEditZone({
    data: {
      post: { code, data, message }
    }
  }) {
    if(code === 200){
      this.dialogVisible (false,'edit')
      Notification.success(message);
      this.refresh++;
       return ;
    }
    Notification.warning(message)
  }
  // 合并区服的数据处理
  DoneOfMergeZone({
    data: {
      post: { code, data, message }
    }
  }) {
      if(code === 200){
        this.dialogVisible (false,'merge')
         Notification.success(message);
         this.refresh++;
        return ;
      }
      Notification.warning(message)
  }
  // 获取所有主区数据的数据处理
  DoneOfMainZoneList({
    data: {
      post: { code, data }
    }
  }) {
    if (code === 200) {
      let zones = data.zones;
      this.mainZoneList = zones;
    }
  }

  changeTime(str, fmt = "yyyy-MM-dd hh:mm:ss") {
    // author: meizz
    var time = new Date(str);
    var o = {
      "M+": time.getMonth() + 1, //月份
      "d+": time.getDate(), //日
      "h+": time.getHours(), //小时
      "m+": time.getMinutes(), //分
      "s+": time.getSeconds(), //秒
      "q+": Math.floor((time.getMonth() + 3) / 3), //季度
      S: time.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (time.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  }
  getStatus(status, flag = true) {
    if (flag) {
      switch (status) {
        case -1:
          return "停止运营";
        case 0:
          return "已合区";
        case 1:
          return "正常";
        case 2:
          return "测试待开服";
        case 3:
          return "待处理";
        case '-1':
          return "停止运营";
        case '0':
          return "已合区";
        case '1':
          return "正常";
        case '2':
          return "测试待开服";
        case '3':
          return "待处理";
      }
    } else {
      switch (status) {
        case "停止运营":
          return -1;
        case "已合区":
          return 0;
        case "正常":
          return 1;
        case "测试待开服":
          return 2;
        case "待处理":
          return 3;
      }
    }
  }
}
</script>
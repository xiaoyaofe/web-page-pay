<template>
  <el-tabs v-model='id' type="border-card" @tab-click='handleTabs' class="data-query">
    <el-tab-pane class="query-pane" label="数据查询" name='0'>
      <el-row class="data-query-content" :gutter="0">
        <el-col :span='4' class="query-col left">
          <el-tree
            :data="data2"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[1,2,3,4,5,6]"
            :default-checked-keys="[]"
            :props="defaultProps"
            @check='selectSevers'>
          </el-tree>
        </el-col>
        <el-col :span='20' class="query-col right">
          <el-row :gutter="0" class="query-options1">
            <el-radio-group v-model="radio6" size="mini" @change='selectRadio'>
              <el-radio-button label="上海"></el-radio-button>
              <el-radio-button label="北京"></el-radio-button>
              <el-radio-button label="广州"></el-radio-button>
              <el-radio-button label="深圳"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row :gutter="0" type='flex' justify="end" class="query-options2">
            <el-radio-group v-model="radio7" size="mini" @change='selectRadio'>
              <el-radio-button label="上海"></el-radio-button>
              <el-radio-button label="北京"></el-radio-button>
              <el-radio-button label="广州"></el-radio-button>
              <el-radio-button label="深圳"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-table
            v-loading="loading"
            element-loading-text="拼命加载中..."
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :data="[{name:'查询越南超级英雄玩家IOS/安卓注册信息 啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦啦',desc: '查询越南超级英雄玩家IOS/安卓注册信息(每个区服的注册信息)',addPerpeo: 'jeff',time:'2015-01-12 14:59:00',num:232}]"
            height='88%'
            :row-style="{height:'20px'}"
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center', color:'#000'}"
            style="width: 100%">
            <el-table-column
              prop="name"
              width='300px'
              label="模板名"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="desc"
              label="模板描述"
              show-overflow-tooltip
              >
            </el-table-column>
            <el-table-column
              prop="addPerpeo"
              label="添加人"
              show-overflow-tooltip
              width="80px">
            </el-table-column>
            <el-table-column
              prop="time"
              width="160px"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="num"
              width='80px'
              show-overflow-tooltip
              label="执行次数">
            </el-table-column>
            <el-table-column
              width='100px'
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handleEditer(scope.$index, scope.row)"
                  type="primary"
                  round
                  size="mini">
                  执行查询
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
        </el-col>
      </el-row>    
    </el-tab-pane>
    <el-tab-pane class="query-pane" label="历史记录" name='1'>
      <el-tabs v-model='id1' type="border-card" @tab-click='handleTabs' class="data-query">
        <el-tab-pane class="query-pane" label="历史记录" name='3'>
          <el-row :gutter="0" class="data-query-content1" >
            <el-col :span='4' class="query-col left1">
              <el-tree
                :data="data2"
                node-key="id"
                :default-expanded-keys="[1,2,3,4,5,6]"
                :default-checked-keys="[]"
                :props="defaultProps"
                @node-click="handleNodeClick">
              </el-tree>
            </el-col>
            <el-col :span='20' class="query-col right1">
              <el-table
                v-loading="loading"
                element-loading-text="拼命加载中..."
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                :data="[{id: 1188, person: 'chuyu chen', status: '失败', time: '2018-11-14 10:19:00'}]"
                height='88%'
                :row-style="{height:'20px'}"
                :cell-style="{textAlign:'center'}"
                :header-cell-style="{textAlign:'center', color:'#000'}"
                border
                style="width: 100%">
                <el-table-column
                  prop="id"
                  label="ID"
                  >
                </el-table-column>
                <el-table-column
                  prop="person"
                  label="执行人"
                  show-overflow-tooltip
                  >
                </el-table-column>
               <el-table-column
                  label="执行SQL">
                  <template slot-scope="scope">
                    <el-button
                      @click="qeurySQL(scope.$index, scope.row)"
                      type="primary"
                      round
                      size="mini">
                      查询SQL
                    </el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="执行状态">
                </el-table-column>
                <el-table-column
                  prop="time"
                  label="执行时间">
                </el-table-column>
                
                <el-table-column
                  width='100px'
                  label="相关操作">
                  <template slot-scope="scope">
                    <el-button
                      @click="downLoad(scope.$index, scope.row)"
                      type="primary"
                      round
                      size="mini">
                      下载
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-col>
          </el-row>
        </el-tab-pane>
        <el-tab-pane class="query-pane" label="操作日志" name='4'>
           <el-table
            ref="multipleTable"
            :data="[{id: 18413, type: '执行查询', person: 'cg', desc: '代理商新加坡SDK2服务器1区(7)，模板描述：a.app_id AS \'APP_ID\'', modelId: 89, name: '查看玩家充值明细(充值成功的)', time: '2018-11-14 11:45:28.0'},
                    {id: 18413, type: '执行查询', person: 'cg', desc: '代理商新加坡SDK2服务器1区(7)，模板描述：a.app_id AS \'APP_ID\'', modelId: 89, name: '查看玩家充值明细(充值成功的)', time: '2018-11-14 11:45:28.0'}]"
            tooltip-effect="dark"
            style="width: 100%"
            :row-style="{height:'20px'}"
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center', color:'#000'}"
            @selection-change="logSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="120">
            </el-table-column>
            <el-table-column
              prop="type"
              label="操作类型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="person"
              label="操作人">
            </el-table-column>
            <el-table-column
              prop="desc"
              label="概述">
            </el-table-column>
            <el-table-column
              prop="modelId"
              label="模板Id">
            </el-table-column>
            <el-table-column
              prop="name"
              label="模板名称">
            </el-table-column>
            <el-table-column
              prop="time"
              label="操作时间">
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
    <el-tab-pane class="query-pane" label="模板管理" name='2'>
      <el-tabs v-model='id2' type="border-card" @tab-click='handleTabs' class="data-query">
        <el-tab-pane class="query-pane" label="模板管理" name='5'>
          <el-row :gutter="0" class="query-options1">
            <el-radio-group v-model="radio6" size="mini" @change='selectRadio'>
              <el-radio-button label="上海"></el-radio-button>
              <el-radio-button label="北京"></el-radio-button>
              <el-radio-button label="广州"></el-radio-button>
              <el-radio-button label="深圳"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-row :gutter="0" type='flex' justify="end" class="query-options2">
            <el-radio-group v-model="radio7" size="mini" @change='selectRadio'>
              <el-radio-button label="上海"></el-radio-button>
              <el-radio-button label="北京"></el-radio-button>
              <el-radio-button label="广州"></el-radio-button>
              <el-radio-button label="深圳"></el-radio-button>
            </el-radio-group>
          </el-row>
          <el-table
            ref="multipleTable"
            :data="[{id:27, name: '查询玩家信息', desc: '查询玩家信息（根据用户名和用户id，sdk1.0所有游戏通用）', db: 'COPY',queryWay:'MySQL命令行', person: 'jeff', time: '2014-11-27 12:18:00', num: 2383}]"
            tooltip-effect="dark"
            style="width: 100%"
            :row-style="{height:'20px'}"
            :cell-style="{textAlign:'center'}"
            :header-cell-style="{textAlign:'center', color:'#000'}"
            @selection-change="modelSelectionChange">
            <el-table-column
              type="selection"
              width="55">
            </el-table-column>
            <el-table-column
              prop="id"
              label="ID"
              width="120">
            </el-table-column>
            <el-table-column
              prop="name"
              label="模板名"
              width="120">
            </el-table-column>
            <el-table-column
              prop="desc"
              label="模板描述">
            </el-table-column>
            <el-table-column
              prop="db"
              label="数据库">
            </el-table-column>
            <el-table-column
              prop="queryWay"
              label="查询方式">
            </el-table-column>
            <el-table-column
              prop="person"
              label="添加人">
            </el-table-column>
            <el-table-column
              prop="time"
              label="创建时间">
            </el-table-column>
            <el-table-column
              prop="num"
              label="执行次数">
            </el-table-column>
            <el-table-column
              width='160'
              label="操作">
              <template slot-scope="scope">
                <el-button
                  @click="handle(scope.$index, scope.row)"
                  type="text"
                  size="mini">
                  执行
                </el-button>
                <el-button
                  @click="handle(scope.$index, scope.row)"
                  type="text"
                  size="mini">
                  编辑
                </el-button>
                <el-button
                  @click="handle(scope.$index, scope.row)"
                  type="text"
                  size="mini">
                  修改
                </el-button>
                 <!-- <span class="text-icon el-icon-edit-outline"></span> -->
                <el-button
                  @click="handle(scope.$index, scope.row)"
                  type="text"
                  size="mini">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane class="query-pane" label="分类管理" name='6'>
          <el-row class="addRootBtn" type="flex" justify='end'>
            <el-button type="primary" @click="dialogVisible(true,'add')" size="mini">
              <i class="el-icon-plus el-icon--right"></i>
              添加
            </el-button>
          </el-row>
          <el-row>
            <el-col :span="5" class="head-col">名称</el-col>
            <el-col :span="3" class="head-col">权限名称</el-col>
            <el-col :span="10" class="head-col">描述</el-col>
            <el-col :span="3" class="head-col">创建时间</el-col>
            <el-col :span="3" class="head-col">操作</el-col>
          </el-row>
          <el-row v-if="classify.length" v-for='(item,index) in classify' :key='index'>
            <el-row>
              <el-col :span="5" class="body-col">
                <span class="text-icon" :class="item.el ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click='toggleChannel(item.el,index)'></span>
                {{item.name}}
              </el-col>
              <el-col :span="3" class="body-col">{{item.powerName}}</el-col>
              <el-col :span="10" class="body-col">{{item.desc}}</el-col>
              <el-col :span="3" class="body-col">{{item.time}}</el-col>
              <el-col :span="3" class="body-col">
                <span class="text-icon el-icon-circle-plus"></span>
                <el-button
                  type="text"
                  size="mini"
                  @click="dialogVisible()">添加</el-button>
                <span class="text-icon el-icon-edit-outline"></span>
                <el-button
                  size="mini"
                  type="text"
                  @click="dialogVisible()">编辑</el-button>
                <span class="text-icon el-icon-delete"></span>
                <el-button
                  size="mini"
                  type="text"
                  @click="dialogVisible()">删除</el-button>
              </el-col>
            </el-row>
            <el-row v-if="item.children">
              <!-- 第二层 -->
              <el-row v-if='item.el' v-for='(item1,index1) in item.children' :key='index1'>
                <el-row>
                  <el-col :span="5" class="body-col tree1">{{item.name}}</el-col>
                  <el-col :span="3" class="body-col">{{item.powerName}}</el-col>
                  <el-col :span="10" class="body-col">{{item.desc}}</el-col>
                  <el-col :span="3" class="body-col">{{item.time}}</el-col>
                  <el-col :span="3" class="body-col">
                    <span class="text-icon el-icon-edit-outline"></span>
                    <el-button
                      size="mini"
                      type="text"
                      @click="dialogVisible()">编辑</el-button>
                    <span class="text-icon el-icon-delete"></span>
                    <el-button
                      size="mini"
                      type="text"
                      @click="dialogVisible()">删除</el-button>
                  </el-col>
                </el-row>
              </el-row>
            </el-row>
            <el-row v-else-if="item.el && !item.children" class="empty">
              暂无数据
            </el-row>
            </el-row>
            <el-row v-show='!classify.length' class="empty">
                暂无数据
            </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Notification, version } from "element-ui";

/** 常量 */

@Component<DataQuery>({
  computed: {
  },
  mounted() {
    const ZoneManagement = this;
    window.VueComponents = { ...window.VueComponents, ...{ ZoneManagement } };
  }
})
export default class DataQuery extends Vue {
  constructor() {
    super();
  }
  private id = '2';
  private id1 = '3';
  private id2 = '6';
  private radio6 = '上海';
  private radio7 = '上海';
  private currentPage = 1;
  private zonesSize = 0;
  private multipleSelection = [];
  private classify = [
    {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息1', time: '2014-11-27 11:19:38',el: false,
      children: [
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息12', time: '2014-11-27 11:19:38',el: false},
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息12', time: '2014-11-27 11:19:38',el: false},
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息12', time: '2014-11-27 11:19:38',el: false}
    ]},
    {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息2', time: '2014-11-27 11:19:38',el: false,
      children: [
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息22', time: '2014-11-27 11:19:38',el: false},
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息22', time: '2014-11-27 11:19:38',el: false},
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息22', time: '2014-11-27 11:19:38',el: false}
    ]},
    {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息3', time: '2014-11-27 11:19:38',el: false,
      children: [
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息32', time: '2014-11-27 11:19:38',el: false},
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息32', time: '2014-11-27 11:19:38',el: false},
       {name: 'sdk_v1', powerName: 'USER_QUERY', desc: '查询玩家信息和玩家订单信息32', time: '2014-11-27 11:19:38',el: false}
    ]}, 
  ];
  private loading=false;
  private data2 = [{
    id: 1,
    label: '一级 1',
    children: [{
      id: 4,
      label: '二级 1-1',
      children: [{
        id: 9,
        label: '三级 1-1-1'
        }, {
        id: 10,
        label: '三级 1-1-2'
      }]
    }]
    }, {
    id: 2,
    label: '一级 2',
    children: [{
      id: 5,
      label: '二级 2-1'
      },{
      id: 6,
      label: '二级 2-2'
    }]
    }, {
    id: 3,
    label: '一级 3',
    children: [{
      id: 7,
      label: '二级 3-1'
      }, {
      id: 8,
      label: '二级 3-2'
    }]
  }]
  private data3 = ['']
  private defaultProps = {
    children: 'children',
    label: 'label'
  }
  handleTabs (tab,event) {
    // console.log(tab,event)
  }
  selectSevers (...val) {
    console.log(val)
  }
  selectRadio (...val) {
    console.log(val)
  }
  handleSizeChange(val) {

  }

  handleCurrentChange(val) {
   this.currentPage = val
  }
  handleNodeClick(data) {
    console.log(data);
  }

  downLoad(index,row) {
    console.log(index,row)
  }
  qeurySQL(index,row) {
    console.log(index,row)
  }
  logSelectionChange(val) {
    this.multipleSelection = val;
    console.log(this.multipleSelection)
  }
  modelSelectionChange(val) {
    this.multipleSelection = val;
    console.log(this.multipleSelection)
  }
  handle(index,data) {
    console.log(index,data)
  }
  dialogVisible() {

  }
  toggleChannel(val,index) {
   this.classify[index].el = !val;
  }
}
</script>

<style lang="scss">
.data-query{
  height: 100%;
  .query-pane{
    height: 100%;
    overflow-x: auto;
    overflow-y:hidden;
    .data-query-content{
      height:100%;
      min-width:1450px;
      .query-col{
        overflow-y: auto;
        overflow-x: auto;
        height:100%;
      }
    }
    .data-query-content1{
      height:100%;
      min-width:1200px;
      .query-col1{
        overflow-y: auto;
        overflow-x: auto;
        height:100%;
      }
      .left1{
        min-width: 200px;
        border-right:1px solid rgb(236, 228, 228);
      }
      .right1{
        min-width: 1000px;
      }
    }
    .addRootBtn{
      padding: 0 30px 5px 0;
      border-bottom: 1px solid #e8eaec;
    }  
    .head-col{
      text-align: center;
      font-size: 14px;
      font-weight: 700;
      color:#000;
      padding: 10px 0 10px 0;
      border-bottom: 1px solid #e8eaec;
      border-right: 1px solid #e8eaec;
      &:nth-child(5){
        border-right: none;
      }
    }
    .body-col,{
      box-sizing: border-box;
      text-align: center;
      font-size: 14px;
      font-weight: 500;
      padding: 10px 0;
      border-bottom: 1px solid #e8eaec;
      border-right: 1px solid #e8eaec;
      height:42px;
      &:nth-child(1),&:nth-child(5){
        text-align: left;
        padding-left: 10px;
      }
      &:nth-child(1).tree1,&:nth-child(5).tree1{
        padding-left:70px;
      }
      &:nth-child(5){
        border-right:none;
      }
    }
    .query-options1{
      padding-bottom:5px;
      padding-left: 10px;
    }
    .query-options2{
      padding: 0 10px 5px 0;
      background-color: #F2F6FC;
      border-radius: 5px;
    }
  }
  .el-tabs__content{
    height:95%;
    padding:5px 0 0 0;
  }
  .left{
   border-right:1px solid rgb(236, 228, 228);
   min-width: 240px;
  }
  .right{
    min-width: 1000px;
    .query-options1{
      padding-bottom:5px;
      padding-left: 10px;
    }
    .query-options2{
      padding: 0 10px 5px 0;
      background-color: #F2F6FC;
      border-radius: 5px;
    }
  }
}
</style>
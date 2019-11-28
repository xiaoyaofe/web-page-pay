<template>
  <el-row class="channel-management" :gutter="0">
    <el-col :span="4" class="channel-col">
      <ApolloQuery :query="require('@/graphql/ChannelManagement.gql').channelGames" :variables="{}"  @result="DoneOfGames">
        <template slot-scope="{ result: { data } }">
          <el-aside width="16vw" style="min-width: 250px;background-color: rgb(238, 241, 246); height:100%">
            <el-menu :default-active="defaultGame" class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="isCollapse">
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-menu"></i>
                  <span slot="title">游戏应用</span>
                </template>
                  <el-menu-item v-for="(item,index) in games" :key='item.gameId' :index="'1-' + (index + 1)" @click="selectGame($event,item)">{{item.gameName}}</el-menu-item>
              </el-submenu>
            </el-menu>
          </el-aside>
        </template>
      </ApolloQuery>
    </el-col>
    <el-col :span="20" class="channel-col">
      <ApolloQuery v-if='gameId' :query="require('@/graphql/ChannelManagement.gql').channels " 
        :variables="{version:refetch + '',data:{appId: gameId}}" 
        @result="DoneOfChannels">
        <template slot-scope="{ result: { data} }">
          <el-row class="channel-title">
            渠道管理
          </el-row>
          <el-row class="addRootBtn" type="flex" justify='end'>
            <el-button type="primary" @click="dialogVisible(true,'add')" size="small">
              <i class="el-icon-plus el-icon--right"></i>
              添加
            </el-button>
          </el-row>
          <el-row>
            <el-col :span="2" class="head-col">ID</el-col>
            <el-col :span="4" class="head-col">渠道名称</el-col>
            <el-col :span="2" class="head-col">渠道编号</el-col>
            <el-col :span="2" class="head-col">父渠道编号</el-col>
            <el-col :span="8" class="head-col">描述</el-col>
            <el-col :span="2" class="head-col">状态</el-col>
            <el-col :span="4" class="head-col">操作</el-col>
          </el-row>
          <ApolloMutation :mutation="require('@/graphql/ChannelManagement.gql').deletechannel" @done="DoneOfDeleteChannel"> 
            <template slot-scope="{ mutate }">
              <!-- 第一层 -->
              <el-row v-if="channels.length" v-for='(item,index) in channels' :key='index'>
                <el-row>
                  <el-col :span="2" class="body-col">{{item.id}}</el-col>
                  <el-col :span="4" class="body-col">
                    <span class="text-icon" :class="item.el ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click='toggleChannel(item.el,index)'></span>
                    {{item.channelName}}
                  </el-col>
                  <el-col :span="2" class="body-col">{{item.channelNo}}</el-col>
                  <el-col :span="2" class="body-col">{{item.parentChannelNo}}</el-col>
                  <el-col :span="8" class="body-col">{{item.channelDescription}}</el-col>
                  <el-col :span="2" class="body-col">{{item.channelStatus === 0 ? '可用' : '不可用'}}</el-col>
                  <el-col :span="4" class="body-col">
                    <span class="text-icon el-icon-circle-plus"></span>
                    <el-button
                      type="text"
                      size="mini"
                      @click="dialogVisible(true,'addChildren', item)">添加</el-button>
                    <span class="text-icon el-icon-edit-outline"></span>
                    <el-button
                      size="mini"
                      type="text"
                      @click="dialogVisible(true,'edit',item)">编辑</el-button>
                    <span class="text-icon el-icon-delete"></span>
                    <el-button
                      size="mini"
                      type="text"
                      @click="handleDelete(mutate,item.id)">删除</el-button>
                  </el-col>
                </el-row>
                <el-row v-if="item.children">
                  <!-- 第二层 -->
                  <el-row v-if='item.el' v-for='(item1,index1) in item.children' :key='index1'>
                    <el-row>
                      <el-col :span="2" class="body-col">{{item1.id}}</el-col>
                      <el-col :span="4" class="body-col tree1">
                        <span class="text-icon" :class="item1.el ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click='toggleChannel(item1.el,index,index1)'></span>
                        {{item1.channelName}}
                      </el-col>
                      <el-col :span="2" class="body-col">{{item1.channelNo}}</el-col>
                      <el-col :span="2" class="body-col">{{item1.parentChannelNo}}</el-col>
                      <el-col :span="8" class="body-col">{{item1.channelDescription}}</el-col>
                      <el-col :span="2" class="body-col">{{item1.channelStatus === 0 ? '可用' : '不可用'}}</el-col>
                      <el-col :span="4" class="body-col">
                        <span class="text-icon el-icon-circle-plus"></span>
                        <el-button
                          type="text"
                          size="mini"
                          @click="dialogVisible(true,'addChildren', item1)">添加</el-button>
                        <span class="text-icon el-icon-edit-outline"></span>
                        <el-button
                          size="mini"
                          type="text"
                          @click="dialogVisible(true,'edit',item1)">编辑</el-button>
                        <span class="text-icon el-icon-delete"></span>
                        <el-button
                          size="mini"
                          type="text"
                          @click="handleDelete(mutate,item1.id)">删除</el-button>
                      </el-col>
                    </el-row>
                    <el-row v-if="item1.el && !item1.children" class="empty">
                      暂无数据
                    </el-row>
                    <el-row>
                      <!-- 第三层 -->
                      <el-row v-if='item1.el' v-for='(item2,index2) in item1.children' :key='index2'>
                        <el-row>
                          <el-col :span="2" class="body-col">{{item2.id}}</el-col>
                          <el-col :span="4" class="body-col tree2">{{item2.channelName}}</el-col>
                          <el-col :span="2" class="body-col">{{item2.channelNo}}</el-col>
                          <el-col :span="2" class="body-col">{{item2.parentChannelNo}}</el-col>
                          <el-col :span="8" class="body-col">{{item2.channelDescription}}</el-col>
                          <el-col :span="2" class="body-col">{{item2.channelStatus === 0 ? '可用' : '不可用'}}</el-col>
                          <el-col :span="4" class="body-col">
                            <span class="text-icon el-icon-edit-outline"></span>
                            <el-button
                              size="mini"
                              type="text"
                              @click="dialogVisible(true,'edit',item2)">编辑</el-button>
                            <span class="text-icon el-icon-delete"></span>
                            <el-button
                              size="mini"
                              type="text"
                              @click="handleDelete(mutate,item2.id)">删除</el-button>
                          </el-col>
                        </el-row>
                          <el-row v-if="item2.el && !item2.children.length" class="empty">
                          暂无数据
                          </el-row>  
                      </el-row>
                    </el-row>

                  </el-row>
                </el-row>
                <el-row v-else-if="item.el && !item.children" class="empty">
                  暂无数据
                </el-row>
              </el-row>
              <el-row v-show='!channels.length' class="empty">
                暂无数据
              </el-row>
            </template>
          </ApolloMutation> 
        </template>
      </ApolloQuery>
      <!-- 所有的表单-->
      <el-dialog :title="form.title" :visible.sync="dialog.dialogVisible"  :append-to-body='true' center>

        <el-form :model="form.data" :rules="form.rules" :label-width="form.label.labelWidth" >
          <el-form-item :label="form.label.channelName" prop="channelName">
            <el-input v-model="form.data.channelName" autocomplete="off" :placeholder="form.placeholder.channelName" ></el-input>
          </el-form-item>

          <el-form-item :label="form.label.channelNo" prop="channelNo" >
            <el-input v-model="form.data.channelNo" autocomplete="off" :placeholder="form.placeholder.channelNo" ></el-input>
          </el-form-item>

          <el-form-item :label="form.label.channelDescription" prop="channelDescription">
            <el-input v-model="form.data.channelDescription" autocomplete="off" :placeholder="form.placeholder.channelDescription"></el-input>
          </el-form-item>

        </el-form>

        <ApolloMutation v-if='dialog.dialogVisibleAdd || dialog.dialogVisibleAddChildren' :mutation="require('@/graphql/ChannelManagement.gql').addchannelInfo" @done="DoneOfAddChannel">
          <template slot-scope="{ mutate }">
            <div  slot="footer" class="dialog-footer">
              <el-row type="flex" justify='center'>
                <el-button @click="dialogVisible (false,'add')">取 消</el-button>
                <el-button type="primary" @click="handleAdd(mutate)">保 存</el-button>
              </el-row>
            </div>
          </template>
        </ApolloMutation>

        <ApolloMutation v-else-if="dialog.dialogVisibleEdit" :mutation="require('@/graphql/ChannelManagement.gql').editchannelInfo" @done="DoneOfEditChannel">
          <template slot-scope="{ mutate }">
            <div  slot="footer" class="dialog-footer">
              <el-row type="flex" justify='center'>
                <el-button @click="dialogVisible (false,'edit')">取 消</el-button>
                <el-button type="primary" @click="handleEdit(mutate)">保 存</el-button>
              </el-row>
            </div>
          </template>
        </ApolloMutation> 
      </el-dialog>
    </el-col>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Notification, version, Message, MessageBox} from "element-ui";

/** 常量 */
// const VER_1: string = "v1";

@Component<ChannelManagement>({
  computed: {
   
  },
  mounted() {
    const ZoneManagement = this;
    window.VueComponents = { ...window.VueComponents, ...{ ZoneManagement } };
  }
})
export default class ChannelManagement extends Vue {
  constructor() {
    super();
  }
  private loading = false;
  private isCollapse = false;
  private form = {
    title: '',
    rules: {
      channelName: [
        { required: true, message: "渠道名称不能为空", trigger: "blur" }
      ],
      channelNo: [
        { required: true, message: "渠道编号不能为空", trigger: "blur" }
      ]
    },
    placeholder: {
      channelName: '请输入渠道名称',
      channelNo: '请输入渠道编号',
      channelDescription: '请输入渠道描述'
    },
    label: {
      labelWidth: '150px',
      channelName: '渠道名称',
      channelNo: '渠道编号',
      channelDescription: '渠道描述'
    },
    data: {
      id: '',
      channelName: '',
      channelNo: '',
      channelDescription: ''
    }
  }
  private dialog = {
    dialogVisible: false,
    dialogVisibleAdd: false,
    dialogVisibleEdit: false,
    dialogVisibleAddChildren: false
  }
  private refetch = 0
  private channels:any[] = [];
  private defaultGame = '1-1';
  private games = [];
  private gameId = '';
  // 暂时没有使用的方法
  handleOpen(key, keyPath) {
    // console.log(key, keyPath);
  }

  handleClose(key, keyPath) {
    // console.log(key, keyPath);
  }
  // 选择游戏
  selectGame(event, item) {
    let index = event.index.split("-")[1];
    this.gameId = item.gameId;
    this.defaultGame = "1-" + index;
    // console.log(this.gameId,this.defaultGame)
    
  }
  // 删除渠道
  handleDelete(mutate,id) {
    console.log(id);
     MessageBox.confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        mutate({
          variables: {
            data: {
              id
            }
          }
        });
      }).catch(() => {
        Message({
          type: 'info',
          message: '已取消删除'
        });          
    });
   
  }
  // 添加渠道
  handleAdd (mutate) {
    if(this.dialog.dialogVisibleAddChildren){
      mutate({
        variables: {
          version: '1',
          data: {
            id: +this.form.data.id,
            channelName: this.form.data.channelName,
            channelNo: this.form.data.channelNo,
            channelDescription: this.form.data.channelDescription
          }
        }
      });
    }else{
      mutate({
        variables: {
          version: '2',
          data: {
            gameId: +this.gameId,
            channelName: this.form.data.channelName,
            channelNo: this.form.data.channelNo,
            channelDescription: this.form.data.channelDescription
          }
        }
      });
    }
    
  }
  
  // 编辑渠道
  handleEdit(mutate) {
    mutate({
      variables: {
        data: {
          id: +this.form.data.id,
          channelName: this.form.data.channelName,
          channelNo: this.form.data.channelNo,
          channelDescription: this.form.data.channelDescription
        }
      }
    });
  }
  // 打开和关闭渠道
  toggleChannel(val,index,index1) {
   if(index1 || index1 === 0){
     this.channels[index].children[index1].el = !val;
     return;
   }
   this.channels[index].el = !val;
  }

  dialogVisible(val, str,item) {
    this.dialog.dialogVisible = false;
    this.dialog.dialogVisibleAdd = false;
    this.dialog.dialogVisibleEdit = false;
    this.dialog.dialogVisibleAddChildren = false;
    this.form.data.channelName = "";
    this.form.data.channelNo = '';
    this.form.data.channelDescription = "";
    this.form.data.id = "";

    if (str === "add") {
      this.form.title = '添加根渠道'
      this.dialog.dialogVisibleAdd = val;
    } else if (str === "edit") {
      this.form.title = '编辑渠道'
      this.form.data.channelName = item.channelName
      this.form.data.channelNo = item.channelNo +'';
      this.form.data.channelDescription = item.channelDescription;
      this.form.data.id = item.id;
      this.dialog.dialogVisibleEdit = val;
    }else if (str === "addChildren") {
      this.form.title = '添加子渠道'
      this.form.data.id = item.id;
      this.dialog.dialogVisibleAddChildren = val;
    }
    this.dialog.dialogVisible = val;
  }

  // 处理数据
  // 所有的游戏的数据
  DoneOfGames({data: {get: { code, data }}}) {
    let index = this.defaultGame.split("-")[1];
    if (code === 200) {
      this.games = data;
        this.gameId = data[+index - 1].gameId;
    }

    // console.log(data)
  }
  // 所有的渠道的数据
  DoneOfChannels({data: {post: { code, data }}}) {
    if (code === 200) {
      let channels = JSON.parse(JSON.stringify(data.channels))
      this.setChannelsEl(channels)
      this.channels = channels;
    }else if(code === 300 || code === 301){
      this.channels=[]
    }
  }
  // 添加完成的数据处理
  DoneOfAddChannel({data: {post: { code, data, message }}}) {
    if(code === 200){
      this.refetch++;
      this.dialogVisible(false,'add',{})
      Notification.success(message);
      return ;
    }
    Message({
      type: 'info',
      message
    });
  }
  //编辑完成的数据处理 
  DoneOfEditChannel ({data: {post: { code, data, message }}}) {
    if(code === 200){
      this.refetch++;
      this.dialogVisible(false,'edit',{})
      Notification.success(message);
      return ;
    }
    Message({
      type: 'info',
      message
    });
  }
  // 删除完成的数据处理
  DoneOfDeleteChannel ({data: {post: { code, data, message }}}) {
    if(code === 200){
      this.refetch++;
      Message({
        type: 'success',
        message
      });;
      return ;
    }
    Message({
      type: 'info',
      message
    });
  }
  // 工具函数
  setChannelsEl (arr) {
     arr.forEach((item, index) => {
        arr[index].el = false;
        if(!item.children){
          return ;
        }
        this.setChannelsEl(item.children)
    });
    return arr;
  }
}
</script>

<style lang="scss">
.channel-management {
  height: 100%;
  min-width: 1200px;
  .text-icon {
    margin-left: 6px;
  }
  .addRootBtn{
    padding: 10px 30px 10px 0;
    border-bottom: 1px solid #e8eaec;
  }
  .head-col{
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    color:#000;
    padding: 10px 0 10px 0;
    border-bottom: 1px solid #e8eaec;
    &:nth-child(2){
      text-align: left;
    }
  }
  .body-col,{
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 0;
    border-bottom: 1px solid #e8eaec;
    height:42px;
    &:nth-child(2),&:nth-child(7){
      text-align: left;
    }
  }
  .tree1{
    padding-left:20px;
  }
  .tree2{
    padding-left:50px;
  }
  .empty{
    box-sizing: border-box;
    text-align: center;
    font-size: 14px;
    font-weight: 500;
    padding: 10px 0;
    border-bottom: 1px solid #e8eaec;
    text-align: center;
  }
}
.bg-purple {
  background: orange;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
  height: 100%;
}
.channel-col {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.channel-title {
  line-height: 2;
  font-size: 16px;
  font-weight: bolder;
  padding-left: 20px;
  background-color:#e8eaec;
}
</style>

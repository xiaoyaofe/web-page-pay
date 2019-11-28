<template>
  <el-row
    type="flex"
    justify="space-around"
    :class="CNT.CLS_OA_USR_MANAGEMENT"
  >
    <div :class="CNT.CLS_DEPARTMENT_LIST">
      <el-row type="flex">
        <el-select
          v-if="store.departmentList"
          v-model="selectFilter"
          multiple
          filterable
          :filter-method="departmentSelectFilter"
          size="mini"
          style="width:100%;margin:0 0 10px 0;"
        >
          <el-option
            v-for="item in filterList"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </el-row>

      <el-tree
        ref="departmentTree"
        v-if="store.departmentList"
        :node-key="CNT.TREE_NODE_KEY"
        :data="store.departmentList"
        :filter-node-method="departmentListFilter"
        :current-node-key="store.currentNodeKey"
        :props="{children: CNT.TREE_NODE_CHILDREN, label: CNT.TREE_NODE_LABEL}"
        :default-expanded-keys="[store.currentNodeKey]"
        @node-click="nodeClick"
        @current-change="currentChange"
      >
        <span
          class="tree-node"
          slot-scope="{node,data}"
        >
          <img
            class="icon-folder-blue"
            :src="require('@/assets/oa/icon-folder-blue.png')"
          />
          <span>{{ node.label }}</span>
        </span>
      </el-tree>
      <div
        v-if="!store.userList"
        :class="CNT.CLS_DEPARTMENT_LIST_COEVER"
      ></div>
    </div>
    <div
      v-if="!edit_user"
      :class="CNT.CLS_USR_LIST"
    >
      <div v-if="store.userList">
        <el-row
          type="flex"
          justify="space-between"
          style="width:100%; margin: 0 0 10px 0;"
        >
          <el-button
            type="primary"
            icon="el-icon-caret-left"
            size="mini"
            :style="`padding: 4px 8px; visibility: ${annualVacationTableData.length ? 'visible' : 'hidden'}`"
            @click="annualVacationTableData=[]"
          >
            返回
          </el-button>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            style="padding: 4px 8px;"
            @click="queryAnnualVacation"
          >
            年假查询
          </el-button>
        </el-row>

        <el-table
          v-if="!annualVacationTableData.length"
          :data="store.userListFilter || store.userList"
          border
          size="small"
          :row-class-name="CNT.CLS_USR_LIST_ROW"
          :header-row-class-name="CNT.CLS_USR_LIST_HEADER"
          @cell-mouse-enter="userCellEnter"
          @cell-mouse-leave="userCellLeave"
          @cell-dblclick="userCellDbClick"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="150"
          >
          </el-table-column>
          <el-table-column
            prop="alias"
            label="别名"
            width="160"
          >
          </el-table-column>
          <el-table-column
            prop="department"
            label="部门"
            width="180"
            :formatter="tableDepartmentFormatter"
          >
          </el-table-column>
          <el-table-column
            prop="position"
            label="职位"
            :formatter="tablePositionFormatter"
          >
          </el-table-column>
          <el-table-column
            prop="more"
            width="50"
            header-align="center"
          >
            <template
              slot="header"
              slot-scope="{colunm, $index}"
            >
              <i class="el-icon-document"></i>
            </template>
            <template
              slot
              slot-scope="{row, colunm, $index}"
            >
              <el-row
                type="flex"
                justify="center"
              >
                <i class="el-icon-more"></i>
              </el-row>
            </template>
          </el-table-column>
        </el-table>

        <el-table
          v-else
          :data="annualVacationTableData"
          border
          size="small"
          :row-class-name="CNT.CLS_USR_LIST_ROW"
          :header-row-class-name="CNT.CLS_USR_LIST_HEADER"
          @cell-mouse-enter="userCellEnter"
          @cell-mouse-leave="userCellLeave"
          @cell-dblclick="userCellDbClick"
        >
          <el-table-column
            prop="name"
            label="姓名"
            width="150"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div
      v-else
      :class="CNT.CLS_USR_DETAIL"
    >
      <el-row :class="CNT.CLS_USR_DETAIL_TITLE">
        编辑成员信息
      </el-row>

      <el-row :class="CNT.CLS_USR_DETAIL_OPERATION_BAR">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-success"
        >
          保存
        </el-button>
        <el-button
          @click="edit_user = ''"
          size="mini"
          icon="el-icon-error"
        >
          取消
        </el-button>
      </el-row>

      <el-row
        type="flex"
        align="middle"
        class="user-detail-user-box"
      >
        <el-col class="user-detail-avatar">
          <img :src="edit_user.avatar || require('@/assets/oa/rg.png')">
        </el-col>
        <el-col class="user-detail-user">
          <el-row class="user-detail-user-txt">
            <span style="margin-right:10px">姓名：</span>
            {{edit_user.name}}
          </el-row>
          <el-row class="user-detail-user-txt">
            <span style="margin-right:10px">别名：</span>
            {{edit_user.userid}}
          </el-row>
        </el-col>
      </el-row>
      <el-row class="user-detail-user-set">
        <member-edit-item v-if="memberStatus">
          <template slot="left">
            成员状态：
          </template>
          <template slot="right">
            <span style="width:74px">{{memberStatus}}</span>
            <el-dropdown
              trigger="click"
              style="margin: 0 15px"
              placement="right"
              @command="changeMemberStatus"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px"
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item :command="0">试用期</el-dropdown-item>
                <el-dropdown-item :command="1">正式员工</el-dropdown-item>
                <el-dropdown-item :command="2">离职员工</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </member-edit-item>
        <member-edit-item v-if="enrollmentDate">
          <template slot="left">
            入职日期：
          </template>
          <template slot="right">
            <span style="width:74px">{{enrollmentDate}}</span>
            <div class="enrollment-date-edit-button">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px;margin: 0 15px"
                @click="willChangeEnrollmentDate"
              >
              </el-button>
              <el-date-picker
                class="enrollment-date-picker"
                v-model="enrollmentDate"
                type="date"
                ref="enrollmentDate"
                @change="changeEnrollmentDate"
              >
              </el-date-picker>
            </div>
          </template>
        </member-edit-item>
        <member-edit-item v-if="formalDate">
          <template slot="left">
            转正日期：
          </template>
          <template slot="right">
            <span style="width:74px">{{formalDate}}</span>
            <div class="formal-date-edit-button">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px;margin: 0 15px"
                @click="willChangeFormalDate"
              >
              </el-button>
              <el-date-picker
                class="formal-date-picker"
                v-model="formalDate"
                type="date"
                ref="formalDate"
                @change="changeFormalDate"
              >
              </el-date-picker>
            </div>
          </template>
        </member-edit-item>
        <member-edit-item v-if="resignDate">
          <template slot="left">
            离职日期：
          </template>
          <template slot="right">
            <span style="width:74px">{{resignDate}}</span>
            <div class="resign-date-edit-button">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px;margin: 0 15px"
                @click="willChangeResignDate"
              >
              </el-button>
              <el-date-picker
                class="resign-date-picker"
                v-model="resignDate"
                type="date"
                ref="resignDate"
                @change="changeResignDate"
              >
              </el-date-picker>
            </div>
          </template>
        </member-edit-item>
        <member-edit-item v-if="annualVacation!==''">
          <template slot="left">
            年假：
          </template>
          <template slot="right">

            <span style="width:74px">{{annualVacation}}</span>
            <el-dropdown
              trigger="click"
              size="mini"
              placement="right"
              :hide-on-click="false"
            >
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                style="padding: 4px 8px; margin-left: 15px;"
              ></el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>
                  <el-slider
                    v-model="annualVacation"
                    vertical
                    height="200px"
                    max="20"
                    class="annual-vacation-slider"
                  ></el-slider>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>

          </template>
        </member-edit-item>
      </el-row>
      <el-row :class="CNT.CLS_USR_DETAIL_OPERATION_BAR">
        <el-button
          size="mini"
          type="primary"
          icon="el-icon-success"
        >
          保存
        </el-button>
        <el-button
          @click="edit_user = ''"
          size="mini"
          icon="el-icon-error"
        >
          取消
        </el-button>
      </el-row>
    </div>
  </el-row>
</template>
 
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import { OA_CONST } from '../../../apollo-server/utils/const'
import { getParameterByName } from '@/utils/fns'
import { OA, APOLLO } from 'types';
import gql from 'graphql-tag'
import MemberEditItem from '@/components/oa/packages/member-edit-item/main.vue'
enum CNT {
  JUST_QUERY = 'justQuery',

  CLS_OA_USR_MANAGEMENT = 'oa-member-edit',
  CLS_DEPARTMENT_LIST = 'department-list',
  CLS_DEPARTMENT_LIST_COEVER = 'department-list-cover',
  CLS_USR_LIST = 'user-list',
  CLS_USR_DETAIL = 'user-detail',
  CLS_USR_DETAIL_TITLE = 'user-detail-title',
  CLS_USR_LIST_ROW = 'user-list-row',
  CLS_USR_LIST_HEADER = 'user-list-header',
  CLS_USR_LIST_MORE = 'user-list-more',
  CLS_USR_DETAIL_OPERATION_BAR = 'user-detail-operation-bar',

  TREE_NODE_CHILDREN = 'children',
  TREE_NODE_LABEL = 'name',
  TREE_NODE_KEY = 'id',
  DEPARTMENT_LIST = 'departmentList',
  USR_LIST = 'userList',
  EXPANDED = 'expanded',
}

let sql = require('@/graphql/oa.gql')
let departmentIdMap: {
  [key: string]: OA.DEPARTMENT.Department
} = {}
let departmentParentIdMap: {
  [key: string]: {
    departmentId: OA.DEPARTMENT.DepartmentId
    order: number
  }[]
} = {}
let userMap: {
  [key: string]: OA.USER.User
} = {}
let userListMap: {
  [key: string]: OA.USER.User[]
} = {}
let memberStatusMap: string[] = [
  '试用期', '正式员工', '离职员工'
]
@Component<MemberEdit>({
  mounted() {
    this.changeMemberStatus(1)
    this.changeEnrollmentDate(new Date)
    this.changeFormalDate(new Date)
    this.changeResignDate(new Date)
    this.changeAnnualVacation(15)
  },
  watch: {
    selectFilter(selectFilter: any[]) {
      (this.$refs.departmentTree as any).filter();
      let userListFilter: OA.USER.User[] = []
      if (selectFilter.length) {
        selectFilter.forEach(item => {
          if (typeof item === 'string') {
            setTimeout(() => {
              let { userid, departmentId } = JSON.parse(item)
              userListFilter.filter(item => {
                return item.userid === userid
              }).length === 0 && userListFilter.push(userMap[userid])
            })
          } else {
            this.bl3(item, userListFilter)
          }
        })
        setTimeout(() => {
          this.$set(this.store, 'userListFilter', userListFilter)
        })
      } else {
        this.$set(this.store, 'userListFilter', null)
      }

    }
  },
  components: {
    'member-edit-item': MemberEditItem
  },
  apollo: {
    accessToken: {
      query: gql`query accessToken {
        oa(options: {
          name: ${OA_CONST.QUERY.ACCESS_TOKEN}
        }) 
      }`,
      update: function (res: OA.Res<string>) {
        this.$set(this.store, OA_CONST.QUERY.ACCESS_TOKEN, res.oa)
        this.$apollo.mutate({
          mutation: sql.departmentList,
          variables: {
            data: {
              access_token: this.store.accessToken
            }
          },
          update: (store, res: APOLLO.ServerRes<OA.Res<OA.DEPARTMENT.Department[]>>) => {
            if (!this.getDepartmentList[CNT.JUST_QUERY]) {
              this.getDepartmentList[CNT.JUST_QUERY] = true
              setTimeout(() => {
                this.getDepartmentList(res)
                this.getDepartmentList[CNT.JUST_QUERY] = false
              }, 1000)
            }
          },
        })
      }
    },
  }
  // config.signature = require('sha1')(`jsapi_ticket=${data[1]}&noncestr=${config.nonceStr}&timestamp=${config.timestamp}&url=${location.href}`)
})

export default class MemberEdit extends Vue {
  /** this data store */
  store = {} as {
    accessToken: string
    departmentList: OA.DEPARTMENT.DepartmentTreeDataItem[]
    userList: OA.USER.User[]
    userListFilter: OA.USER.User[]
    currentNodeKey: number
    treeNodeState: {
      last: number
      current: number
    }
  }
  /** 常量 */
  CNT = CNT
  editable_user = false
  /** 编辑状态中的用户信息 */
  edit_user: OA.USER.User = '' as any
  /** 成员状态 */
  memberStatus = ''
  /** 入职日期 */
  enrollmentDate = ''
  /** 转正日期 */
  formalDate = ''
  /** 离职日期 */
  resignDate = ''
  /** 年假 */
  annualVacation = ''
  selectFilter: any[] = []
  filterList = []
  /** nian */
  annualVacationTableData: any[] = []

  bl0(arr, index, index_, last, userList) {
    arr.forEach(departmentId => {
      if (departmentId.length) {
        this.bl0(departmentId, index, index_, last, userList)
      } else {
        index++
        if (!userListMap[departmentId]) {
          ((index, departmentId) => {
            this.$apollo.mutate({
              mutation: sql.userList,
              variables: {
                data: {
                  access_token: this.store.accessToken,
                  department_id: departmentId
                }
              },
              update: (store, res: APOLLO.ServerRes<OA.Res<OA.USER.User[]>>) => {
                index_++

                res.data.oa.forEach(user => {
                  userMap[user.userid] = user
                })
                userListMap[departmentId] = res.data.oa

                if (index < last) {
                  userList = userList.concat(userListMap[departmentId])
                } else {
                  userList = userListMap[departmentId].concat(userList)
                }
                last = index
                if (index_ === index) {
                  this.$set(this.store, 'userList', userList)
                }
              }
            })
          })(index, departmentId)
        } else {
          index_++
          userList = userList.concat(userListMap[departmentId])
          if (index_ === index) {
            this.$set(this.store, 'userList', userList)
          }
        }
      }
    })
  }

  bl1(departmentList: OA.DEPARTMENT.DepartmentTreeDataItem[], filterValue, filterList) {
    departmentList.forEach(department => {
      if (department.children) {
        if (department.name.indexOf(filterValue) !== -1)
          filterList.push({
            key: department.id,
            label: department.name,
            value: department.id,
          })
        this.bl1(department.children, filterValue, filterList)
      } else {
        if (department.name.indexOf(filterValue) !== -1)
          filterList.push({
            key: department.id,
            label: department.name,
            value: department.id,
          })
      }
    })
  }

  bl2(userListMap, filterValue, filterList) {
    for (let name in userListMap) {
      let userList: OA.USER.User[] = userListMap[name]
      userList.forEach(user => {
        if (user.name.indexOf(filterValue) !== -1 || user.userid.indexOf(filterValue) !== -1)
          user.department.forEach(departmentId => {
            filterList.push({
              key: user.userid,
              label: user.name,
              value: JSON.stringify({
                userid: user.userid,
                departmentId
              })
            })
          })
      })
    }
  }

  bl3(departmentId: string, userListFilter) {
    if (departmentIdMap[departmentId].hasOwnProperty(CNT.TREE_NODE_CHILDREN)) {
      departmentIdMap[departmentId][CNT.TREE_NODE_CHILDREN].forEach(department => {
        this.bl3(department.id, userListFilter)
      })
    } else {
      userListMap[departmentId].forEach(user => {
        userListFilter.push(user)
      })
    }
  }

  queryAnnualVacation() {
    new Promise(resolve => {
      resolve()
    }).then(() => {
      this.annualVacationTableData = [{ name: 'shindousaigo' }]
    })
  }

  departmentSelectFilter(filterValue) {
    if (filterValue) {
      let filterList = []
      this.bl1(this.store.departmentList, filterValue, filterList)
      this.bl2(userListMap, filterValue, filterList)
      this.filterList = filterList
    } else {
      this.filterList = []
    }
  }

  departmentListFilter(value, data: OA.DEPARTMENT.Department, node) {
    if (this.selectFilter.length) {
      let isThrough
      let department_id = data.id
      for (let i = 0; i < this.selectFilter.length; i++) {
        let item = this.selectFilter[i]
        if (typeof item === 'string') {
          let { userid, departmentId } = JSON.parse(item)
          return department_id == departmentId ? true : false
        } else {
          return department_id === item ? true : false
        }
      }
    } else {

      return true
    }
  }

  willChangeEnrollmentDate() {
    (this.$refs.enrollmentDate as any).showPicker()
  }
  changeEnrollmentDate(value) {
    let dateIns = new Date(value)
    let year = dateIns.getFullYear()
    let month: any = '0' + (dateIns.getMonth() + 1)
    month.length === 3 && (month = Number(month))
    let date: any = '0' + dateIns.getDate()
    date.length === 3 && (date = Number(date))
    this.enrollmentDate = [year, month, date].join('-')
  }

  willChangeFormalDate() {
    (this.$refs.formalDate as any).showPicker()
  }
  changeFormalDate(value) {
    let dateIns = new Date(value)
    let year = dateIns.getFullYear()
    let month: any = '0' + (dateIns.getMonth() + 1)
    month.length === 3 && (month = Number(month))
    let date: any = '0' + dateIns.getDate()
    date.length === 3 && (date = Number(date))
    this.formalDate = [year, month, date].join('-')
  }

  willChangeResignDate() {
    (this.$refs.resignDate as any).showPicker()
  }
  changeResignDate(value) {
    let dateIns = new Date(value)
    let year = dateIns.getFullYear()
    let month: any = '0' + (dateIns.getMonth() + 1)
    month.length === 3 && (month = Number(month))
    let date: any = '0' + dateIns.getDate()
    date.length === 3 && (date = Number(date))
    this.resignDate = [year, month, date].join('-')
  }

  willChangeAnnualVacation() {

  }
  changeAnnualVacation(days) {
    this.annualVacation = days
  }

  changeMemberStatus(type) {
    this.memberStatus = memberStatusMap[type]
  }


  nodeClick(data: OA.DEPARTMENT.DepartmentTreeDataItem, node, com) {
    if (data.children) {
      this.setUserList(data.id)
      if (this.store.treeNodeState.last !== this.store.treeNodeState.current) {
        node[CNT.EXPANDED] = !node[CNT.EXPANDED]
        return node
      }
    } else {
      this.store.userList = userListMap[data.id]
    }
  }
  getDepartmentIdByOrder(departmentId: number) {
    if (departmentParentIdMap.hasOwnProperty(departmentId)) {
      return departmentParentIdMap[departmentId].map(({ departmentId }) => {
        return this.getDepartmentIdByOrder(departmentId)
      })
    } else {
      return departmentId
    }
  }
  setUserList(departmentId: number) {
    let arr = this.getDepartmentIdByOrder(departmentId)
    let index = -1
    let index_ = -1
    let last = -1
    let userList: any[] = []
    this.bl0(arr, index, index_, last, userList)
  }
  currentChange(data: OA.DEPARTMENT.DepartmentTreeDataItem, node) {
    this.store.treeNodeState.last = this.store.treeNodeState.current
    this.store.treeNodeState.current = data.id
  }
  getDepartmentList(res: APOLLO.ServerRes<OA.Res<OA.DEPARTMENT.Department[]>>) {
    if (!res.error) {
      let dataParse = function (departmentId): OA.DEPARTMENT.DepartmentTreeDataItem {
        if (departmentParentIdMap.hasOwnProperty(departmentId)) {
          return Object.assign(departmentIdMap[departmentId], {
            children: departmentParentIdMap[departmentId].map(function ({ departmentId }) {
              return dataParse(departmentId)
            })
          })
        } else {
          return departmentIdMap[departmentId]
        }
      }

      res.data.oa.forEach(department => {
        departmentIdMap[department.id] = department
        if (!departmentParentIdMap[department.parentid]) {
          departmentParentIdMap[department.parentid] = [{
            departmentId: department.id,
            order: department.order
          }]
        } else {
          let add = {
            departmentId: department.id,
            order: department.order
          }
          let arr = departmentParentIdMap[department.parentid]
          let len = arr.length
          let last = arr[len - 1]
          if (add.order > last.order) {
            arr.unshift(add)
          } else {
            arr.push(add)
          }
        }
      })
      let departmentList = dataParse(departmentParentIdMap[OA_CONST.DEPARTMENT_LIST_ROOT_PARENT_ID][0].departmentId)
      if (departmentList) {
        this.setUserList(departmentList.id)
        this.$set(this.store, CNT.DEPARTMENT_LIST, departmentList.children)
        this.store.currentNodeKey = this.store.departmentList[0].id
        this.store.treeNodeState = {
          last: -1,
          current: this.store.currentNodeKey
        }
      }
    }
  }
  tableDepartmentFormatter(row: OA.USER.User, column, cellValue, index) {
    return departmentIdMap[row.department[0]].name
  }
  tablePositionFormatter(row: OA.USER.User, column, cellValue, index) {
    return row.position || '无'
  }
  userCellEnter(row, column, cell, event) {
    if (column.property === 'more') {
      this.editable_user = true
      cell.classList.add(CNT.CLS_USR_LIST_MORE)
    }
  }
  userCellLeave(row, column, cell, event) {
    if (column.property === 'more') {
      this.editable_user = false
      cell.classList.remove(CNT.CLS_USR_LIST_MORE)
    }
  }
  userCellDbClick(row: OA.USER.User, column, cell, event) {
    if (this.editable_user) {
      this.edit_user = row
    }
  }
}
</script>

<style lang="scss">
$oa_user_management_width: 1200px;
$department_list_width: 260px;
$user_list_width: $oa_user_management_width - $department_list_width - 100;
.oa-member-edit {
  width: $oa_user_management_width;
  .department-list {
    position: relative;
    width: $department_list_width;
  }
  .department-list-cover {
    position: absolute;
    top: 0;
    width: 100%;
    height: 100%;
  }

  .user-list,
  .user-detail {
    width: $user_list_width;
  }

  .user-list-row {
    font-size: 14px;
  }
  .user-list-header {
    font-size: 14px;
    letter-spacing: 4px;
  }
  .user-list-more {
    cursor: pointer;
    color: #fff;
    background: #4a77ac !important;
  }

  /** .user-detail */
  .user-detail-title {
    font-size: 16px;
    margin: 8px 0;
  }
  .user-detail-operation-bar {
    padding: 8px 10px;
    background: #dfe9f5;
  }
  .user-detail-user-box {
    margin: 10px 0 0 10px;
    padding: 0 0 10px 0;
    border-bottom: 1px dashed #e4e6e9;
  }
  .user-detail-avatar {
    width: 60px;
    height: 60px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    img {
      width: 100%;
      height: 100%;
    }
  }
  .user-detail-user {
    width: 400px;
  }
  .user-detail-user-txt {
    font-size: 14px;
    padding: 0 16px;
  }
  .user-detail-user-set {
    margin: 10px 0;
  }
  .enrollment-date-edit-button,
  .formal-date-edit-button,
  .resign-date-edit-button {
    position: relative;
  }
  .enrollment-date-picker,
  .formal-date-picker,
  .resign-date-picker {
    top: -50px;
    left: 60px;
    position: absolute;
    visibility: hidden;
  }
  /** .user-detail */
  .tree-node {
    font-size: 14px;
    // font-family: Arial "Microsoft Yahei";
  }
  .el-tree-node__expand-icon {
    font-size: 18px;
  }
  .el-tree-node__content {
    height: 32px;
  }
  .el-tree-node__content:hover {
    background: #edf1f5 !important;
  }
  .el-tree-node.is-current {
    > .el-tree-node__content {
      background: #4a77ac !important;
      color: #fff;
    }
  }
  .icon-folder-blue {
    padding: 0 10px 0 2px;
  }
}
</style>

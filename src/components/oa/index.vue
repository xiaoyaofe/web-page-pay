<template>
  <div class="oa">
    <div v-if="code">
      <el-row
        type="flex"
        justify="center"
        align="middle"
      >
        <h1 class="title">OA管理系统</h1>
      </el-row>
      <el-tabs v-model="activeName">
        <el-tab-pane
          v-for="({name, label, component}, index) in menu"
          :key="index"
          :label="label"
          :name="name"
        >
          <component :is="component"></component>
        </el-tab-pane>
      </el-tabs>

    </div>
    <div v-else>
      <el-row
        type="flex"
        justify="center"
        align="middle"
        :id="CNT.ID_WW_LOGIN"
        :class="CNT.CLS_WW_LOGIN"
      ></el-row>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import MemberEdit from '@/components/oa/MemberEdit.vue'
import MemberInfo from '@/components/oa/MemberInfo.vue'

import { getParameterByName } from '@/utils/fns';
import { OA_CONST } from '../../../apollo-server/utils/const'

// import MembeEditItem from '@/components/oa/packages/member-edit-item/index.js'
// Vue.use(MembeEditItem)

let code = getParameterByName(OA_CONST.CODE)
let wwLoginScript = document.createElement('script')
let wwLoginScriptPromise = (function () {
  let resolve
  let promise = new Promise(_ => {
    resolve = _
  })
  return { promise, resolve }
})()
wwLoginScript.src = "//rescdn.qqmail.com/node/ww/wwopenmng/js/sso/wwLogin-1.0.0.js"
document.body.appendChild(wwLoginScript)
wwLoginScript.onload = () => {
  wwLoginScriptPromise.resolve()
}

const CNT = {
  ID_WW_LOGIN: 'oa-wwlogin',
  CLS_WW_LOGIN: 'oa-wwlogin',
}
const isRoot = true

@Component<OA>({
  components: {
    MemberEdit,
    MemberInfo
  },
  mounted() {
    if (!code) {
      wwLoginScriptPromise.promise.then(function () {
        window.WwLogin({
          id: CNT.ID_WW_LOGIN,
          href: '',
          state: '',
          appid: OA_CONST.CORP_ID,
          agentid: OA_CONST.AGENT_ID,
          redirect_uri: encodeURIComponent('http://my.shindousaigo.com:8080/oa')
        })
      })
    }
  },
})
export default class OA extends Vue {
  /** authCode */
  code = code
  /** constant */
  CNT = CNT
  activeName = 'members-edit'
  menu = isRoot ? [
    { name: 'member-info', label: '个人信息', component: 'MemberInfo' },
    { name: 'members-edit', label: '成员编辑', component: 'MemberEdit' }
  ] : [
      { name: 'member-info', label: '个人信息' }
    ]
}
</script>

<style lang="scss">
.oa {
  margin: 0 auto;
  width: 1200px;
  .title {
    margin-top: 40px;
  }
  .oa-wwlogin {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: -10px;
  }
}
</style>

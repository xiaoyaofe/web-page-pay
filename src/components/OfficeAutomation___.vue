<template>
  <div class="oa">
    <el-row type="flex" justify="center" align="middle">
      <h1 class="title">OA管理系统q</h1>
    </el-row>
    <el-tabs v-model="activeName">
      <el-tab-pane label="用户管理" name="first">
        <OaUserManagement />
      </el-tab-pane>
      <el-tab-pane label="配置管理" name="second">配置管理</el-tab-pane>
      <el-tab-pane label="角色管理" name="third">角色管理</el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import OaUserManagement from '@/components/oa/OaUserManagement.vue'

@Component<OA>({
  components: {
    OaUserManagement
  }
})
export default class OA extends Vue {
  activeName = 'first'
}
</script>

<style lang="scss">
.oa {
  margin: 0 auto;
  width: 1200px;
  .title {
    margin-top: 40px;
  }
}
</style>

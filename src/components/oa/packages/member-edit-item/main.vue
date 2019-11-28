<template>
  <el-row
    class="member-edit-item"
    type="flex"
    align="middle"
  >
    <span class="left">
      <slot name="left"></slot>
    </span>
    <slot name="right"></slot>
  </el-row>
</template>
<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
export default class MemberEditItem extends Vue {
  name = 'member-edit-item'
}
</script>
<style lang="scss">
.member-edit-item {
  font-size: 14px;
  margin: 16px 0 16px 50px;
  .left {
    width: 70px;
    margin-right: 10px;
  }
}
</style>

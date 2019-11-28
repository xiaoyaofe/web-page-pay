<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <ul>
      <li
        v-for="item in modules"
        :key="item.route"
      >
        <a :href="'/' + item.route">{{item.name}}</a>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;
  modules = [
    { route: 'order-management', name: '订单管理' },
    { route: 'zone-management', name: '区服管理' },
    { route: 'channel-management', name: '渠道管理' },
    { route: 'data-query', name: 'DataQuery 数据查询' },
    { route: 'apollo', name: 'Apollo 示例' },
    { route: 'oa', name: 'OA系统' },
    { route: 'axios', name: 'Axios 示例' },
    { route: 'pixel', name: 'Pixel 示例' },
  ]
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0;
}
ul {
  list-style-type: none;
  padding: 0;
  margin-top: 10px;
}
li {
  display: inline-block;
  margin: 8px 10px;
  font-size: 14px;
}
a {
  color: #42b983;
}
</style>

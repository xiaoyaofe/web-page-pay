<template>
  <div class="home">
    <img
      class="logo"
      src="@/assets/logo.jpg"
    >
    <HelloWorld :msg="msg" />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HelloWorld from "@/components/HelloWorld.vue"; // @ is an alias to /src

@Component({
  components: {
    HelloWorld
  }
})
export default class Home extends Vue {
  msg = 'NAVIGATION PAGE'
}
</script>
<style lang="scss">
.home {
  padding-top: 200px;
  text-align: center;
  .logo {
    width: 200px;
    height: 200px;
  }
}
</style>


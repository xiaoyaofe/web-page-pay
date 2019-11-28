<template>
    <div>
      活动页面
      asdfasdfdsfas
      afasdfsdaf
      <button @click="dadian1">
        sdfasdfsdafsdfdsa
      </button>
    </div>
</template>


<style lang="scss">
</style>

<script lang="ts">
import Vue from "vue";
import Pixel from "@/service/pixel";
Pixel.instance.init({
  id: {
    fb: "asdfasdf",
    ga: "asdfasdfdsf"
  }
});
export default Vue.extend({
  created() {
    Pixel.instance.init({
      id: {
        fb: "asdfasdf",
        ga: "asdfasdfdsf"
      }
    });
  },
  mounted() {},
  methods: {
    dadian1() {
      Pixel.instance.pixel("dadian1");
    }
  }
});
</script>

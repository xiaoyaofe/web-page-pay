<template>
  <div>
    <router-view/>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
declare var CONFIG: Object;
export default Vue.extend({
  data() {
    return {
      text:CONFIG
    }
  },
  created(){
    document.getElementsByTagName("title")[0].innerText = this.text['language'].headerTitle;
  },
});
</script>

<style lang="scss">
.fadeIn-enter-active,
.fadeIn-leave-active {
  transition: opacity 0.3s;
}
.fadeIn-enter,
.fadeIn-leave-active {
  opacity: 0;
}
/*---- variables ----*/
$pc: "screen and (min-width: 980px)";
$mobile: "screen and (max-width: 979px) and (min-width: 0px)";

/*---- Mixins ----*/
@mixin mq($mqString) {
  @media #{$mqString} {
    @content;
  }
}
html{
  width: 100%;
  height: 100%;
}
body {
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0;
  // @include mq($pc) {
  //   width: 100%;
  //   height: 3152px;
  //   min-width: 1200px;
  //   background: url("./modules/activity/assets/pc/bg_01.jpg"),
  //     url("./modules/activity/assets/pc/bg_02.jpg"),
  //     url("./modules/activity/assets/pc/bg_03.jpg"),
  //     url("./modules/activity/assets/pc/bg_04.jpg");
  //   background-repeat: no-repeat;
  //   background-position: center 0px, center 241px, center 483px, center 724px;
  //   position: relative;
  // }

  // @include mq($mobile) {
  //   width: 100%;
  //   height: 46.68rem;
  //   background: url("./modules/activity/assets/mobile/bg.jpg")no-repeat;
  //   background-size: 100%;
  // }
}
</style>

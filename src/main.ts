import "babel-polyfill";
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
// import store from "./store";
// import "./registerServiceWorker";
// import { createProvider } from "./vue-apollo";
// import "./plugins/element";
// import "./plugins/iview";
import axios from 'axios'
import './modules/activity/plugins/rest.scss'
import './modules/activity/plugins/jqpagination.css'
//弹窗
import Dialog from './modules/activity/common/dialog'
declare var window: any;
declare var FB: any;
Vue.use(Dialog)
// 移动端自适应
var iWidth = document.documentElement.clientWidth;
if (!/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
  console.log("pc")
  if (iWidth < 980) {
    document.getElementsByTagName("html")[0].style.fontSize = iWidth / 750 * 100 + "px";
  }
} else {
  document.getElementsByTagName("html")[0].style.fontSize = iWidth / 750 * 100 + "px";
};
window.addEventListener('resize', function () {
  var iWidth = document.documentElement.clientWidth;
  if (!/(iPhone|iPad|iPod|iOS|Android)/i.test(navigator.userAgent)) {
    if (iWidth < 980) {
      location.reload();
    }
  }else {
    if (iWidth >= 980) {
      location.reload();
    }
  }
}, true);
// FB
window.fbAsyncInit = function () {
  FB.init({
    appId: '1887911061495843',
    autoLogAppEvents: true,
    xfbml: true,
    version: 'v3.0'
  });
};

(function (d, s, id) {
  var js, fjs: any = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {
    return;
  }
  js = d.createElement(s);
  js.id = id;
  js.src = "https://connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

Vue.prototype.$http = axios.create({
  baseURL: ' http://172.16.10.124:8191',
})

new Vue({
  router,
  // store,
  // apolloProvider: createProvider(),
  render: h => h(App)
}).$mount("#app");

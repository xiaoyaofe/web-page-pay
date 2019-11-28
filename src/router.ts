import Vue from "vue";
import Router from "vue-router";
import Login from "./modules/activity/components/login/Login.vue";

Vue.use(Router);

export default new Router({
  // mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "login",
      component: Login
    }, {
      path: "/index",
      name: "index",
      component: () => import("./modules/activity/components/pay/Pay.vue"),
      // redirect: "/index/:id" ,//重定向

      children: [// 动态路径参数 以冒号开头
        {
          path: '/index/:id',
          // component: () => import("./modules/activity/components/pay/dynamic/Dynamic.vue"),
          children: [// 动态路径参数 以冒号开头
            {
              path: '/index/:id/:page',
              // component: () => import("./modules/activity/components/pay/dynamic/Dynamic.vue")
            }]
        }]
    },
    // {
    //   path: "/about",
    //   name: "about",
    //   component: () => import("./views/About.vue")
    // },
    // {
    //   path: "/apollo",
    //   name: "apollo",
    //   component: () => import("./components/ApolloExample.vue")
    // },
    // {
    //   path: "/order-management",
    //   name: "order-management",
    //   component: () => import("./views/OrderManagement.vue")
    // },
    // {
    //   path: "/zone-management",
    //   name: "zone-management",
    //   component: () => import("./views/ZoneManagement.vue")
    // },
    // {
    //   path: "/channel-management",
    //   name: "channel-management",
    //   component: () => import("./views/ChannelManagement.vue")
    // },
    // {
    //   path: "/data-query",
    //   name: "data-query",
    //   component: () => import("./views/DataQuery.vue")
    // },
    // {
    //   path: "/oa",
    //   name: "oa",
    //   component: () => import("./components/oa/index.vue")
    // },
    // {
    //   path: "/axios",
    //   name: "axios",
    //   component: () => import("@/modules/example/Axios.vue")
    // },
    // {
    //   path: "/pixel",
    //   name: "pixel",
    //   component: () => import("./modules/example/Pixel.vue")
    // },
    // {
    //   path: "/authority/:component",
    //   name: "authority",
    //   component: () => import("@/modules/Authority.vue")
    // },
  ]
});

import Vue from "vue";
import Router from "vue-router";
import Join from "./views/Join.vue";
import Home from "./views/Home.vue";
import Create from "./views/Create.vue";
import Vote from "./views/Vote.vue";
import Watch from "./views/Watch.vue";

Vue.use(Router);

// TODO: Set up watch and vote pages
export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/create",
      name: "create",
      component: Create
    },
    {
      path: "/join",
      name: "join",
      component: Join
    },
    {
      path: "/vote",
      name: "vote",
      component: Vote
    },
    {
      path: "/watch",
      name: "watch",
      component: Watch
    },
    // {
    //   path: "/join",
    //   name: "join",
    //   // route level code-splitting
    //   // this generates a separate chunk (about.[hash].js) for this route
    //   // which is lazy-loaded when the route is visited.
    //   component: () =>
    //     import(/* webpackChunkName: "about" */ "./views/Join.vue")
    // }
  ]
});

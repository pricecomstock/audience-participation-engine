import Vue from "vue";
import Router from "vue-router";
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
      path: "/vote/:id",
      name: "vote",
      component: Vote,
      props: true
    },
    {
      path: "/watch/:id",
      name: "watch",
      component: Watch,
      props: true
    }
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

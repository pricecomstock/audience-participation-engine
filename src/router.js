import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Create.vue";

Vue.use(Router);

// TODO: Set up create and join pages
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
      path: "/home",
      name: "home",
      component: Home
    },
    {
      path: "/join",
      name: "join",
      // route level code-splitting
      // this generates a separate chunk (about.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/Join.vue")
    }
  ]
});

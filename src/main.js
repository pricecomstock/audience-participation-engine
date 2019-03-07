import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./scss/pcstyles.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

import io from "socket.io-client";
import VueSocketio from "vue-socket.io";

// export const SocketInstance = socketio('http://localhost:5000')
Vue.use(
  new VueSocketio({
    debug: true,
    connection: io(process.env.VUE_APP_BACKEND_URL),
    vuex: false
  })
);
// Vue.use(VueSocketio, SocketInstance);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

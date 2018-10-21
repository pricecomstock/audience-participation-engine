import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./scss/pcstyles.scss";
import "@fortawesome/fontawesome-free/css/all.min.css";

import socketio from "socket.io-client";
import VueSocketio from "vue-socket.io";

// export const SocketInstance = socketio('http://localhost:5000')
Vue.use(VueSocketio, process.env.VUE_APP_BACKEND_URL);
// Vue.use(VueSocketio, SocketInstance);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");

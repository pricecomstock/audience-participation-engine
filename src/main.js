import Vue from 'vue'
import App from './App.vue'
import 'bulma/css/bulma.css'
// import VueGun from 'vue-gun';
// import Gun from 'gun'

// gun = Gun()

// Vue.use(VueGun, {
//   peers: ['http://localhost:5000/gun']
// })

new Vue({
  el: '#app',
  render: h => h(App)
})

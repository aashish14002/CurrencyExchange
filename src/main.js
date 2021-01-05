import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import apiService from './apiService.js'

Vue.config.productionTip = false

new Vue({
  mixins: [apiService],
  render: h => h(App),
}).$mount('#app')

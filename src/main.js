import Vue from 'vue'
import App from './App.vue'
import {store} from './store/'
import VueRouter from 'vue-router'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import router from "@/router"
import VueAxios from "@/plugins/axios"
import VueAutoSuggest from "vue-autosuggest"
import Vuex from 'vuex'
import './assets/autosuggest.css'
Vue.use(Vuex)
Vue.use(VueAutoSuggest);
Vue.config.productionTip = false
Vue.use(VueAxios)
Vue.use(BootstrapVue)
Vue.use(IconsPlugin)
Vue.use(VueRouter)
new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')

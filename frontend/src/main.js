import Vue from 'vue'
import App from './App.vue'
import router from './router';
import VModal from 'vue-js-modal'
Vue.use(VModal, { dynamic: true });
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
}).$mount('#app')

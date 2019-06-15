import Vue from 'vue';
import App from './App.vue';
import store from './store/index.js';
import Dialog from './plugins/Dialog.js';

Vue.use(Dialog);

Vue.config.productionTip = false;

new Vue({
  store,
  render: function (h) { return h(App) },
}).$mount('#app');

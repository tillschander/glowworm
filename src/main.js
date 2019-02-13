import Vue from 'vue';
import App from './App.vue';
import store from './store';
import Dialog from './plugins/Dialog.js';
import './assets/css/dialog.css';

Vue.use(Dialog);

Vue.config.productionTip = false;

new Vue({
  store,
  render: function (h) { return h(App) },
}).$mount('#app');

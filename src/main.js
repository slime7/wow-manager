import Vue from 'vue';
import ipcService from './plugins/ipcService';
import App from './App.vue';
import store from './store';
import vuetify from './plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.config.productionTip = false;
Vue.use(ipcService);

new Vue({
  store,
  vuetify,
  render(h) { return h(App); },
}).$mount('#app');

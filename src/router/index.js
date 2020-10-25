import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '@/views/Layout/Layout.vue';
import AddGame from '@/views/AddGame.vue';
import Dashboard from '@/views/Dashboard.vue';
import ManagerPanel from '@/views/ManagerPanel.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: Layout,
    children: [
      {
        path: '',
        name: 'Home',
        redirect: {
          name: 'Dashboard',
        },
      },
      {
        path: 'add-game',
        name: 'AddGame',
        component: AddGame,
        meta: { navigationVisible: false },
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { navigationVisible: true },
      },
      {
        path: 'manager-panel',
        name: 'ManagerPanel',
        component: ManagerPanel,
        meta: { navigationVisible: true },
      },
    ],
  },
];

const router = new VueRouter({
  mode: 'hash',
  base: '/',
  routes,
});

export default router;

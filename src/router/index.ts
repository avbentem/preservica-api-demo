import {createRouter, createWebHistory, RouteRecordRaw} from 'vue-router';
import Home from '@/views/Home.vue';
import Configuration from '@/views/Configuration.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/config',
    name: 'Configuration',
    component: Configuration,
  },
  // Route level code-splitting; this generates a separate chunk (indexes.[hash].js) for this route
  // which is lazy-loaded when the route is visited.
  {
    path: '/indexes',
    name: 'Indexed fields',
    component: () => import(/* webpackChunkName: "indexes" */ '../views/Indexes.vue'),
  },
  {
    path: '/oai-pmh',
    name: 'OAI-PMH',
    component: () => import(/* webpackChunkName: "oai-pmh" */ '../views/OaiPmh.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import(/* webpackChunkName: "search" */ '../views/Search.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

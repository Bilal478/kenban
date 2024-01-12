// router.js

import Vue from 'vue';
import VueRouter from 'vue-router';
import Dashboard from './components/dashboard/dashboardComponent.vue';
import Login from './components/login/loginComponent.vue';

Vue.use(VueRouter);

const routes = [
  { path: '/dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/', component: Login },
  // Add other routes as needed

  // Catch-all route for non-existing routes
  { path: '*', redirect: '/' },

];

const router = new VueRouter({
  mode: 'history',
  routes,
});

// Vue Router navigation guard
router.beforeEach((to, from, next) => {
    console.log(to, from, next);
    const token = localStorage.getItem('token');
    if (to.path === '/' && token) {
        next('/dashboard');
      } else if (to.matched.some((record) => record.meta.requiresAuth) && !token) {
      // Redirect to login if trying to access a protected route without a token
      next('/');
    } else {
      next();
    }
  });

export default router;

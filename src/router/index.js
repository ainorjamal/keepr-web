import { createRouter, createWebHistory } from 'vue-router';
import LoginView from '../views/Auth/LoginView.vue';
import HomeView from '../views/HomeView.vue';
import { supabase } from '../supabase';

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    meta: { requiresAuth: true }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

// Navigation guard to check authentication
router.beforeEach(async (to, from, next) => {
  const { data: { user } } = await supabase.auth.getUser();
  
  if (to.meta.requiresAuth && !user) {
    next('/login');
  } else if (to.path === '/login' && user) {
    next('/home');
  } else {
    next();
  }
});

export default router;

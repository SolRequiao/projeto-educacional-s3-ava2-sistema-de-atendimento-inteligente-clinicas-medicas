import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/authStore';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import DashboardView from '../views/DashboardView.vue';
import ScheduleView from '../views/ScheduleView.vue';
import ProfileView from '../views/ProfileView.vue';
import AdminView from '../views/AdminView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: LoginView, meta: { guest: true } },
    { path: '/cadastro', name: 'register', component: RegisterView, meta: { guest: true } },
    { path: '/dashboard', name: 'dashboard', component: DashboardView, meta: { requiresAuth: true } },
    { path: '/agendar', name: 'schedule', component: ScheduleView, meta: { requiresAuth: true, roles: ['patient', 'admin'] } },
    { path: '/perfil', name: 'profile', component: ProfileView, meta: { requiresAuth: true } },
    { path: '/admin', name: 'admin', component: AdminView, meta: { requiresAuth: true, roles: ['admin'] } }
  ]
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (auth.token && !auth.user) {
    try {
      await auth.fetchMe();
    } catch {
      return '/login';
    }
  }

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return '/login';
  }

  if (to.meta.guest && auth.isAuthenticated) {
    return '/dashboard';
  }

  if (to.meta.roles && !to.meta.roles.includes(auth.user?.role)) {
    return '/dashboard';
  }

  return true;
});

export default router;

import { createRouter, createWebHistory } from 'vue-router'
import { useGenericStore } from '@/stores';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: import('@/views/Login.vue'),
    },
    {
      path: '/verify-otp',
      name: 'verifyOtp',
      component: import('@/views/VerifyOtp.vue'),
    },
    {
      path: '/',
      name: 'home',
      component: import('@/views/Home.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  // redirect to login page if not logged in and trying to access a restricted page
  const publicPages = ['/login'];
  const authRequired = !publicPages.includes(to.path);
  const auth = useGenericStore();
  console.log(authRequired, !auth.user);
  if (authRequired && !auth.user) {
    console.log('in');
    // auth.returnUrl = to.fullPath;
    return '/login';
  }
});

export default router

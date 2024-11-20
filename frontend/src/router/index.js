import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore, useUsersStore, useGenericStore } from '@/stores';
import { getCookie } from "@/utils/cookieManager.js";

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
      beforeEnter: checkPermission,
    },
    {
      path: '/',
      name: 'home',
      component: import('@/views/Home.vue'),
      beforeEnter: checkPermission,
    },
  ],
})

async function checkPermission(to, from, next) {
  // redirect to login page if not logged in and trying to access a restricted page

  // Check that there is a token
  const genericStore = useGenericStore();
  const a_token = genericStore.accessToken // getCookie('accessToken');
  if (!a_token) {
    return next({ name: 'login' });
  }
  // Check that the user has approved otp code
  const userStore = useUsersStore();
  const me = await userStore.getMe();
  // .then((response) => {
  //   console.log(response.data);
  if (to.name !== 'verifyOtp' && !me.data.has_otp_verified) {
    next({ name: 'verifyOtp' });
  }
  else if (to.name === 'verifyOtp' && me.data.has_otp_verified) {
    next({ name: 'home' });
  }
  // }).catch((error) => {
  //   console.log(error);
  //   return next({ name: from.name });
  // });
  return next();
  // const publicPages = ['/login'];
  // const authRequired = !publicPages.includes(to.path);
  // const auth = useGenericStore();
  // console.log(authRequired, !auth.user);
  // if (authRequired && !auth.user) {
  //   console.log('in');
  //   // auth.returnUrl = to.fullPath;
  //   return '/login';
  // }
}

export default router;

import { defineStore } from 'pinia';
import { getAccessTokenExpiration, getRefreshTokenExpiration, getCookie, setCookie, removeCookies } from '@/utils/cookieManager';

export const useGenericStore = defineStore({
  id: 'generic',
  state: () => ({
    user: null, // getCookie('user'),
    accessToken: getCookie('accessToken'),
    refreshToken: getCookie('refreshToken'),
    isLoading: false,
    isAppLoaded: false,
    activeRoute: '/',
  }),
  actions: {
    resetState() {
      this.user = null;
      this.accessToken = null;
      this.refreshToken = null;
      this.isAppLoaded = false;
      removeCookies();
    },
    setUser(user) {
      // setCookie('user', JSON.stringify(user), );
      this.user = user;
    },
    setTokens(tokens) {
      setCookie('accessToken', tokens['access'], getAccessTokenExpiration());
      this.accessToken = tokens['access'];
      setCookie('refreshToken', tokens['refresh'], getRefreshTokenExpiration());
      this.refreshToken = tokens['refresh'];
    },
    setLoading(isLoading) {
      this.isLoading = isLoading;
    },
    setAppLoaded() {
      this.isAppLoaded = true;
    },
    setActiveRoute(route) {
      this.activeRoute = route;
    }
  },
  // getters: {
  //   user: state => state.user,
  //   tokens: state => state.tokens,
  //   isLoading: state => state.isLoading,
  //   isUserLoggedIn: state => !!state.user,
  //   isAppLoaded: state => state.isAppLoaded,
  //   activeRoute: state => state.activeRoute
  // }
});
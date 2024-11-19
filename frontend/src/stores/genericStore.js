import { defineStore } from 'pinia';

export const useGenericStore = defineStore({
  id: 'generic',
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')),
    tokens: JSON.parse(localStorage.getItem('tokens')),
    isLoading: false,
    isAppLoaded: false,
    activeRoute: '/',
  }),
  actions: {
    resetState() {
      this.user = null;
      this.tokens = null;
      this.isAppLoaded = false;
      localStorage.removeItem('user');
      localStorage.removeItem('tokens');
      // TODO: remove users and tokens local storage
    },
    setUser(user) {
      localStorage.setItem('user', JSON.stringify(user));
      this.user = user;
    },
    setTokens(tokens) {
      localStorage.setItem('tokens', JSON.stringify(tokens));
      this.tokens = tokens;
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
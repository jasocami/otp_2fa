<template>
  <v-container>
    <v-row>
      <v-col class="text-center">
        <img alt="Vue logo" class="logo" src="@/assets/logo.svg" width="125" height="125" />
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5">
        <v-form>
          <v-text-field class="mt-1" id="otp" prepend-inner-icon="mdi-account" label="OTP" v-model="otp"
          placeholder="OTP" type="text" :rules="otpRules" required color="primary" variant="underlined">
          </v-text-field>
          <v-btn class="mt-5 login-button" color="primary" block rounded="lg" size="large" variant="outlined"
          @click="verify">
            Verify
          </v-btn>
        </v-form>
      </v-col>
    </v-row>
    <v-row>
      <v-col class="mt-5 text-center">
        <v-btn class="mt-5" color="warning" block rounded="lg" size="large" variant="outlined"
          @click="resend">
            Re-send
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
  import { ref, computed } from 'vue';
  import router from '@/router';
  import { useAuthStore, useGenericStore } from '@/stores';
  import { getAccessTokenExpiration, getRefreshTokenExpiration, getCookie, setCookie, removeCookies } from '@/utils/cookieManager';

  const otp = ref('');
  const otpRules = [
    v => !!v || 'OTP is required',
    v => (v && v.length == 6)  || 'OTP must be equal to 6 numbers',
  ];

  const authStore = useAuthStore();
  const genericStore = useGenericStore();

  const verify = () => {
    const data = { otp_code: otp.value };
    authStore.verifyOtp(data).then((response) => {
      console.log(response.data);
      router.push({ name: 'home' });
    })
    .catch((error) => {
      console.log(error);
    });
  }

  const resend = () => {
    authStore.resendOtp().then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.log(error);
    });
  }
</script>

<style>
</style>

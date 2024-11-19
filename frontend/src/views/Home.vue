<template>
  <main>
    <v-container>
      <v-row>
        <v-col>
          <h1>My info</h1>
          <br>
          <pre>
            {{ user }}
          </pre>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1>My info blocked</h1>
          <br>
          <pre>
            {{ blocked }}
          </pre>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script setup>
/*
  TODO: if OTP is not validated push to /validate-otp
*/
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';

  import { useUsersStore, useGenericStore } from '@/stores';

  // const authStore = useAuthStore();
  const genericStore = useGenericStore();
  const usersStore = useUsersStore();

  const { user } = storeToRefs(genericStore);

  const blocked = ref('');

  usersStore.getBlocked().then((response) => {
    blocked = response.data;
  })
  .catch((error) => {
    console.log(error);
  });

</script>

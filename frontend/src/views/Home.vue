<template>
  <main>
    <v-container>
      <v-row>
        <v-col>
          <h1>My info</h1>
          <br>
          <pre>
            Me: {{ user }}
          </pre>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <h1>My info blocked</h1>
          <br>
          <pre>
            Blocked: {{ blocked }}
          </pre>
        </v-col>
      </v-row>
    </v-container>
  </main>
</template>

<script>
  import { ref } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useUsersStore, useGenericStore } from '@/stores';

  export default {
    setUp() {
      const blocked = ref('');
      // const authStore = useAuthStore();
      const genericStore = useGenericStore();
      const usersStore = useUsersStore();

      const { user } = storeToRefs(genericStore);

      usersStore.getMe().then((response) => {
        this.user.value = response.data;
      })
      usersStore.getBlocked().then((response) => {
        this.blocked.value = response.data;
      })
      .catch((error) => {
        console.log(error);
      });
    }
  }



</script>

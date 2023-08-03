<template>
  <div>
    <navbar-app
      v-if="$route.name && !$route.name.startsWith('dashboard')"
    ></navbar-app>
    <navbar-dashboard
      v-if="$route.name && $route.name.startsWith('dashboard')"
    ></navbar-dashboard>
    <router-view />

    <teleport to="body">
      <div id="alerts" class="alert__container"></div>
    </teleport>

    <footer-app
      v-if="$route.name && !$route.name.startsWith('dashboard')"
    ></footer-app>
  </div>
</template>

<script>
import { useStore } from "vuex";

export default {
  setup() {
    const store = useStore();

    (async () => {
      await store.dispatch("auth/autoLogin");
    })();
  },
};
</script>

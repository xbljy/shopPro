<template>
  <div
    class="dashboard__container dashboard_privacey"
    v-if="Object.entries(userData).length > 0"
  >
    <nav class="dashboard_privacey__navbar">
      <button
        class="dashboard_privacey__button"
        :class="{ active: selectedComponent == 'UserInformation' }"
        @click="selectedComponent = 'UserInformation'"
      >
        <img src="@/assets/images/information.png" alt="用户信息" />
        <span> 用户信息 </span>
      </button>

      <button
        class="dashboard_privacey__button"
        :class="{ active: selectedComponent == 'Security' }"
        @click="selectedComponent = 'Security'"
      >
        <img src="@/assets/images/security.png" alt="密码" />
        <span> 密码 </span>
      </button>
    </nav>

    <section class="profile">
      <header class="profile__header">
        <img
          :src="require('@/assets/images/users/' + userData.photo[0].medium_image).default"
          alt="头像"
        />
      </header>

      <h2 class="heading__h2">{{ userData.name }}</h2>

      <ul class="profile__data--list">
        <li class="profile__data--item">
          <svg class="profile__data--icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-mail" />
          </svg>

          {{ userData.email }}
        </li>

        <li class="profile__data--item">
          <svg class="profile__data--icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-phone-outline" />
          </svg>

          {{ userData.phone }}
        </li>
      </ul>
    </section>

    <section class="dashboard_privacey__form">
      <component :is="selectedComponent"></component>
    </section>
  </div>
</template>

<script>
import UserInformation from "@/components/dashboard/privacey/UserInformation.vue";
import Security from "@/components/dashboard/privacey/Security.vue";

import { ref, computed } from "vue";
import { useStore } from "vuex";
export default {
  components: { UserInformation, Security },
  setup() {
    const selectedComponent = ref("UserInformation");
    const store = useStore();

    const userData = computed(() => store.getters["auth/getUserData"]);

    return {
      userData,
      selectedComponent,
    };
  },
};
</script>

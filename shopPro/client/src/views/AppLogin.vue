<template>
  <div class="app__container custom-2">
    <div class="wrapper">
      <form class="form rounded__base" @submit="submitForm($event)">
        <div class="heading">
          <div class="heading__text">账号登录</div>
          <img src="@/assets/images/wave.png" alt="" class="heading__wave" />
        </div>
        <div class="form__group">
          <label for="email" class="form__label">邮箱</label>
          <div>
          <input
            id="email"
            type="email"
            class="form__input"
            placeholder="请输入您的邮箱"
            v-model="user.email"
            @blur="v$.email.$touch"
          />

          <span class="error__message" v-if="v$.email.$error">
            {{ "邮箱"+v$.email.$errors[0].$message }}
          </span>
          </div>
        </div>

        <div class="form__group">
          <label for="password" class="form__label">密码</label>
          <div>
          <input
            id="password"
            type="password"
            class="form__input"
            placeholder="请输入您的密码"
            v-model="user.password"
            @blur="v$.password.$touch"
          />

          <span class="error__message" v-if="v$.password.$error">
            {{ "密码"+v$.password.$errors[0].$message }}
          </span>
          </div>
        </div>

        <div class="form__group">
          <base-button
            type="submit"
            class="btn-small btn-blue"
            :loading="userIsBeingLoggedIn"
            :innerText="'登录'"
            :disabled="userIsBeingLoggedIn || v$.$errors.length > 0"
          ></base-button>

          <div class="inquery">
            没有账号?
            <router-link to="/register" class="inquery__link"
              >立即注册</router-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { email, required } from "validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = reactive({
      email: "",
      password: "",
    });

    const userIsBeingLoggedIn = ref(false);

    const submitForm = async (e) => {
      e.preventDefault();

      v$.value.$touch();
      if (userIsBeingLoggedIn.value || v$.value.$invalid) return;
      userIsBeingLoggedIn.value = true;
      const res = await store.dispatch("auth/login", user);
      userIsBeingLoggedIn.value = false;
      if (res) router.push("/home");
    };

    // ========================== 校验 ================================
    const rules = {
      email: {
        required,
        email,
      },
      password: {
        required,
      },
    };
    const v$ = useVuelidate(rules, user, { $lazy: true });

    return {
      user,
      submitForm,
      userIsBeingLoggedIn,
      v$,
    };
  },
};
</script>

<template>
  <div class="app__container custom-2">
    <div class="wrapper">
      <form class="form rounded__base" @submit="submitForm($event)">
        <div class="heading">
          <div class="heading__text">注册账号</div>
          <img src="@/assets/images/wave.png" alt="" class="heading__wave" />
        </div>

        <div class="form__group">
          <label for="fullName" class="form__label">昵称</label>
          <input
            id="fullName"
            type="text"
            class="form__input"
            placeholder="请输入您的昵称"
            v-model="user.name"
            @blur="v$.name.$touch"
          />
          <span class="error__message" v-if="v$.name.$error">
            {{ v$.name.$errors[0].$message }}
          </span>
        </div>
        <div class="form__group">
          <label for="email" class="form__label">邮箱</label>
          <input
            id="email"
            type="email"
            class="form__input"
            placeholder="请输入您的邮箱"
            v-model="user.email"
            @blur="v$.email.$touch"
          />
          <span class="error__message" v-if="v$.email.$error">
            {{ v$.email.$errors[0].$message }}
          </span>
        </div>

        <div class="form__group">
          <label for="password" class="form__label">密码</label>
          <input
            id="password"
            type="password"
            class="form__input"
            placeholder="请输入您的密码"
            v-model="user.password"
            @blur="v$.password.$touch"
          />
          <span class="error__message" v-if="v$.password.$error">
            {{ v$.password.$errors[0].$message }}
          </span>
        </div>

        <div class="form__group">
          <label for="confirmPassword" class="form__label">确认密码</label>
          <input
            id="confirmPassword"
            type="password"
            class="form__input"
            placeholder="重新输入密码"
            v-model="user.passwordConfirm"
            @blur="v$.passwordConfirm.$touch"
          />
          <span class="error__message" v-if="v$.passwordConfirm.$error">
            {{ v$.passwordConfirm.$errors[0].$message }}
          </span>
        </div>
        <div class="form__group">
          <base-button
            type="submit"
            class="btn-small btn-blue"
            :loading="userIsBeingregistered"
            :disabled="userIsBeingregistered || v$.$errors.length > 0"
            :innerText="'注册'"
          ></base-button>

          <div class="inquery">
            已有账号?
            <router-link to="/login" class="inquery__link"
              >立即登录</router-link
            >
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

import { email, required, minLength, sameAs } from "validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    const store = useStore();
    const router = useRouter();
    const user = reactive({
      name: "",
      email: "",
      password: "",
      passwordConfirm: "",
    });

    const userIsBeingregistered = ref(false);
    const submitForm = async (e) => {
      e.preventDefault();

      v$.value.$touch();
      if (userIsBeingregistered.value || v$.value.$invalid) return;
      userIsBeingregistered.value = true;
      const res = await store.dispatch("auth/register", user);
      userIsBeingregistered.value = false;

      if (res) router.push("/home");
    };

    // ========================== 校验 ================================
    const password = computed(() => user.password);
    const rules = {
      name: {
        required,
      },
      email: {
        required,
        email,
      },
      password: {
        required,
        minLengthValue: minLength(8),
      },
      passwordConfirm: {
        required,
        sameAsPassword: sameAs(password),
      },
    };
    const v$ = useVuelidate(rules, user, { $lazy: true });

    return {
      user,
      submitForm,
      userIsBeingregistered,
      v$,
    };
  },
};
</script>

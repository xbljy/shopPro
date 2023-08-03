<template>
  <form class="form__style--2" @submit.prevent="submit">
    <div class="form__style--2__group">
      <label for="password" class="form__style--2__label">旧密码</label>

      <input
        type="password"
        class="form__style--2__input"
        v-model="data.passwordCurrent"
        @blur="v$.passwordCurrent.$touch"
        placeholder="请输入旧密码"
      />

      <span class="error__message" v-if="v$.passwordCurrent.$error">
        {{ v$.passwordCurrent.$errors[0].$message }}
      </span>
    </div>

    <div class="form__style--2__group">
      <label for="password" class="form__style--2__label">新密码</label>

      <input
        type="password"
        class="form__style--2__input"
        v-model="data.password"
        @blur="v$.password.$touch"
        placeholder="请输入新密码"
      />
      <span class="error__message" v-if="v$.password.$error">
        {{ v$.password.$errors[0].$message }}
      </span>
    </div>

    <div class="form__style--2__group">
      <label for="password" class="form__style--2__label">确认密码</label>
      <input
        type="password"
        class="form__style--2__input"
        v-model="data.passwordConfirm"
        @blur="v$.passwordConfirm.$touch"
        placeholder="确认密码"
      />
      <span class="error__message" v-if="v$.passwordConfirm.$error">
        {{ v$.passwordConfirm.$errors[0].$message }}
      </span>
    </div>

    <div class="form__style--2__group">
      <base-button
        type="submit"
        class="btn-dark btn-wide"
        :loading="dataSubmitted"
        :disabled="dataSubmitted || v$.$invalid"
        :innerText="'修改'"
      ></base-button>
    </div>
  </form>
</template>

<script>
import { reactive, ref, computed } from "vue";
import { Alert } from "@/utils/Alert.js";
import { useStore } from "vuex";

import { sameAs, required } from "validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    const store = useStore();
    const data = reactive({
      password: "",
      passwordCurrent: "",
      passwordConfirm: "",
    });
    const dataSubmitted = ref(false);
    const submit = async () => {
      v$.value.$touch();
      if (dataSubmitted.value || v$.value.$invalid) return;
      dataSubmitted.value = true;

      if (data.password !== data.passwordConfirm)
        return Alert("error", "passwords do not match", 3000);
      try {
        await store.dispatch("auth/updateMyPassword", data);
        dataSubmitted.value = false;
      } catch (err) {
        console.log(err.message);
      }
    };

    // ========================== 校验 ================================
    const password = computed(() => data.password);
    const rules = {
      passwordCurrent: {
        required,
      },
      password: {
        required,
      },
      passwordConfirm: {
        required,
        sameAsPassword: sameAs(password),
      },
    };
    const v$ = useVuelidate(rules, data, { $lazy: true });

    return {
      v$,
      data,
      submit,
      dataSubmitted,
    };
  },
};
</script>

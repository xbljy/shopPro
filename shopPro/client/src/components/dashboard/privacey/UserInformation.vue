<template>
  <form
    class="form__style--2"
    @submit.prevent="submit"
    v-if="Object.entries(userData).length > 0"
  >
    <div class="form__style--2__group">
      <label for="name" class="form__style--2__label">姓名</label>

      <input
        type="text"
        class="form__style--2__input"
        v-model="updatedData.name"
      />

      <span class="error__message" v-if="v$.name.$error">
        {{ v$.name.$errors[0].$message }}
      </span>
    </div>

    <div class="form__style--2__group">
      <label for="email" class="form__style--2__label">邮箱</label>

      <input
        type="email"
        class="form__style--2__input"
        v-model="updatedData.email"
      />

      <span class="error__message" v-if="v$.email.$error">
        {{ v$.email.$errors[0].$message }}
      </span>
    </div>

    <div class="form__style--2__group">
      <label for="phone" class="form__style--2__label">手机号</label>

      <input
        type="tel"
        class="form__style--2__input"
        v-model="updatedData.phone"
        @input="acceptNumber"
      />
    </div>

    <div class="form__style--2__group">
      <span>头像</span>
      <label for="photo" class="photo__label">
        <img
          :src="require('@/assets/images/users/' + userData.photo[0].small_image).default"
          alt="user photo"
        />
        选择图片
      </label>

      <input
        id="photo"
        type="file"
        class="form__style--2__input"
        ref="userPhoto"
        @change="uploadPhoto"
      />
    </div>

    <div class="form__style--2__group">
      <base-button
        type="submit"
        class="btn-dark btn-wide"
        :loading="dataSubmitted"
        :disabled="dataSubmitted"
        :innerText="'修改'"
      ></base-button>
    </div>
  </form>
</template>

<script>
import { ref, computed, reactive, watch } from "vue";
import { useStore } from "vuex";

import { email, required } from "validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  setup() {
    const store = useStore();

    const userData = computed(() => store.getters["auth/getUserData"]);

    const updatedData = reactive({
      name: userData.value.name,
      email: userData.value.email,
      phone: userData.value.phone,
      photo: "",
    });

    watch(userData, (data) => {
      updatedData.name = data.name;
      updatedData.email = data.email;
      updatedData.phone = data.phone;
    });

    const userPhoto = ref(null);

    const uploadPhoto = () => {
      updatedData.photo = userPhoto.value.files[0];
      userPhoto.value.previousSibling.classList.add("photo__added");
    };

    const dataSubmitted = ref(false);
    const submit = async () => {
      v$.value.$touch();
      if (dataSubmitted.value || v$.value.$invalid) return;
      dataSubmitted.value = true;
      for (const prop in updatedData) {
        if (!updatedData[prop]) delete updatedData[prop];
      }

      await store.dispatch("auth/updateUserData", updatedData);

      dataSubmitted.value = false;
    };

    const acceptNumber = () => {
      var x = updatedData.phone
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,3})(\d{0,4})/);

      updatedData.phone = !x[2]
        ? x[1]
        : "(" + x[1] + ") " + x[2] + (x[3] ? "-" + x[3] : "");
    };

    // ========================== 校验 ================================
    const rules = {
      email: {
        required,
        email,
      },
      name: {
        required,
      },
    };
    const v$ = useVuelidate(rules, updatedData, { $lazy: true });

    return {
      v$,
      updatedData,
      userData,
      acceptNumber,
      userPhoto,
      uploadPhoto,
      submit,
      dataSubmitted,
    };
  },
};
</script>

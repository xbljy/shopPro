<template>
  <teleport to="body">
    <transition name="fade">
      <base-popup ref="popup">
        <template #content>
          <form
            class="form__style--2 add__item--form form__style--2__selectors"
          >
            <h4 class="heading--h4 lowercase center">是否要删除?</h4>
            <div class="form__group">
              <button
                type="button"
                class="btn btn-small btn-dark"
                @click="closeConfirmPopup()"
              >
                取消
              </button>
              <base-button
                class="btn-small btn-blue"
                @click="confirm()"
                :loading="loading"
                :disabled="loading"
                :innerText="'确认'"
              >
              </base-button>
            </div>
          </form>
        </template>
      </base-popup>
    </transition>
  </teleport>
</template>

<script>
import { ref } from "vue";
export default {
  emits: ["confirmPopupClosed", "confirmPopupOpenned", "ProcessConfirmed"],
  setup(_, { emit }) {
    const popup = ref(null);
    const loading = ref(false);

    const closeConfirmPopup = () => {
      popup.value.closePopup();
      emit("confirmPopupClosed");
    };

    const openConfirmPopup = () => {
      popup.value.openPopup();
      emit("confirmPopupOpenned");
    };

    const setLoadingStatus = (value) => {
      if (typeof value !== "boolean") return;
      loading.value = value;
    };

    const confirm = () => {
      if (!loading.value) emit("ProcessConfirmed");
    };

    return {
      popup,
      closeConfirmPopup,
      openConfirmPopup,
      setLoadingStatus,
      loading,
      confirm,
    };
  },
};
</script>

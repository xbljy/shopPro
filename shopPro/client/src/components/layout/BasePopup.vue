<template>
  <div class="popup" v-show="popupWindow">
    <div class="close__popup--btn fade_in_top" @click="closePopup">
      <span></span>
      <span></span>
    </div>

    <div class="popup__content" @click.self="closePopup()">
      <slot name="content"></slot>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, onDeactivated, onActivated } from "vue";
export default {
  emits: ["popup-openned", "popup-closed"],
  setup(_, { emit }) {
    const popupWindow = ref(false);

    const closePopup = () => {
      emit("popup-closed");
      popupWindow.value = false;
    };

    const openPopup = () => {
      emit("popup-openned");
      popupWindow.value = true;
    };

    const closePopupOnESC = (e) => {
      if (e.keyCode == 27) {
        closePopup();
      }
    };

    onMounted(() => {
      window.addEventListener("keydown", closePopupOnESC);
    });

    onActivated(() => {
      window.addEventListener("keydown", closePopupOnESC);
    });

    onUnmounted(() => {
      window.removeEventListener("keydown", closePopupOnESC);
    });

    onDeactivated(() => {
      window.removeEventListener("keydown", closePopupOnESC);
    });

    return {
      popupWindow,
      closePopup,
      openPopup,
    };
  },
};
</script>

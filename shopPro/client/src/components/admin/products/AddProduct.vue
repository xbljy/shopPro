<template>
  <base-popup ref="popup" @popup-closed="resetPopup">
    <template #content>
      <stage-one
        ref="stageOne"
        @data-sent="goToNextStage($event)"
        v-show="selectedStage == 'one'"
        @form-closed="closePopup"
        :type="'create'"
      >
      </stage-one>
      <stage-two
        ref="stageTwo"
        v-show="selectedStage == 'two'"
        @form-closed="closePopup"
        @property-added="addProperty($event)"
        :type="'create'"
      ></stage-two>
    </template>
  </base-popup>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

import StageOne from "./ProductFormOne.vue";
import StageTwo from "./ProductFormTwo.vue";

export default {
  components: { StageOne, StageTwo },
  setup() {
    const store = useStore();

    const popup = ref(null);
    const popupStatus = ref(false);

    const closePopup = () => {
      selectedStage.value = "one";
      popupStatus.value = false;

      popup.value.closePopup();
    };

    const openPopup = () => {
      popupStatus.value = true;

      popup.value.openPopup();
    };

    const resetPopup = () => {
      popupStatus.value = false;
      selectedStage.value = "one";
    };

    const stageOne = ref(null);
    const stageTwo = ref(null);

    const selectedStage = ref("one");

    const productId = ref(undefined);
    const goToNextStage = async (data) => {
      try {
        stageOne.value.form.setLoadingStatus(true);
        productId.value = await store.dispatch("products/createProduct", {
          ...data,
        });

        stageOne.value.form.setLoadingStatus(false);

        stageOne.value.resetForm();

        selectedStage.value = "two";

        stageTwo.value.defineCurrentProduct(
          store.getters["products/getOneProduct"](productId.value)
        );
      } catch (err) {
        return;
      }
    };

    // 添加颜色
    const addProperty = async (data) => {
      stageTwo.value.form.setLoadingStatus(true);

      await store.dispatch("products/addPropertyToProduct", {
        id: productId.value,
        property: data,
      });

      stageTwo.value.form.setLoadingStatus(false);
    };

    return {
      popup,
      closePopup,
      openPopup,

      stageOne,
      stageTwo,
      selectedStage,
      addProperty,
      goToNextStage,
      resetPopup,
    };
  },
};
</script>

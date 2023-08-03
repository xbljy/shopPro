<template>
  <base-popup ref="popup" @popup-closed="resetPopup">
    <template #content>
      <stage-one
        ref="stageOne"
        @data-sent="submitData($event)"
        v-if="selectedStage === 'one'"
        @form-closed="closePopup"
        @add-property="openStageTwo"
        :type="'edit'"
      >
      </stage-one>
      <stage-two
        ref="stageTwo"
        v-show="selectedStage == 'two'"
        @form-closed="closePopup"
        @property-added="addProperty($event)"
        :type="'add'"
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
      popupStatus.value = false;
      selectedStage.value = "one";

      popup.value.closePopup();
    };

    let curProduct;
    const openPopup = (id) => {
      selectedStage.value = "one";
      popupStatus.value = true;
      if (id) {
        productId.value = id;
        curProduct = store.getters["products/getOneProduct"](id);
        stageOne.value.setInitialData(curProduct);
      }
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
    const submitData = async (data) => {
      stageOne.value.form.setLoadingStatus(true);
      await store.dispatch("products/editProduct", {
        productId: productId.value,
        updatedProductData: data,
      });

      stageOne.value.form.setLoadingStatus(false);
    };

    const openStageTwo = () => {
      selectedStage.value = "two";
      stageTwo.value.defineCurrentProduct(curProduct);
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
      submitData,
      resetPopup,

      openStageTwo,
    };
  },
};
</script>

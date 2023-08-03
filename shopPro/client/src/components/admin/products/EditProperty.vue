<template>
  <base-popup ref="popup" @popup-closed="resetPopup">
    <template #content>
      <property-form
        v-show="popupStatus"
        ref="form"
        @form-closed="closePopup"
        @property-added="updateProperty($event)"
        :type="'update'"
      >
        <template #btns>
          <base-button
            type="button"
            class="btn-small btn-red"
            :innerText="'删除'"
            :loading="propertyIsBeingDeleted"
            :disabled="propertyIsBeingDeleted"
            @click="deleteProperty"
          >
          </base-button>
        </template>
      </property-form>
    </template>
  </base-popup>
</template>

<script>
import { ref } from "vue";
import { useStore } from "vuex";

import PropertyForm from "./ProductFormTwo.vue";

export default {
  components: { PropertyForm },
  setup() {
    const store = useStore();

    const selectedProperty = ref(null);
    const product = ref(null);

    const setProduct = (id) => {
      product.value = id;
    };

    const setSelectedProperty = (property) => {
      selectedProperty.value = property;
    };

    const popup = ref(null);
    const popupStatus = ref(false);

    const closePopup = () => {
      popupStatus.value = false;
      popup.value.closePopup();
    };
    const form = ref(null);
    const openPopup = (product) => {
      popupStatus.value = true;
      popup.value.openPopup();
      form.value.defineCurrentProduct(product);
      form.value.setInitialData(selectedProperty.value);
    };

    const resetPopup = () => {
      popupStatus.value = false;
    };

    // 更新颜色
    const updateProperty = async (data) => {
      form.value.form.setLoadingStatus(true);
      for (const prop in data) {
        if (!data[prop] && data[prop] !== 0) delete data[prop];
      }
      await store.dispatch("products/updatePropertyOfProduct", {
        id: product.value.id,
        property: data,
      });

      form.value.form.setLoadingStatus(false);
    };

    //删除颜色
    const propertyIsBeingDeleted = ref(false);
    const deleteProperty = async () => {
      if (propertyIsBeingDeleted.value) return;
      propertyIsBeingDeleted.value = true;
      await store.dispatch("products/deletePropertyOfProduct", {
        id: product.value.id,
        propertyName: selectedProperty.value.propertyName,
      });

      propertyIsBeingDeleted.value = false;
    };

    return {
      popup,
      closePopup,
      openPopup,

      form,
      updateProperty,
      resetPopup,
      selectedProperty,
      product,
      deleteProperty,
      propertyIsBeingDeleted,

      setSelectedProperty,
      setProduct,

      popupStatus,
    };
  },
};
</script>

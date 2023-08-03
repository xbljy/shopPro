<template>
  <base-form
    class="form__style--2 add__item--form custom--form"
    ref="form"
    @form-submitted="
      v$.$touch;
      submitPropertyToProduct();
    "
  >
    <template #content>
      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label">颜色名称</label>
        <input
          type="text"
          class="form__style--2__input add__item--input"
          placeholder="请输入颜色名称"
          v-model="newProperty.propertyName"
          @blur="v$.propertyName.$touch"
          required
        />

        <span class="error__message" v-if="v$.propertyName.$error">
          {{ v$.propertyName.$errors[0].$message }}
        </span>
      </div>

      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label">价格</label>
        <input
          type="number"
          min="0"
          class="form__style--2__input add__item--input"
          placeholder="请输入商品价格"
          name="price"
          v-model="newProperty.price"
          @blur="v$.price.$touch"
        />

        <span class="error__message" v-if="v$.price.$error">
          {{ v$.price.$errors[0].$message }}
        </span>
      </div>

      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label">折扣</label>
        <input
          type="number"
          min="0"
          max="100"
          class="form__style--2__input add__item--input"
          placeholder="请输入折扣"
          name="discount"
          v-model="newProperty.priceDiscount"
          @blur="v$.priceDiscount.$touch"
        />

        <span class="percentage">%</span>

        <span class="error__message" v-if="v$.priceDiscount.$error">
          {{ v$.priceDiscount.$errors[0].$message }}
        </span>
      </div>

      <div
        class="form__style--2__group"
        v-if="
          currentProductData &&
          ['accessories', 'bags'].includes(currentProductData.category)
        "
      >
        <label class="form__style--2__label add__item--label">数量</label>
        <input
          type="number"
          min="0"
          class="form__style--2__input add__item--input"
          placeholder="请输入商品数量"
          name="quantity"
          v-model="newProperty.quantity"
          @blur="v$.quantity.$touch"
        />

        <span class="error__message" v-if="v$.quantity.$error">
          {{ v$.quantity.$errors[0].$message }}
        </span>
      </div>

      <div
        class="form__style--2__group"
        v-show="collectionSizes && collectionSizes.length > 0"
      >
        <label class="form__style--2__label add__item--label">规格</label>
        <select-sizes
          ref="selectSizesApp"
          :collectionSizes="collectionSizes"
          :initialData="initialSelectedSizes"
          :type="type"
        ></select-sizes>
        <input type="button" class="btn btn--square" value="添加规格" @click="addSizes" />
      </div>

      <div class="form__style--2__group">
        <span>图片</span>
        <label
          :for="type + 'photos'"
          class="photo__label add__item--photo_label"
        >
          选择图片
        </label>

        <input
          ref="newPropertyImages"
          :id="type + 'photos'"
          type="file"
          class="form__style--2__input"
          multiple
          @change="uploadImages"
        />

        <span
          class="error__message"
          v-if="v$.images.$error && newProperty.images.length == 0"
        >
          {{ v$.images.$errors[0].$message }}
        </span>
      </div>
    </template>

    <template #controllers="{ loading }">
      <div class="form__group">
        <slot name="btns"></slot>
        <base-button
          type="submit"
          class="btn-small btn-blue"
          style="margin-left: auto"
          :innerText="type == 'create' || type == 'add' ? '新增' : '保存'"
          :loading="loading"
          :disabled="loading"
        >
        </base-button>
      </div>
    </template>
  </base-form>
</template>

<script>
import { ref, reactive, computed } from "vue";

import { useStore } from "vuex";
import selectSizes from "./SelectSizes.vue";

import { requiredIf, minValue, integer, required } from "validators";
import { useVuelidate } from "@vuelidate/core";
import BaseButton from '../../layout/BaseButton.vue';

export default {
  emits: ["property-added"],
  components: {
    selectSizes,
    BaseButton,
  },
  props: ["type"],
  setup(props, { emit }) {
    const store = useStore();
    const newProperty = reactive({
      propertyName: "",
      sizes: [],
      quantity: "",
      images: [],
      price: 0,
      priceDiscount: 0,
    });

    let sizeIndex = 1;
    const initialSelectedSizes = ref([]);
    const setInitialData = (data) => {
      for (const prop in data) {
        if (prop === "priceDiscount") {
          newProperty.priceDiscount = data["priceDiscount"] * 100;
        } else if (prop !== "images") {
          newProperty[prop] = data[prop];
        }
      }

      initialSelectedSizes.value = data.sizes;
      sizeIndex = data.sizes.length + 1;
    };

    const currentProductData = ref(null);

    const defineCurrentProduct = (curProduct) => {
      currentProductData.value = curProduct;
    };

    const collectionSizes = computed(() => {
      if (!currentProductData.value || !currentProductData.value.category)
        return [];
      else if (["配饰", "包包"].includes(currentProductData.value.category))
        return [];
      return store.getters["products/getSizes"](
        currentProductData.value.category,
        [currentProductData.value.type]
      );
    });

    const selectSizesApp = ref(null);

    const newPropertyImages = ref(null);
    const submitPropertyToProduct = () => {
      // 获取选择的颜色
      if (selectSizesApp.value)
        newProperty["sizes"] = selectSizesApp.value.getSelectedSizes();

      v$.value.$touch();
      if (v$.value.$invalid) return;

      let data = { ...newProperty };
      data.priceDiscount = data.priceDiscount / 100;
      // 触发颜色选择事件
      emit("property-added", data);

      if (props.type == "add" || props.type == "create") resetForm();
    };

    const uploadImages = () => {
      newProperty.images = newPropertyImages.value.files;
    };

    const resetForm = () => {
      newProperty.propertyName = "";
      newProperty.quantity = "";
      newProperty.price = 0;
      newProperty.priceDiscount = 0;

      if (selectSizesApp.value) selectSizesApp.value.resetSelection();
    };

    const form = ref(null);

    // ========================== 数据验证 ================================
    const isQuantityReq = () => {
      return ["配饰", "包包"].includes(currentProductData.value.category);
    };

    const isImagesReq = () => {
      return props.type !== "update";
    };

    const rules = {
      propertyName: {
        required,
      },
      quantity: {
        requiredIfFuction: requiredIf(isQuantityReq),
      },
      images: {
        requiredIfFunction: requiredIf(isImagesReq),
      },
      price: {
        required,
        minValueValue: minValue(0),
        integer,
      },
      priceDiscount: {
        minValueValue: minValue(0),
        integer,
      },
    };
    const v$ = useVuelidate(rules, newProperty, { $lazy: true });

    const addSizes = () => {
      sizeIndex++;
      initialSelectedSizes.value.push({key: sizeIndex, value: ""});
    }

    return {
      v$,
      defineCurrentProduct,

      form,
      submitPropertyToProduct,
      newProperty,
      newPropertyImages,
      uploadImages,
      selectSizesApp,
      resetForm,
      collectionSizes,
      addSizes,

      initialSelectedSizes,
      setInitialData,
      currentProductData,
    };
  },
};
</script>

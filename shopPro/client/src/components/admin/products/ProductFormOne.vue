<template>
  <base-form
    class="form__style--2 add__item--form custom--form"
    @form-closed="closeForm"
    @form-submitted="goToNextStage($event)"
    ref="form"
  >
    <template #content>
      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label">名称</label>
        <input
          type="text"
          class="form__style--2__input add__item--input"
          placeholder="请输入商品名称"
          name="name"
          v-model="productData.name"
          @blur="v$.name.$touch"
        />
        <span class="error__message" v-if="v$.name.$error">
          {{ v$.name.$errors[0].$message }}
        </span>
      </div>

      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label">类目</label>
        <SelectBox
          class="form__style--2__selectbox"
          @value-updated="updateFormData('category', $event)"
          ref="categorySelectBox"
          :values="categoryValues"
          :selected="productData.category"
          :error="[validateRequired('category'), '请选择一个类目']"
        ></SelectBox>
      </div>

      <div class="form__style--2__group" v-if="typesValues.length > 0">
        <label class="form__style--2__label add__item--label">分类</label>
        <SelectBox
          class="form__style--2__selectbox"
          @value-updated="updateFormData('type', $event)"
          ref="typesSelectBox"
          :values="typesValues"
          :selected="productData.type"
          :error="[validateRequired('type'), '请选择一个类型']"
        ></SelectBox>
      </div>

      <div
        class="form__style--2__group"
        v-if="requiredInputs.includes('gender')"
      >
        <label class="form__style--2__label add__item--label">性别</label>
        <SelectBox
          class="form__style--2__selectbox"
          @value-updated="updateFormData('gender', $event)"
          ref="genderSelectBox"
          :values="['男', '女', '其他']"
          :selected="productData.gender"
          :error="[validateRequired('gender'), '请选择性别']"
        ></SelectBox>
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
          v-model="productData.global_discount"
        />

        <span class="percentage">%</span>
      </div>

      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label">详情</label>
        <textarea
          type="text"
          class="form__style--2__textarea add__item--textarea"
          placeholder="请输入商品详情"
          name="description"
          v-model="productData.description"
          @blur="v$.description.$touch"
        ></textarea>

        <span class="error__message" v-if="v$.description.$error">
          {{ v$.description.$errors[0].$message }}
        </span>
      </div>

      <div class="form__style--2__group" v-if="tags && tags.length > 0">
        <label class="form__style--2__label add__item--label"> 标签 </label>

        <switch-app
          :behavior="'multible'"
          ref="tagsApp"
          :tags="tags"
          size="m"
          @selection-updated="updateTags($event)"
          class="form__style--2__shortcuts"
        >
        </switch-app>
      </div>

      <div class="form__style--2__group">
        <label class="form__style--2__label add__item--label"> 季节 </label>

        <switch-app
          :behavior="'multible'"
          ref="seasonsApp"
          :tags="seasonTags"
          size="m"
          @selection-updated="updateSeasons($event)"
          class="form__style--2__shortcuts"
        >
        </switch-app>
      </div>

      <slot name="content"></slot>
    </template>

    <template #controllers="{ loading }">
      <div class="form__group">
        <button type="button" class="btn btn-small btn-red" @click="closeForm">
          取消
        </button>

        <base-button
          v-if="type == 'edit'"
          type="button"
          class="btn-small btn-dark"
          :innerText="'添加颜色'"
          @click="openAddPropertyForm()"
        >
        </base-button>

        <base-button
          type="submit"
          class="btn-small btn-blue"
          :innerText="type == 'create' ? '下一步' : '保存'"
          :loading="loading"
          :disabled="
            loading || v$.$errors.length > 0 || !validateCustomElementsInputs
          "
        >
        </base-button>
      </div>
    </template>

    <slot name="content"></slot>
  </base-form>
</template>

<script>
import { ref, computed, reactive } from "vue";
import { useStore } from "vuex";

import { required } from "validators";
import { useVuelidate } from "@vuelidate/core";

export default {
  emits: ["form-openned", "data-sent", "add-property"],
  components: {},
  props: ["type"],
  setup(_, { emit }) {
    const store = useStore();

    const form = ref(null);

    const productData = reactive({
      name: "",
      description: "",
      category: "",
      type: "",
      gender: "",
      global_discount: 0,
      tags: [],
      collection_season: []
    });

    const tags = computed(() =>
      productData.category !== ""
        ? store.getters["products/getTags"](productData.category)
        : []
    );

    const categoryValues = store.getters["products/getCategory"];

    const tagsApp = ref(null);
    const seasonsApp = ref(null);

    // const seasonTags = [{key: "spring", value: "春季"}, {key: "summer", value: "夏季"}, {key: "autumn", value: "秋季"}, {key: "winter", value: "冬季"}]
    const seasonTags = ["春季", "夏季", "秋季", "冬季"];

    const updateTags = (value) => {
      productData["tags"] = value;
      tagsApp.value.updateSelectedItems(value);
    };

    const updateSeasons = (value) => {
      productData["collection_season"] = value;
      seasonsApp.value.updateSelectedItems(value);
    };

    const setInitialData = (initialData) => {
      for (const prop in productData) {
        if (initialData[prop]) productData[prop] = initialData[prop];
        if (prop == "global_discount")
          productData["global_discount"] = initialData["global_discount"] * 100;

        if (prop == "tags" && tagsApp.value) updateTags(initialData["tags"]);
        if (prop == "collection_season" && seasonsApp.value)
          updateSeasons(initialData["collection_season"]);
      }
    };

    const resetForm = () => {
      for (let prop in productData) {
        if (typeof productData[prop] === "string") {
          productData[prop] = "";
        } else if (typeof productData[prop] === "number") {
          productData[prop] = 0;
        } else if (Array.isArray(productData[prop])) {
          productData[prop] = [];
        } else {
          productData[prop] = {};
        }

        if (seasonsApp.value && prop == "collection_season") updateSeasons([]);
      }
    };

    const typesSelectBox = ref(null);
    const genderSelectBox = ref(null);

    const updateFormData = (prop, value) => {
      if (prop == "category" && value !== productData.category) {
        if (typesSelectBox.value) typesSelectBox.value.updateValue("");
        if (genderSelectBox.value) genderSelectBox.value.updateValue("");
        if (tagsApp.value) tagsApp.value.updateSelectedItems([]);
      }

      productData[prop] = value;
    };

    const requiredInputs = computed(() => {
      if (["鞋子", "配饰", "包包"].includes(productData.category))
        return ["性别", "类目", "分类"];
      else return ["类目", "分类"];
    });

    const validateCustomElementsInputs = computed(() => {
      for (const prop of requiredInputs.value) {
        if (productData[prop] == "") {
          return false;
        }
      }
      return true;
    });

    const goToNextStage = ({ name, description }) => {
      if (name) productData["name"] = name;
      if (description) productData["description"] = description;
      if (!validateCustomElementsInputs.value || v$.value.$errors.length > 0)
        return;

      let data = { ...productData };

      data["global_discount"] /= 100;
      emit("data-sent", data);
    };

    const typesValues = computed(() => {
      if (productData.category !== "")
        return store.getters["products/getTypes"](productData.category);
      else return [];
    });

    const closeForm = () => {
      emit("form-closed");
    };

    const openForm = () => {
      emit("form-openned");
    };

    const openAddPropertyForm = () => {
      emit("add-property");
    };
    // ========================== 验证规则 ================================
    const rules = {
      name: {
        required
      },
      description: {
        required
      }
    };
    const v$ = useVuelidate(rules, productData, { $lazy: true });

    // ========================== 验证输入信息 ================
    const validateRequired = computed(() => (prop) => !productData[prop]);

    return {
      v$,
      validateCustomElementsInputs,
      validateRequired,
      requiredInputs,
      productData,
      goToNextStage,
      updateFormData,
      typesValues,
      typesSelectBox,
      genderSelectBox,
      form,
      closeForm,
      openForm,

      setInitialData,
      tags,
      tagsApp,
      seasonsApp,
      updateSeasons,
      updateTags,
      categoryValues,
      seasonTags,

      resetForm,
      openAddPropertyForm
    };
  }
};
</script>

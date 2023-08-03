<template>
  <form @submit="submitForm($event)">
    <slot name="content" :initialData="initialData"></slot>

    <slot name="controllers" :loading="loading">
      <div class="form__group">
        <button type="button" class="btn btn-small btn-red" @click="closeForm">
          关闭
        </button>
        <base-button
          type="submit"
          class="btn-small btn-blue"
          :innerText="type == 'edit' ? '修改' : '创建'"
          :loading="loading"
          :disabled="loading"
        >
        </base-button>
      </div>
    </slot>

    <slot name="formFooter"></slot>
  </form>
</template>

<script>
import { ref, reactive } from "vue";

export default {
  emits: ["form-submitted", "form-closed"],
  components: {},
  props: ["type", "initialData"],
  setup(props, { emit }) {
    const data = reactive({});

    const validateElement = (element) => {
      // 确认元素存在
      return (
        element &&
        element.tagName &&
        ["input", "textarea"].includes(element.tagName.toLowerCase())
      );
    };

    const filterUnchagedData = (data) => {
      if (!props.initialData) return data;
      for (const prop in data) {
        if (data[prop] == props.initialData[prop]) delete data[prop];
      }

      return data;
    };

    const submitForm = async (e) => {
      if (loading.value) return;
      e.preventDefault();
      for (const key in e.target.elements) {
        if (isNaN(key * 1)) break;
        if (!validateElement(e.target[key])) continue;

        if (e.target[key].files && e.target[key].files.length > 0)
          data[e.target[key].name] = Array.from(e.target[key].files);
        else if (e.target[key].value !== "")
          data[e.target[key].name] = e.target[key].value;
      }

      emit("form-submitted", filterUnchagedData(data));
    };

    const closeForm = () => {
      emit("form-closed");
    };

    const loading = ref(false);
    const setLoadingStatus = (value) => {
      if (typeof value !== "boolean") return;
      loading.value = value;
    };

    return {
      data,
      submitForm,
      closeForm,
      loading,
      setLoadingStatus,
    };
  },
};
</script>

<template>
  <div>
    <div
      class="select__box"
      @click="toggle()"
      :class="{ 'select__box--2': style == 'style2' }"
      ref="selectbox"
    >
      <div class="select__box__value">
        <span>{{ selectionValue || "请选择" }}</span>
        <svg class="select__box__arrow">
          <use xlink:href="@/assets/images/sprite.svg#icon-chevron-right"></use>
        </svg>
      </div>

      <transition name="slide" mode="in-out">
        <ul class="select__box__options" v-if="visible">
          <li
            class="select__box__option"
            v-for="value in values"
            :key="value"
            @click="updateValue(value)"
          >
            {{ value }}
          </li>
        </ul>
      </transition>
    </div>

    <span class="error__message" v-if="error && error[0]">
      {{ error[1] }}
    </span>
  </div>
</template>
<script>
import { ref, watch } from "vue";

export default {
  props: ["values", "style", "selected", "error", "disableSelection"],
  emits: ["value-updated"],
  setup(props, { emit }) {
    const visible = ref(false);

    // 切换菜单
    const toggle = () => {
      window.addEventListener("click", (e) => {
        if (!selectbox.value) return;
        if (!selectbox.value.contains(e.target) && visible.value) {
          close();
          return;
        }
      });

      visible.value = !visible.value;
    };

    const close = () => {
      visible.value = false;
    };

    const open = () => {
      visible.value = true;
    };

    const selectionValue = ref(props.selected);

    watch(
      () => props.selected,
      (newValue) => {
        selectionValue.value = newValue;
      }
    );

    // 修改选择
    const updateValue = (value) => {
      if (selectionValue.value == value || props.disableSelection) return;

      selectionValue.value = value;
      emit("value-updated", value);
    };

    // 重置选择
    const resetSelection = () => {
      selectionValue.value = "";
    };

    const selectbox = ref(null);

    return {
      visible,
      updateValue,
      selectionValue,
      toggle,
      close,
      open,
      resetSelection,
      selectbox,
    };
  },
};
</script>

<template>
  <div class="price__range">
    <div class="price__range--val">
      <span>¥{{ value[0] }}</span>
      <span>¥{{ value[1] }}</span>
    </div>
    <vue-slider
      v-model="value"
      :min="sliderSettings.min"
      :max="sliderSettings.max"
      :enable-cross="false"
      tooltip="none"
      :process-style="{ backgroundColor: '#C5E5FF' }"
    >
      <template v-slot:dot="{ focus }">
        <div :class="['custom-dot', { focus }]"></div>
      </template>
    </vue-slider>
  </div>
</template>

<script>
import { ref, watch } from "vue";

export default {
  emits: ["value-updated"],
  props: ["initialValue"],
  setup(props, { emit }) {
    // slider设置
    const sliderSettings = {
      min: 0,
      max: 1000,
    };

    const value = ref(props.initialValue || [0, 1000]);
    // 监听滑块值的变化
    watch(value, (val) => {
      emit("value-updated", val);
    });

    const resetValue = () => {
      value.value = [0, 1000];
    };

    return {
      sliderSettings,
      value,
      resetValue,
    };
  },
};
</script>

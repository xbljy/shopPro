<template>
  <button
    type="button"
    ref="button"
    class="btn"
    :class="{
      btn__loading: loading,
      btn__active: active,
    }"
  >
    <slot name="content" :text="text" v-if="!loading">
      {{ innerText }}
    </slot>

    <slot v-if="loading" name="loading">
      <div
        class="loading__content loading__content--small"
        v-if="loadingType == 'inline'"
      >
        <div class="lds-dual-ring"></div>
      </div>
      <div class="loading__content" v-else>
        <div class="lds-ellipsis">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </slot>
  </button>
</template>

<script>
import { ref } from "vue";
export default {
  props: ["innerText", "loading", "active", "loadingType"],
  setup(props) {
    const button = ref(null);
    const text = ref(props.innerText);

    return {
      text,
      button,
    };
  },
};
</script>

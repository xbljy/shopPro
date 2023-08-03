<template>
  <div class="category">
    <h3 class="heading--h3 fade_in_left">{{ title }}</h3>
    <img
      :src="colorImage"
      alt=""
      class="category__bubble bounace_rotate"
      :class="'category__bubble--' + color"
    />
    <img
      :src="objImage"
      alt=""
      class="category__image fade_in_bottom"
    />
  </div>
</template>

<script>
import { computed } from "vue";
export default {
  props: ["title", "color", "image"],
  setup(props) {
    const colorImage = require('../../../assets/images/categories/bubble-' + props.color + '.png').default;
    const objImage = require('@/assets/images/categories/' + props.image + '.png').default;
    return {
      colorImage,
      objImage
    }
  }
};
</script>

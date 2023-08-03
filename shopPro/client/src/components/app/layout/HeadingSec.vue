<template>
  <div class="heading">
    <div class="heading__text">
      <slot name="title"></slot>
    </div>
    <img src="@/assets/images/wave.png" alt="" class="heading__wave" />
  </div>
</template>

<script>
export default {
  props: ["title"],
};
</script>

<template>
  <div>
    <template v-if="type == 'table'">
      <tr :class="classes" v-for="item in items" :key="item.id">
        <slot name="item" :item="item"></slot>
      </tr>
      <tr :class="classes.concat('target--div')" v-if="!reachedMax">
        <div ref="target"></div>
      </tr>

      <tr :class="classes" v-show="loading">
        <content-loader></content-loader>
      </tr>

      <div
        v-show="loaded && Object.keys(items).length == 0"
        class="uppercase"
        style="text-align: center; padding: 2rem"
      >
        没有更多了～
      </div>
    </template>
    <div v-else>
      <div :class="classes">
        <template v-for="item in items">
          <slot name="item" :item="item"></slot>
        </template>
      </div>
      <div ref="target" class="target" v-if="!reachedMax"></div>

      <content-loader v-show="loading"></content-loader>
      <empty-content
        v-show="loaded && Object.keys(items).length == 0"
      ></empty-content>
    </div>
  </div>
</template>
<script>
import { ref, onMounted, onUnmounted, onDeactivated, onActivated } from "vue";
export default {
  props: ["items", "reachedMax", "type", "classes", "loading", "loaded"],
  emits: ["ReachedBottom"],
  setup(props, { emit }) {
    const target = ref(null);
    onMounted(() => window.addEventListener("scroll", handleScroll));
    onActivated(() => window.addEventListener("scroll", handleScroll));
    onUnmounted(() => window.removeEventListener("scroll", handleScroll));
    onDeactivated(() => window.removeEventListener("scroll", handleScroll));

    const handleScroll = () => {
      if (
        props.reachedMax ||
        (props.loaded && Object.keys(props.items).length == 0)
      )
        return;

      let element = target.value;
      if (element.getBoundingClientRect().bottom <= window.innerHeight) {
        emit("ReachedBottom", Object.keys(props.items).length);
      }
    };

    return {
      target,
    };
  },
};
</script>

<style scoped>
.target {
  grid-column: 1 / -1;
  height: 0;
}
</style>

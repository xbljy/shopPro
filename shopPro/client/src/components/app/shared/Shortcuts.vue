<template>
  <ul class="product__property--list shortcut--list non__click">
    <li
      class="non__click"
      v-for="tag in tags"
      :key="tag"
      :class="{
        ...activeClasses,
        active: isSelectedItem(tag.key),
      }"
      :style="{ 'background-color': type == 'color' ? tag : false }"
      @click="selectItem(tag.key || tag)"
    >
      {{ type !== "color" ? (tag.value ? tag.value: tag) : "" }}
    </li>
  </ul>
</template>
<script>
import { ref, computed } from "vue";

export default {
  props: ["tags", "size", "behavior", "type", "initialValue"],
  emits: ["selection-updated"],
  setup(props, { emit }) {
    const selectedItems = ref(props.initialValue ?? []);

    const updateSelectedItems = (value) => {
      // 此方法用来修改父组件中的选中项
      // 用refs在父组件中的子组件中使用此方法
      selectedItems.value = value;
    };

    const selectItem = (itemName) => {
      const selectedItemIndex = selectedItems.value.findIndex(
        (item) => item == itemName
      );

      if (selectedItemIndex == -1) {
        if (props.behavior == "multible") {
          selectedItems.value.push(itemName);
        } else if (props.behavior == "single") {
          selectedItems.value[0] = itemName;
        }
      } else if (selectedItemIndex !== -1 && props.behavior == "multible") {
        selectedItems.value.splice(selectedItemIndex, 1);
      }
      emit("selection-updated", selectedItems.value);
    };

    const isSelectedItem = computed(() => (itemName) => {
      return selectedItems.value.includes(itemName);
    });

    // 根据使用情况设置样式
    let activeClasses;

    (() => {
      // 如果是彩色托盘，我们将根据标签名称更改背景颜色
      if (props.type == "color") {
        activeClasses = {
          "product__property--item": true,
          "u-margin-right-tiny": true,
        };
      } else {
        // 否则创建默认样式
        activeClasses = {
          "shortcut--item": true,
          "shortcut--item-s": props.size == "s",
          "shortcut--item-m": props.size == "m",
        };
      }
    })();

    return {
      selectItem,
      selectedItems,
      isSelectedItem,
      updateSelectedItems,
      activeClasses,
    };
  },
};
</script>

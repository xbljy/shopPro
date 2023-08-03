<template>
  <ul class="sizes_selectors__list">
    <li class="sizes_selectors__item" v-for="(item, index) in sizes" :key="index">
      <input
        type="text"
        class="sizes_selectors__size"
        v-model="sizes[index].size"
        required
      />
      <input
        title="选择当前颜色商品的数量"
        class="sizes_selectors__quantity"
        type="number"
        v-model="sizes[index].quantity"
        min="1"
        required
      />
    </li>
  </ul>
</template>

<script>
import { onUpdated, reactive, watchEffect } from "vue";

export default {
  props: ["collectionSizes", "initialData", "type"],
  setup(props) {
    const sizes = reactive({});

    const addToSizesList = (size) => {
      sizes[size.key] = { size: size.value, quantity: 0, selected: true };
    };

    const resetSizes = () => {
      for (const key in sizes) {
        delete sizes[key];
      }
    };

    watchEffect(() => {
      resetSizes();
      if (props.initialData.length > 0) {
        props.initialData.forEach(size => addToSizesList(size))
      }
    });

    onUpdated(() => {
      console.log("组件更新")
    })

    const getSelectedSizes = () => {
      const res = [];
      for (const item in sizes) {
        if (sizes[item].selected) {
          res.push(sizes[item]);
        }
      }

      return res;
    };

    const setInitialSelectedSizes = (data) => {
      data.forEach((size) => {
        sizes[size.size].quantity = size.quantity;
        sizes[size.size].selected = true;
      });
    };

    const toggleSelection = (size) => {
      sizes[size].selected = !sizes[size].selected;
    };

    const resetSelection = () => {
      for (const size in sizes) {
        sizes[size].quantity = 0;
        sizes[size].selected = false;
      }
    };

    resetSelection();

    return {
      sizes,
      getSelectedSizes,
      toggleSelection,
      resetSelection,
      setInitialSelectedSizes,
    };
  },
};
</script>

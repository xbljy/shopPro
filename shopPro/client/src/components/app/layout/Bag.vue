<template>
  <base-menu v-if="bag">
    <template #title>购物袋</template>
    <template #content>
      <template v-for="card in bagData">
        <Card
          :key="card.id"
          :card="card"
          :style="'wide'"
          v-if="card.product.properties.length > 0"
        ></Card>
      </template>
    </template>

    <template #controls>
      <base-button class="btn-small btn-dark" @click="$emit('close-bag')">
        <template #content> 关闭 </template>
      </base-button>
      <base-button
        class="btn-small btn-red menu__btn-del"
        :innerText="'全部删除'"
        :loading="itemsAreBeingRemoved"
        :disabled="itemsAreBeingRemoved"
        @click="deleteBag"
      >
      </base-button>

      <base-button
        class="btn-small btn-blue"
        @click="$router.push('/dashboard/bag')"
      >
        <template #content> 付款 </template>
      </base-button>
    </template>
  </base-menu>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import Card from "@/components/shared/Card.vue";
export default {
  components: { Card },
  props: ["bag"],
  setup() {
    const store = useStore();
    const bagData = computed(() => store.getters["bag/getMyBag"]);
    const itemsAreBeingRemoved = ref(false);
    const deleteBag = async () => {
      if (itemsAreBeingRemoved.value) return;
      itemsAreBeingRemoved.value = true;
      await store.dispatch("bag/deleteBag");
      itemsAreBeingRemoved.value = false;
    };

    return {
      bagData,
      deleteBag,
      itemsAreBeingRemoved,
    };
  },
};
</script>

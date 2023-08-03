<template>
  <base-menu v-if="wishlist">
    <template #title>喜欢列表</template>
    <template #content>
      <template v-for="product in wishlistData">
        <liked-product-card
          :key="product.id"
          :product="product"
          :style="'wide'"
          v-if="product.properties.length > 0"
        ></liked-product-card>
      </template>
    </template>

    <template #controls>
      <base-button class="btn-small btn-dark" @click="$emit('close-wishlist')">
        <template #content> 关闭 </template>
      </base-button>
      <base-button
        class="btn-small btn-red menu__btn-del"
        :innerText="'全部删除'"
        :loading="itemsAreBeingRemoved"
        :disabled="itemsAreBeingRemoved"
        @click="deleteWishlist"
      >
      </base-button>
    </template>
  </base-menu>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import LikedProductCard from "@/components/shared/LikedProduct.vue";
export default {
  components: { LikedProductCard },
  props: ["wishlist"],
  setup() {
    const store = useStore();
    const wishlistData = computed(
      () => store.getters["wishlist/getMyWishlist"]
    );

    const itemsAreBeingRemoved = ref(false);
    const deleteWishlist = async () => {
      if (itemsAreBeingRemoved.value) return;
      itemsAreBeingRemoved.value = true;
      await store.dispatch("wishlist/deleteWishlist");
      itemsAreBeingRemoved.value = false;
    };

    return {
      wishlistData,
      deleteWishlist,
      itemsAreBeingRemoved,
    };
  },
};
</script>

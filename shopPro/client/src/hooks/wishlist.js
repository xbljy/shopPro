/* eslint-disable */
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export function useWishlist() {
  const store = useStore();
  const router = useRouter();

  const isUserExists = computed(() => store.getters["auth/isUserExists"]);

  const isLiked = (id) => {
    return wishlist.value[id];
  };
  const productIsBeingToggledToWishlist = ref(false);
  const toggleWishlisted = async (product) => {
    if (!isUserExists.value) {
      return router.push("/login");
    }
    if (productIsBeingToggledToWishlist.value) return;
    productIsBeingToggledToWishlist.value = true;
    // 判断当前商品是否添加喜欢
    if (!isLiked(product.id)) {
      // 没有添加到喜欢就添加
      await store.dispatch("wishlist/addToWishList", product);
    } else {
      // 如果已经喜欢就移除
      await store.dispatch("wishlist/deleteWishitem", product.id);
    }
    productIsBeingToggledToWishlist.value = false;
  };

  const wishlist = computed(() => {
    // 获取当前用户喜欢列表
    return store.getters["wishlist/getMyWishlist"];
  });

  return {
    isLiked,
    toggleWishlisted,
    wishlist,
    productIsBeingToggledToWishlist,
  };
}

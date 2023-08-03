<template>
  <base-popup ref="popup">
    <template #content>
      <review-form
        :type="'add'"
        @data-provided="createReview($event)"
        @form-canceled="closeAddReviewPopup"
      ></review-form>
    </template>
  </base-popup>
</template>
<script>
import { ref } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";

import ReviewForm from "./ReviewForm.vue";

export default {
  components: { ReviewForm },
  setup() {
    const store = useStore();
    const route = useRoute();

    const popup = ref(null);

    const closeAddReviewPopup = () => {
      popup.value.closePopup();
    };

    const openAddReviewPopup = () => {
      popup.value.openPopup();
    };

    // 创建评论
    const createReview = async (reviewData) => {
      await store.dispatch("reviews/createReview", {
        data: reviewData,
        productId: route.params.id,
      });

      closeAddReviewPopup();
    };

    return {
      popup,
      closeAddReviewPopup,
      openAddReviewPopup,
      createReview,
    };
  },
};
</script>

<template>
  <div class="review">
    <img
      :src="require('@/assets/images/users/' + review.user.photo[0].small_image).default"
      alt="user image"
      class="review__img"
    />
    <h5 class="heading--h5">{{ review.user.name }}</h5>
    <ratings-app
      class="product__rating"
      :ratingsAverage="review.rating"
    ></ratings-app>

    <pre class="text">{{ review.description }}</pre>
  </div>
</template>

<script>
export default {
  props: ["review"],
  setup() {},
};
</script>

<template>
  <section class="home__products">
    <h2 class="heading--h2 heading--h2__style--3">
      <svg class="heading--h2__style--3__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-star-full"></use>
      </svg>
      可能喜欢
    </h2>
    <base-button
      class="btn-dark btn-small"
      :innerText="'浏览圈子'"
      @click="$router.push('/blog')"
    ></base-button>
    <Carousel
      class="u-margin-top-meduim"
      v-if="Object.keys(posts).length > 0"
      :settings="settings"
      :breakpoints="breakpoints"
    >
      <Slide class="auto_width" v-for="post in posts" :key="post.id">
        <post-card :post="post"></post-card>
      </Slide>
      <template #addons>
        <Navigation />
      </template>
    </Carousel>
  </section>
</template>

<script>
import PostCard from "./PostCardSmall.vue";
export default {
  components: {
    PostCard,
  },
  props: ["posts"],
  setup() {
    const settings = {
      transition: 200,
    };

    const breakpoints = {
      1275: {
        itemsToShow: 4,
        itemsToScroll: 4,
      },
      1000: {
        itemsToShow: 4,
        itemsToScroll: 3,
      },
      760: {
        itemsToShow: 3,
        itemsToScroll: 3,
      },

      660: {
        itemsToShow: 2.5,
        itemsToScroll: 2,
      },

      560: {
        itemsToShow: 1.7,
        itemsToScroll: 1,
      },

      500: {
        itemsToShow: 1.5,
        itemsToScroll: 1,
      },

      280: {
        itemsToShow: 1,
        itemsToScroll: 1,
      },
    };

    return {
      settings,
      breakpoints,
    };
  },
};
</script>

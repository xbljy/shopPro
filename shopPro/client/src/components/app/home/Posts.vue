<template>
  <section class="home__products">
    <h2 class="heading--h2">
      <svg class="heading--h2__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-image"></use>
      </svg>
      最新发布
    </h2>
    <base-button
      class="btn-dark btn-small"
      :innerText="'浏览文章'"
      @click="$router.push('/blog')"
    ></base-button>
    <Carousel
      class="u-margin-top-meduim"
      :settings="settings"
      :breakpoints="breakpoints"
      v-if="Object.keys(posts).length > 0"
    >
      <Slide class="auto_width" v-for="post in posts" :key="post.id">
        <post-card :post="post"></post-card>
      </Slide>
      <template #addons>
        <Navigation v-if="!emptyContent" />
      </template>
    </Carousel>
    <content-loader v-show="contentLoading"></content-loader>
    <empty-content
      v-show="emptyContent"
      class="empty-content--small"
    ></empty-content>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import PostCard from "@/components/app/blog/PostCardSmall.vue";
export default {
  components: {
    PostCard,
  },
  setup() {
    const store = useStore();

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

      500: {
        itemsToShow: 2,
        itemsToScroll: 2,
      },
      280: {
        itemsToShow: 1,
        itemsToScroll: 1,
      },
    };

    const posts = computed(() => store.getters["blog/getRecentPosts"]);
    const contentLoaded = ref(false);
    const contentLoading = ref(false);
    const loadData = async () => {
      if (contentLoaded.value || contentLoading.value) return;
      contentLoading.value = true;
      if (Object.keys(posts.value).length == 0)
        await store.dispatch("blog/fetchRecentPosts");
      contentLoading.value = false;
      contentLoaded.value = true;
    };

    loadData();

    const emptyContent = computed(
      () => contentLoaded.value && Object.keys(posts.value).length == 0
    );
    return {
      settings,
      posts,
      contentLoading,
      emptyContent,
      breakpoints,
    };
  },
};
</script>

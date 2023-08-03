<template>
  <div class="app__container">
    <teleport to="#taps"
      ><shortcuts-app
        class="taps"
        ref="taps"
        :behavior="'single'"
        :tags="navbarTaps"
        :initialValue="['all']"
      ></shortcuts-app
    ></teleport>
    <div v-if="itemsLoaded">
      <div class="blog">
        <main
          class="blog__pinned_post"
          v-if="Object.keys(pinnedPosts).length > 0"
        >
          <h2 class="heading--h2 heading--h2__style--3">
            <svg class="heading--h2__style--3__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-pen"></use>
            </svg>
            <span> 收藏文章 </span>
          </h2>

          <post
            :type="'style-2'"
            v-for="pinnedPost in pinnedPosts"
            :key="pinnedPost.id"
            :post="pinnedPost"
          ></post>
        </main>

        <section class="blog__posts">
          <h2 class="heading--h2 heading--h2__style--3">
            <svg class="heading--h2__style--3__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-fire"></use>
            </svg>
            <span> 最新发布 </span>
          </h2>
          <infinite-scroll
            :loaded="itemsLoaded"
            :loading="itemsLoading"
            :reachedMax="reachedMax"
            :items="posts"
            class="blog__posts--div"
            @reached-bottom="loadMorePosts($event)"
          >
            <template #item="{ item }">
              <post :type="'style-3'" :post="item"></post>
            </template>
          </infinite-scroll>
        </section>

        <side-bar></side-bar>
      </div>
    </div>
    <loader-app v-if="!itemsLoaded"></loader-app>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";

import SideBar from "@/components/app/blog/SideBar.vue";
import PostCard from "@/components/app/blog/PostCard";
export default {
  components: { post: PostCard, SideBar },
  setup() {
    const store = useStore();
    const navbarTaps = ["所有", "最近", "火爆", "健康"];

    const posts = computed(() => store.getters["blog/getAllPosts"]);
    const pinnedPosts = computed(() => store.getters["blog/getPinnedPosts"]);

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    (async () => {
      itemsLoading.value = true;
      itemsLoaded.value = false;
      if (posts.value && Object.keys(posts.value).length == 0)
        await store.dispatch("blog/fetchPosts");

      itemsLoading.value = false;
      itemsLoaded.value = true;
    })();

    const getNumberOfPosts = computed(
      () => store.getters["blog/getNumberOfPosts"]
    );

    const reachedMax = ref(false);
    const loadMorePosts = async (itemsLength) => {
      if (itemsLoading.value) return;

      console.log("req-sent");
      itemsLoading.value = true;
      await store.dispatch("blog/fetchMorePosts", {
        skip: itemsLength,
      });

      reachedMax.value = getNumberOfPosts.value == itemsLength;

      itemsLoading.value = false;
    };

    return {
      navbarTaps,
      posts,
      pinnedPosts,
      reachedMax,
      loadMorePosts,
      itemsLoaded,
      itemsLoading,
    };
  },
};
</script>

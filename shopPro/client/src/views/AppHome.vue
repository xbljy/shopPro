<template>
  <div class="app">
    <teleport to="#taps"
      ><shortcuts-app
        class="taps"
        :behavior="'single'"
        :tags="navbarTaps"
        :initialValue="['events']"
        @selection-updated="scrollTo($event)"
      ></shortcuts-app
    ></teleport>

    <div class="app__container">
      <div>
        <events-home
          ref="events"
          @data-loaded="loading = false"
          :loading="loading"
        ></events-home>
        <categories-home ref="categories" :loading="loading"></categories-home>
        <recommended-home ref="recommended" :loading="loading">
        </recommended-home>
        <trendy-home ref="trendy" :loading="loading"></trendy-home>
        <newly-added-home ref="recent" :loading="loading"></newly-added-home>
        <posts-home ref="blog" :loading="loading"></posts-home>
      </div>
      <loader-app v-if="loading"></loader-app>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
import EventsHome from "@/components/app/home/Events.vue";
import CategoriesHome from "@/components/app/home/Categories.vue";
import RecommendedHome from "@/components/app/home/Recommended.vue";
import NewlyAddedHome from "@/components/app/home/NewlyAdded.vue";
import TrendyHome from "@/components/app/home/Trendy.vue";
import PostsHome from "@/components/app/home/Posts.vue";
export default {
  components: {
    EventsHome,
    CategoriesHome,
    RecommendedHome,
    TrendyHome,
    NewlyAddedHome,
    PostsHome,
  },
  setup() {
    const navbarTaps = [{key: "events", value: "活动"}, {key: "categories", value: "类目"}, {key: "recommended", value: "推荐"}, {key: "trendy", value: "热卖"}, {key: "recent", value: "最近"}, {key: "blog", value: "圈子"}];

    const events = ref(null);
    const categories = ref(null);
    const recommended = ref(null);
    const trendy = ref(null);
    const recent = ref(null);
    const blog = ref(null);

    const domElements = {
      events,
      categories,
      recommended,
      trendy,
      recent,
      blog,
    };

    const scrollTo = (id) => {
      const windowScrollY = window.scrollY;
      const { top } = domElements[id[0]].value.$el.getBoundingClientRect();

      const topOffeset = window.innerWidth > 1100 ? 120 : 190;

      window.scroll({
        top: Math.abs(windowScrollY * 1 + top * 1 - topOffeset),
        left: 0,
        behavior: "smooth",
      });
    };

    const loading = ref(true);

    return {
      navbarTaps,
      scrollTo,
      events,
      categories,
      recommended,
      trendy,
      recent,
      blog,
      loading,
    };
  },
};
</script>

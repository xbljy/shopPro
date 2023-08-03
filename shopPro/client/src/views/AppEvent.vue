<template>
  <div class="app__container custom">
    <teleport to="#taps"
      ><shortcuts-app
        class="taps"
        ref="taps"
        :behavior="'single'"
        :tags="navbarTaps"
        :initialValue="['简介']"
        @selection-updated="scrollTo($event)"
      ></shortcuts-app
    ></teleport>
    <div v-if="loaded && event._id">
      <div>
        <header class="event_page__header" ref="overview">
          <h1 class="heading--h1 uppercase heading--h1__style--1-phone">
            {{ event.title }}
          </h1>

          <pre class="text">{{ event.summary }}</pre>

          <button
            type="button"
            class="btn btn--4"
            @click="scrollTo(['description'])"
          >
            查看活动
          </button>

          <div class="event_page__image--div">
            <img
              :src="genEventImageLarge(event)"
              alt=""
              class="event_page__image"
            />
          </div>
        </header>

        <section
          ref="description"
          class="event_page__description u-margin-bottom-big u-margin-top-big"
        >
          <h2 class="heading--h2__style--6 center capitalize">描述</h2>
          <pre class="text">{{ event.description }}</pre>

          <div class="detail">
            <div class="detail__icon--div">
              <img
                src="@/assets/images/blue_thumb.png"
                alt=""
                class="detail__icon--background"
              />
              <svg class="detail__icon">
                <use xlink:href="@/assets/images/sprite.svg#icon-calendar" />
              </svg>
            </div>

            <span class="detail__title">开始时间</span>

            <span class="detail__value">{{
              new Date(event.startsIn).toLocaleString().split(",")[0]
            }}</span>
          </div>

          <div class="detail">
            <div class="detail__icon--div">
              <img
                src="@/assets/images/blue_thumb.png"
                alt=""
                class="detail__icon--background"
              />
              <svg class="detail__icon">
                <use xlink:href="@/assets/images/sprite.svg#icon-calendar" />
              </svg>
            </div>

            <span class="detail__title">结束时间</span>

            <span class="detail__value">{{
              new Date(event.endsIn).toLocaleString().split(",")[0]
            }}</span>
          </div>
        </section>
      </div>
      <div class="recommended custom__padding" ref="recommended">
        <recommended-home :products="recommendedProducts" class="u-margin-0">
        </recommended-home>
      </div>
    </div>

    <loader-app v-if="!loaded"></loader-app>
  </div>
</template>

<script>
import RecommendedHome from "@/components/app/home/Recommended.vue";
import { ref, computed } from "vue";

import { useStore } from "vuex";
import { useRoute } from "vue-router";
export default {
  components: {
    RecommendedHome,
  },
  setup() {
    const route = useRoute();
    const store = useStore();

    const navbarTaps = [{key: "overview", value: "简介"}, {key: "description", value: "描述"}, {key: "recommended", value: "推荐"}];
    const recommended = ref(null);
    const overview = ref(null);
    const description = ref(null);
    const domElements = {
      recommended,
      overview,
      description,
    };

    const scrollTo = (id) => {
      console.log(id);
      const windowScrollY = window.scrollY;
      const { top } = domElements[id[0]].value.getBoundingClientRect();
      const topOffeset = window.innerWidth > 1100 ? 120 : 190;

      window.scroll({
        top: Math.abs(windowScrollY * 1 + top * 1 - topOffeset),
        left: 0,
        behavior: "smooth",
      });
    };

    const loaded = ref(false);

    const event = computed(() => store.getters["events/getCurrentEvent"]);

    const loadCurEvent = async () => {
      console.log("here");
      console.log(route);
      loaded.value = false;

      await store.dispatch("events/fetchCurrentEvent", route.params.id);

      loaded.value = true;
    };

    loadCurEvent();

    const recommendedProducts = computed(
      () => store.getters["products/getRecommendedProducts"]
    );
    const fetchRecommendedProducts = async () => {
      if (Object.keys(recommendedProducts.value).length > 0) return;
      await store.dispatch("products/fetchRecommendedProducts");
    };
    fetchRecommendedProducts();

    const genEventImageLarge = event => require('@/assets/images/events/' + event.coverImage[0].large_image).default;

    //
    return {
      navbarTaps,
      recommended,
      overview,
      description,
      scrollTo,
      event,
      recommendedProducts,
      loaded,
      genEventImageLarge
    };
  },
};
</script>

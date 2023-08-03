<template>
  <section class="home__events event--sec">
    <Carousel :breakpoints="breakpoints" v-if="Object.keys(events).length > 0">
      <Slide
        v-for="event in events"
        :key="event._id"
        @mousedown="drag = false"
        @mousemove="drag = true"
        @mouseup="drag ? (drag = false) : navigate(event._id)"
      >
        <div class="event__card">
          <div class="event__word--div bounace_rotate">
            <div class="event__bubble--div">
              <img class="event__bubble" src="@/assets/images/bubble-blue.png" />
            </div>
            <span class="event__word">活动</span>
          </div>

          <p class="event__title fade_in_left">
            {{ event.title }}
          </p>

          <p class="event__summary fade_in_left">
            {{ event.summary.split("").splice(0, 50).join("") }}
          </p>

          <div class="event__image--div fade_in_bottom">
            <img
              class="event__image"
              :src="genEventImageMedium(event)"
            />
          </div>
        </div>
      </Slide>
    </Carousel>

    <content-loader v-show="loading"></content-loader>
  </section>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import { useRouter } from "vue-router";

export default {
  components: {},
  setup(_, { emit }) {
    const store = useStore();

    const router = useRouter();

    const carouselSettings = {
      transition: 800,
    };

    const genEventImageMedium = event => require('@/assets/images/events/' + event.coverImage[0].medium_image).default;

    const breakpoints = {
      1170: {
        itemsToShow: 2,
        itemsToScroll: 2,
      },

      1050: {
        itemsToShow: 1.9,
        itemsToScroll: 1,
      },

      1000: {
        itemsToShow: 1.8,
        itemsToScroll: 1,
      },

      940: {
        itemsToShow: 1.7,
        itemsToScroll: 1,
      },

      835: {
        itemsToShow: 1.5,
        itemsToScroll: 1,
      },

      785: {
        itemsToShow: 1.4,
        itemsToScroll: 1,
      },

      730: {
        itemsToShow: 1.3,
        itemsToScroll: 1,
      },

      700: {
        itemsToShow: 1.25,
        itemsToScroll: 1,
      },

      675: {
        itemsToShow: 1.2,
        itemsToScroll: 1,
      },

      650: {
        itemsToShow: 1.15,
        itemsToScroll: 1,
      },

      630: {
        itemsToShow: 1.12,
        itemsToScroll: 1,
      },

      620: {
        itemsToShow: 1.1,
        itemsToScroll: 1,
      },

      500: {
        itemsToShow: 1.05,
        itemsToScroll: 1,
      },
      450: {
        itemsToShow: 1.1,
        itemsToScroll: 1,
      },
      300: {
        itemsToShow: 1.1,
        itemsToScroll: 1,
      },

      280: {
        itemsToShow: 1.05,
        itemsToScroll: 1,
      },
    };

    const drag = ref(false);

    const navigate = (eventId) => {
      router.push(`/events/${eventId}`);
    };

    const events = computed(() => store.getters["events/getAllEvents"]);
    const loading = ref(false);
    const loadData = async () => {
      loading.value = true;
      if (Object.keys(events.value).length == 0) {
        await store.dispatch("events/fetchEvents");
      }
      loading.value = false;

      emit("data-loaded");
    };

    loadData();

    return {
      settings: carouselSettings,
      navigate,
      drag,
      events,
      loadData,
      loading,
      breakpoints,
      genEventImageMedium
    };
  },
};
</script>

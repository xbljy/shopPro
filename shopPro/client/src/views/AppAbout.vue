<template>
  <div class="app__container custom">
    <teleport to="#taps"
      ><shortcuts-app
        class="taps"
        ref="taps"
        :behavior="'single'"
        :tags="navbarTaps"
        :initialValue="['about']"
        @selection-updated="scrollTo($event)"
      ></shortcuts-app
    ></teleport>
    <about-header
      ref="about"
      @button-clicked="scrollTo(['locations'])"
    ></about-header>
    <story-section ref="story"></story-section>
    <locations-section
      ref="locations"
      @map-loaded="loaded = true"
    ></locations-section>
  </div>
</template>

<script>
import { ref } from "vue";

import AboutHeader from "@/components/app/aboutUs/Header.vue";
import LocationsSection from "@/components/app/aboutUs/Locations.vue";
import StorySection from "@/components/app/aboutUs/Story.vue";
export default {
  components: { LocationsSection, StorySection, AboutHeader },
  setup() {
    const navbarTaps = ["关于", "大事", "地址"];

    const about = ref(null);
    const story = ref(null);
    const locations = ref(null);

    const domElements = {
      about,
      story,
      locations,
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

    const loaded = ref(false);

    return {
      scrollTo,
      about,
      story,
      navbarTaps,
      locations,
      loaded,
    };
  },
};
</script>

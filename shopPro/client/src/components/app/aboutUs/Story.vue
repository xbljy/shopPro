<template>
  <section class="story u-margin-top-big">
    <h2 class="heading--h2__style--6">企业大事</h2>

    <Carousel :settings="settings">
      <Slide v-for="i in 2" :key="i">
        <section class="story__content">
          <pre class="text story__text">
            创建于2022年,出售各种高品质新鲜的水果蔬菜，海鲜，冷冻食品。
          </pre>
          <div class="story__image--div">
            <img
              :src="require('@/assets/images/about-' + i + '.png').default"
              alt=""
              class="story__image"
            />
          </div>
        </section>
      </Slide>

      <template #addons="{ slidesCount }">
        <Pagination v-if="slidesCount > 1" />
      </template>
    </Carousel>
  </section>
</template>

<script>
export default {
  setup() {
    const carouselSettings = {
      itemsToShow: 1,
      transition: 1000,
      itemsToScroll: 1,
    };

    return {
      settings: carouselSettings,
    };
  },
};
</script>

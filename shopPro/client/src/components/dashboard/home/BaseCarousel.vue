<template>
  <div class="dashboard_home__carousel u-margin-bottom-medium overflow-hidden">
    <section class="dashboard_home__carousel__heading">
      <h2 class="heading--h2 heading--h2__style--5">
        <svg
          class="heading--h2__style--5__icon heading--h2__style--5__icon--blue"
          :class="{ 'heading--h2__style--5__icon--red': title == 'favorites' }"
        >
          <use :xlink:href="'@/assets/images/sprite.svg#icon-' + icon" />
        </svg>
        最新上架 {{ title }}
      </h2>
    </section>

    <router-link :to="link" class="btn btn-dark btn-small"
      >查看更多</router-link
    >

    <Carousel
      v-if="items && Object.keys(items).length > 0"
      :settings="settings"
      :breakpoints="breakpoints"
    >
      <Slide class="auto_width" v-for="product in items" :key="product.id">
        <section
          v-if="title == 'favorites' && product.properties.length > 0"
          class="product__style--3"
          @mousedown="drag = false"
          @mousemove="drag = true"
          @mouseup="drag ? (drag = false) : navigate(product.id)"
        >
          <img
            class="product__image"
            :src="genProductImageMdeium(product)"
            alt=""
          />

          <h5 class="heading--h5">{{ product.name }}</h5>
          <div class="product__price">¥{{ product.properties[0].price }}</div>

          <ul class="product__property--list non__click">
            <li
              ref="property"
              class="product__property--item non__click"
              v-for="property in product.properties"
              :key="property.propertyName"
              :style="{ 'background-color': property.propertyName }"
            ></li>
          </ul>
        </section>

        <section
          v-else-if="product.product.properties.length > 0"
          class="product__style--3"
          @mousedown="drag = false"
          @mousemove="drag = true"
          @mouseup="drag ? (drag = false) : navigate(product.product.id)"
        >
          <img
            class="product__image"
            :src="genProductImageMdeium(product.product)"
            alt=""
          />

          <h5 class="heading--h5">{{ product.product.name }}</h5>
          <div class="product__price">
            ¥{{ calcPrice(product.product, product.property) }}
          </div>

          <div class="product__style--3__selected">
            <div class="product__style--3__selectedProperty">
              颜色

              <span :style="{ 'background-color': product.property }"></span>
            </div>

            <div class="product__style--3__selectedSize" v-if="product.size">
              尺寸 <span>{{ product.size }}</span>
            </div>
          </div>
        </section>
      </Slide>

      <template #addons>
        <Navigation v-if="Object.keys(items).length > 0" />
      </template>
    </Carousel>

    <empty-content
      v-if="Object.keys(items).length == 0"
      class="empty-content--small"
    ></empty-content>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  props: ["items", "title", "link", "icon"],
  setup() {
    const router = useRouter();

    const carouselSettings = {
      transition: 400,
    };

    const breakpoints = {
      1215: {
        itemsToShow: 3,
        itemsToScroll: 3,
      },
      1000: {
        itemsToShow: 3.5,
        itemsToScroll: 3,
      },
      910: {
        itemsToShow: 3.7,
        itemsToScroll: 3,
      },

      800: {
        itemsToShow: 3.2,
        itemsToScroll: 3,
      },

      700: {
        itemsToShow: 2.8,
        itemsToScroll: 2,
      },

      600: {
        itemsToShow: 2.3,
        itemsToScroll: 2,
      },

      500: {
        itemsToShow: 2,
        itemsToScroll: 1,
      },
      280: {
        itemsToShow: 1.6,
        itemsToScroll: 1,
      },
    };

    const drag = ref(false);

    const navigate = (id) => {
      router.push(`/store/${id}`);
    };

    const calcPrice = (product, propertyName) => {
      return product.properties.find((property) => property.propertyName == propertyName).price;
    };
    const genProductImageMdeium = product => require(`@/assets/images/products/${product.properties[0].images[0].medium_image}`).default;

    return {
      settings: carouselSettings,
      navigate,
      drag,
      calcPrice,
      breakpoints,
      genProductImageMdeium
    };
  },
};
</script>

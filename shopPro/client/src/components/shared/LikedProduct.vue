<template>
  <div
    class="product product__style--2"
    :class="{
      'product__style--4': style == 'style4',
      no_sizes: !curPropertySizes || curPropertySizes.length == 0,
    }"
    @click="navigate($event, product.id)"
  >
    <div class="selection non__click" v-if="withSelection">
      <input
        :id="'checkbox' + product.id"
        type="checkbox"
        class="selection__checkbox non__click"
        @change="toggleProduct(product.id)"
      />
      <label
        :for="'checkbox' + product.id"
        class="selection__label non__click"
      ></label>
    </div>

    <img
      class="product__image"
      :src="productImage"
      alt=""
    />

    <h5 class="heading--h5">{{ product.name }}</h5>

    <div class="product__rating">
      <svg class="product__icon product__star">
        <use xlink:href="@/assets/images/sprite.svg#icon-star-full"></use>
      </svg>
      {{ product.ratingsAverage }}
    </div>

    <ul
      class="product__size--list"
      v-if="curPropertySizes && curPropertySizes.length > 0"
    >
      <li class="product__size--item" v-for="size in curPropertySizes" :key="size">
        {{ size }}
      </li>
    </ul>

    <ul class="product__property--list non__click">
      <li
        ref="property"
        class="product__property--item non__click"
        v-for="property in productProperties"
        :key="property"
        @click="changeActiveImage(property)"
      >{{property}}</li>
    </ul>

    <div class="product__price">¥{{ curPrice }}</div>

    <div
      class="product__controller--div non__click"
      @click="deleteWishItem(product.id)"
    >
      <svg
        class="product__icon product__trash--icon"
        :class="{ rotate: wishitemIsBeingDeleted }"
      >
        <use
          xlink:href="@/assets/images/sprite.svg#icon-loader"
          v-show="wishitemIsBeingDeleted"
        ></use>
        <use
          xlink:href="@/assets/images/sprite.svg#icon-trash-2"
          v-show="!wishitemIsBeingDeleted"
        ></use>
      </svg>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { ref } from "vue";
export default {
  props: ["product", "style", "withSelection"],
  setup(props, { emit }) {
    const store = useStore();

    const router = useRouter();

    // 导航
    const navigate = (e, id) => {
      if (!Array.from(e.target.classList).includes("non__click")) {
        router.push("/store/" + id);
      }
    };

    const formatToArray = (prop, target) => {
      const res = [];
      prop.forEach((el) => res.push(el[target]));

      return res;
    };

    const productProperties = ref(formatToArray(props.product.properties, "propertyName"));
    const curPrice = ref(props.product.properties[0].price);

    const curPropertySizes = ref(
      formatToArray(props.product.properties[0].sizes, "size")
    );
    const activeImage = ref(props.product.properties[0].images[0].medium_image);

    const changeActiveImage = (propertyName) => {
      const activeImageIndex = props.product.properties.findIndex(
        (property) => property.propertyName == propertyName
      );

      activeImage.value =
        props.product.properties[activeImageIndex].images[0].medium_image;

      // 修改尺寸
      curPropertySizes.value = formatToArray(
        props.product.properties[activeImageIndex].sizes,
        "size"
      );

      curPrice.value = props.product.properties[activeImageIndex].price;
    };

    const wishitemIsBeingDeleted = ref(false);
    const deleteWishItem = async (productId) => {
      if (wishitemIsBeingDeleted.value) return;
      wishitemIsBeingDeleted.value = true;
      await store.dispatch("wishlist/deleteWishitem", productId);
      wishitemIsBeingDeleted.value = false;
    };

    const toggleProduct = (productId) => {
      emit("product-toggled", productId);
    };

    const productImage = require(`@/assets/images/products/${activeImage.value}`).default;

    return {
      navigate,
      changeActiveImage,
      activeImage,
      deleteWishItem,
      productProperties,
      curPropertySizes,
      wishitemIsBeingDeleted,
      toggleProduct,

      curPrice,
      productImage
    };
  },
};
</script>

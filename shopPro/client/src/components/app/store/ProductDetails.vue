<template>
  <div class="product_detail" v-if="product.id">
    <div
      class="product_detail__img--div rounded__base"
      :class="{ zero__top: type == 'popup' }"
    >
      <div class="product_detail__img--selector">
        <img
          v-for="(image, i) in activeImages"
          :key="image"
          :src="genProductImageSmall(image)"
          @click="slideTo(i)"
          alt=""
          class="product_detail__img product_detail__img--thumb"
          :class="{
            'product_detail__img--thumb_active': isActiveImage(i),
          }"
        />
      </div>
      <Carousel
        :settings="settings"
        class="product_detail__carousel"
        ref="carousel"
      >
        <Slide
          class="p_0 full_port_width_phone-3"
          v-for="image in activeImages"
          :key="image.medium_image"
          @mousedown="drag = false"
          @mousemove="drag = true"
          @mouseup="drag ? (drag = false) : openImage(image)"
        >
          <img
            :src="genProductImageMdeium(image)"
            alt=""
            class="product_detail__img product_detail__img--active"
          />
        </Slide>
      </Carousel>

      <teleport to="body">
        <transition name="fade">
          <base-popup
            ref="previewImagePopup"
            @close-popup="previewedImage = undefined"
            v-show="previewedImage"
          >
            <template #content>
              <div class="previewed__image">
                <img
                  :src="previewedImage"
                  alt="product_image"
                  class="previewed__image--img"
                />
              </div>
            </template>
          </base-popup>
        </transition>
      </teleport>
    </div>

    <div class="rounded__base product_detail__content">
      <section class="product_detail__header">
        <h2 class="heading--h2 heading--h2__style--2">{{ product.name }}</h2>

        <div class="btn__group product_detail__btns">
          <base-button
            class="btn--2 btn--2-red btn__wishlist"
            :active="isLiked(product.id)"
            :loading="productIsBeingToggledToWishlist"
            @click="toggleWishlisted(product)"
            ref="like"
          >
            <template #content>
              <div class="btn__icon--div">
                <svg class="btn__icon">
                  <use xlink:href="@/assets/images/sprite.svg#icon-heart"></use>
                </svg>
              </div>
              <span>{{ isLiked(product.id) ? "已喜欢" : "喜欢" }}</span>
            </template>
          </base-button>

          <base-button
            class="btn--2 btn--2-primary btn__add_to_bag"
            :active="isCurSelectionAdded"
            :loading="productIsBeingAdded || cardIsBeingDeleted"
            :disabled="
              productIsBeingAdded || cardIsBeingDeleted || maxQuantity == 0
            "
            @click="toggleProductToBag(product)"
            ref="cart"
          >
            <template #content>
              <div class="btn__icon--div">
                <svg class="btn__icon">
                  <use xlink:href="@/assets/images/sprite.svg#icon-shopping-bag"></use>
                </svg>
              </div>
              <span>{{
                isCurSelectionAdded ? "从购物车删除" : "加入购物车"
              }}</span>
            </template>
          </base-button>

          <base-button
            class="btn btn--2 btn--2-blue"
            :loading="productIsBeingAdded"
            :disabled="
              productIsBeingAdded || cardIsBeingDeleted || maxQuantity == 0
            "
            @click="addProductToBagAndNavigateToCheckoutPage()"
          >
            <template #content>
              <div class="btn__icon--div">
                <svg class="btn__icon">
                  <use xlink:href="@/assets/images/sprite.svg#icon-shopping-cart"></use>
                </svg>
              </div>
              <span>立即购买</span>
            </template>
          </base-button>
        </div>

        <ratings-app
          class="product__rating"
          :ratingsAverage="product.ratingsAverage"
          :ratingsQuantity="product.ratingsQuantity"
        ></ratings-app>
      </section>

      <section class="product_detail__sec">
        <h4 class="heading--h4 heading--h4__style--3">选择属性</h4>
        <ul class="property_pallatte__list">
          <li
            class="property_pallatte__item"
            :class="{
              active: isActiveProperty(property.propertyName),
            }"
            v-for="property in product.properties"
            :key="property.propertyName"
            @click="
              changeActiveImages(property.propertyName);
              updateSelectedPropertyMethod(property);
            "
          >{{property.propertyName}}</li>
        </ul>
      </section>

      <section
        class="product_detail__sec"
        v-if="availableSizes && availableSizes.length > 0"
      >
        <h4 class="heading--h4 heading--h4__style--3 full-width">选择规格</h4>
        <ul class="size_pallatte__list">
          <li
            class="size_pallatte__item"
            :class="{
              active: isActiveSize(sizeObj.size),
              isZeroQuantity: sizeObj.quantity == 0,
            }"
            v-for="sizeObj in availableSizes"
            :key="sizeObj.size"
            ref="cart"
            @click="updateSelectedSize(sizeObj)"
          >
            {{ filterSizeName(sizeObj.size) }}
          </li>
        </ul>
      </section>

      <section class="product_detail__sec">
        <h4 class="heading--h4 heading--h4__style--3">商品数量</h4>
        <div
          class="product_detail__price"
          :class="{ noAvailable: maxQuantity == 0 }"
        >
          {{ maxQuantity > 0 ? maxQuantity : "无库存" }}
        </div>
      </section>

      <section class="product_detail__sec">
        <h4 class="heading--h4 heading--h4__style--3">合计</h4>
        <div class="product_detail__price">
          <span class="product__price--discount" v-if="discountValue > 0">
            -{{ discountValue }}%
          </span>
          ¥{{ curPrice }}
        </div>
      </section>
      <div class="btn__group product_detail__controls--div">
        <base-button
          class="btn-dark btn-medium"
          :loading="productIsBeingAdded || cardIsBeingDeleted"
          :disabled="
            productIsBeingAdded || cardIsBeingDeleted || maxQuantity == 0
          "
          @click="toggleProductToBag(product)"
        >
          <template #content>
            {{ isCurSelectionAdded ? "从购物车删除" : "加入购物车" }}
          </template>
        </base-button>
        <base-button
          class="btn-blue btn-medium"
          :innerText="'立即购买'"
          :loading="productIsBeingAdded"
          :disabled="
            productIsBeingAdded || cardIsBeingDeleted || maxQuantity == 0
          "
          @click="addProductToBagAndNavigateToCheckoutPage(product)"
        >
        </base-button>
      </div>
      <section class="product_detail__sec">
        <button
          class="btn accordion__btn"
          :class="{ active: viewDescription }"
          @click="viewDescription = !viewDescription"
        >
          <svg class="btn__icon accordion__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-plus1" />
          </svg>
          详情
        </button>

        <transition name="extend" mode="in-out">
          <pre
            class="accordion__text text fullwidth"
            v-show="viewDescription"
            >{{ product.description }}</pre
          >
        </transition>
      </section>
      <section></section>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";

import { useWishlist } from "@/hooks/wishlist.js";
import { useBag } from "@/hooks/bag.js";
import RatingsApp from "../shared/RatingsApp.vue";

export default {
  components: { RatingsApp },
  props: ["product", "type"],
  setup(props) {
    /*
      星标评价
    */
    const fullStars = Math.floor(props.product.ratingsAverage) * 1;
    const emptyStars = 5 - fullStars;

    // =======================================================================
    // ========================= 图片处理 ==============================
    // =======================================================================
    const carousel = ref(null);
    const carouselSettings = {
      itemsToShow: 1,
      transition: 400,
      itemsToScroll: 1,
    };
    const slideTo = (i) => {
      carousel.value.slideTo(i);
    };

    const isActiveImage = computed(() => {
      return (i) => {
        if (!carousel.value) return false;
        else return carousel.value.data.currentSlide.value == i;
      };
    });

    const unwatchCarouselWatcher = watch(carousel, () => {
      carousel.value.restartCarousel();

      unwatchCarouselWatcher();
    });

    const curPrice = ref(props.product.properties[0].price);

    const discountForCurProperty = ref(props.product.properties[0].priceDiscount);
    const discountValue = computed(() => {
      if (discountForCurProperty.value > 0)
        return discountForCurProperty.value * 1 * 100;
      else if (
        props.product.global_discount > 0 &&
        discountForCurProperty.value == 0
      )
        return props.product.global_discount * 1 * 100;
      return 0;
    });

    const curProperty = ref(props.product.properties[0].propertyName);
    const isActiveProperty = (propertyName) => {
      return selectedProperty.value.propertyName == propertyName;
    };
    const activeImages = ref(props.product.properties[0].images);

    // 修改当前图片颜色
    const changeActiveImages = (propertyId) => {
      // 根据颜色获取图片索引
      const activeImageIndex = props.product.properties.findIndex(
        (property) => property.propertyName == propertyId
      );
      curPrice.value = props.product.properties[activeImageIndex].price;
      discountForCurProperty.value =
        props.product.properties[activeImageIndex].priceDiscount;
      if (activeImageIndex > -1) {
        // 修改当前图片
        activeImages.value = props.product.properties[activeImageIndex].images;
        curProperty.value = propertyId;
      }

      carousel.value.slideTo(0);
    };

    // 预览图片
    const drag = ref(false);
    const previewImagePopup = ref(null);
    const previewedImage = ref(undefined);
    const openImage = (image) => {
      previewedImage.value = "@/assets/images/products/" + image.large_image;

      previewImagePopup.value.openPopup();
    };

    const genProductImageSmall = image => require('@/assets/images/products/' + image.small_image).default;

    const genProductImageMdeium = image => require('@/assets/images/products/' + image.medium_image).default;

    const {
      toggleProductToBag,
      addProductToBag,
      selectedProperty,
      selectedSize,
      availableSizes,
      updateSelectedSize,
      updateSelectedPropertyMethod,
      isCurSelectionAdded,
      productIsBeingAdded,
      cardIsBeingDeleted,
      maxQuantity,
      addProductToBagAndNavigateToCheckoutPage,
    } = useBag(props.product);

    const filterSizeName = (sizeName) => {
      sizeName = sizeName.split(" ");

      return sizeName.length > 1 ? sizeName[0] + sizeName[1][0] : sizeName[0];
    };
    const isActiveSize = computed(() => (size) => size == selectedSize.value);

    // 喜欢
    const {
      productIsBeingToggledToWishlist,
      isLiked,
      toggleWishlisted,
      wishlist,
    } = useWishlist();

    const viewDescription = ref(false);

    return {
      drag,
      openImage,
      previewedImage,
      previewImagePopup,
      viewDescription,
      isActiveProperty,
      fullStars,
      emptyStars,
      changeActiveImages,
      activeImages,
      isActiveImage,
      updateSelectedSize,
      updateSelectedPropertyMethod,
      isLiked,
      toggleWishlisted,
      wishlist,
      curProperty,
      isActiveSize,
      availableSizes,
      filterSizeName,
      settings: carouselSettings,
      slideTo,
      carousel,

      isCurSelectionAdded,
      addProductToBag,
      addProductToBagAndNavigateToCheckoutPage,
      productIsBeingAdded,
      toggleProductToBag,
      productIsBeingToggledToWishlist,
      cardIsBeingDeleted,
      curPrice,
      discountValue,
      maxQuantity,
      genProductImageSmall,
      genProductImageMdeium
    };
  },
};
</script>

<template>
  <div>
    <div
      class="product product__style--1 phone__no-shadow"
      @mousedown="drag = false"
      @mousemove="drag = true"
      @mouseup="drag ? (drag = false) : navigate($event, product.id)"
      @mouseenter="mouseEntered = true"
      @mouseleave="mouseEntered = false"
    >
      <div
        class="product__icon--div product__icon--div--left non__click"
        @click="toggleWishlisted(product)"
      >
        <svg
          class="product__icon product__like non__click"
          :class="{
            'product__like--active': isLiked(product.id),
            spin: productIsBeingToggledToWishlist,
          }"
          ref="like"
        >
          <use
            xlink:href="@/assets/images/sprite.svg#icon-heart"
            v-show="!productIsBeingToggledToWishlist"
          ></use>
          <use
            xlink:href="@/assets/images/sprite.svg#icon-loader"
            v-show="productIsBeingToggledToWishlist"
          ></use>
        </svg>
      </div>

      <div class="product__image--div product__image--div--main">
        <transition name="toggle-slide" mode="out-in">
          <img
            class="product__image product__image--main"
            :src="productImageMdeium"
            alt=""
            v-if="mouseEntered"
          />

          <img
            class="product__image product__image--main"
            :src="productImageMdeium"
            alt=""
            v-else
          />
        </transition>
      </div>

      <div
        class="product__icon--div product__icon--div--right non__click"
        @click="openProductDescriptionPopup()"
      >
        <svg class="product__icon product__eye non__click" ref="eye">
          <use xlink:href="@/assets/images/sprite.svg#icon-eye11"></use>
        </svg>
      </div>

      <h5 class="heading--h5 h5--main">{{ product.name }}</h5>

      <div class="product__rating rating--main">
        <svg class="product__icon product__star">
          <use xlink:href="@/assets/images/sprite.svg#icon-star-full"></use>
        </svg>
        {{ product.ratingsAverage }}
      </div>

      <ul class="product__size--list" v-if="curPropertySizes.length > 0">
        <li
          class="product__size--item"
          v-for="size in curPropertySizes"
          :key="size"
        >
          {{ size }}
        </li>
      </ul>

      <ul class="product__property--list product__property--list--row non__click">
        <li
          ref="property"
          class="product__property--item non__click"
          v-for="property in product.properties"
          :key="property.propertyName"
          @click="changeActiveImages(property.propertyName)"
        ></li>
      </ul>

      <div class="product__price product__price--main">
        ¥{{ curPrice }}

        <span
          class="product__price--discount"
          v-if="discountForCurProperty || globalDiscount"
        >
          -{{
            discountForCurProperty
              ? discountForCurProperty * 100
              : globalDiscount * 100
          }}%
        </span>
      </div>

      <div
        class="product__cart--div product__cart--div--main non__click"
        :class="{ active: selectorsWindow }"
        ref="cart"
        @click="openAddToCartPopup(product)"
      >
        <svg
          class="product__icon product__cart--icon product__cart--icon--main"
        >
          <use xlink:href="@/assets/images/sprite.svg#icon-shopping-cart"></use>
        </svg>
        <span>加入购物车</span>
      </div>
      <teleport to="body">
        <base-popup
          v-show="selectorsWindow"
          @popup-closed="selectorsWindow = false"
        >
          <template #content>
            <form
              class="form__style--2 add__item--form form__style--2__selectors custom--form"
            >
              <div class="form__style--2__group">
                <label class="form__style--2__label add__item--label"
                  >选择属性</label
                >
                <ul class="property_pallatte__list">
                  <li
                    class="property_pallatte__item"
                    :class="{ active: isActiveProperty(property.propertyName) }"
                    v-for="property in product.properties"
                    :key="property.propertyName"
                    @click="updateSelectedPropertyMethod(property)"
                  >{{property.propertyName}}</li>
                </ul>
              </div>

              <div
                class="form__style--2__group"
                v-if="availableSizes && availableSizes.length > 0"
              >
                <label class="form__style--2__label add__item--label"
                  >选择规格</label
                >
                <ul class="size_pallatte__list">
                  <li
                    class="size_pallatte__item"
                    v-for="sizeObj in availableSizes"
                    :key="sizeObj.size"
                    :class="{ active: isActiveSize(sizeObj.size) }"
                    ref="cart"
                    @click="updateSelectedSize(sizeObj)"
                  >
                    {{ filterSizeName(sizeObj.size) }}
                  </li>
                </ul>
              </div>
              <div class="form__style--2__group">
                <label class="form__style--2__label add__item--label">
                  数量
                  <span class="small_text">
                    (最大数量: {{ maxQuantity }})
                  </span>
                </label>
                <input
                  type="number"
                  min="1"
                  :max="maxQuantity"
                  class="form__style--2__input add__item--input"
                  placeholder="请输入数量"
                  v-model="numberOfOrders"
                  required
                  @blur="v$.numberOfOrders.$touch"
                />

                <span
                  class="error__message--new_line error__message"
                  v-if="v$.numberOfOrders.$error"
                >
                  {{ v$.numberOfOrders.$errors[0].$message }}
                </span>
              </div>

              <div class="form__group">
                <button
                  type="button"
                  class="btn btn-small btn-dark"
                  @click="selectorsWindow = false"
                >
                  取消
                </button>
                <base-button
                  :loading="productIsBeingAdded || ordersNumberIsBeingChanged"
                  :disabled="
                    numberOfOrders < 1 ||
                    maxQuantity < numberOfOrders ||
                    productIsBeingAdded ||
                    ordersNumberIsBeingChanged ||
                    v$.numberOfOrders.$error
                  "
                  type="button"
                  class="btn-small btn-blue"
                  @click="submitData()"
                  :innerText="isCurSelectionAdded ? '修改数量' : '加入购物车'"
                >
                </base-button>
              </div>
            </form>
          </template>
        </base-popup>
      </teleport>
    </div>

    <teleport to="body">
      <transition name="fade">
        <base-popup
          v-show="productDescriptionPopup"
          ref="popupElement"
          @popup-closed="productDescriptionPopup = false"
        >
          <template #content v-if="productDescriptionPopup">
            <product-details
              :product="product"
              v-if="product.id"
              :type="'popup'"
            ></product-details>
          </template>
        </base-popup>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { useRouter } from "vue-router";
import { ref, computed } from "vue";
import { useWishlist } from "@/hooks/wishlist.js";
import { useBag } from "@/hooks/bag.js";

import { between, integer, required } from "validators";

import { useVuelidate } from "@vuelidate/core";

export default {
  props: ["product", "style", "parent"],
  setup(props) {
    const router = useRouter();

    const navigate = (e, id) => {
      // 如果点击标签存在 non__click 类名则不跳转
      if (!Array.from(e.target.classList).includes("non__click")) {
        router.push("/store/" + id);
      }
    };

    const formatToArray = (prop, target) => {
      const res = [];
      prop.forEach((el) => res.push(el[target]));

      return res;
    };

    const curPropertySizes = ref(
      formatToArray(props.product.properties[0].sizes, "size")
    );

    const curPrice = ref(props.product.properties[0].price);

    const discountForCurProperty = ref(props.product.properties[0].priceDiscount);
    const globalDiscount = ref(props.product.global_discount);

    // 设置默认图片
    const activeImages = ref(props.product.properties[0].images);
    
    const productImageMdeium = require(`@/assets/images/products/${activeImages.value[0].medium_image}`).default;

    // 修改当前图片
    const changeActiveImages = (propertyName) => {
      // 获取图片索引
      const activeImagesIndex = props.product.properties.findIndex(
        (property) => property.propertyName == propertyName
      );
      // 修改图片
      activeImages.value = props.product.properties[activeImagesIndex].images;
      // 修改尺寸
      curPropertySizes.value = formatToArray(
        props.product.properties[activeImagesIndex].sizes,
        "size"
      );
      discountForCurProperty.value =
        props.product.properties[activeImagesIndex].priceDiscount;

      curPrice.value = props.product.properties[activeImagesIndex].price;
    };

    // 修改喜欢列表hook
    const { productIsBeingToggledToWishlist, isLiked, toggleWishlisted } =
      useWishlist();

    const selectorsWindow = ref(false);

    const openAddToCartPopup = () => {
      selectorsWindow.value = true;
    };
    const popupElement = ref(null);
    const productDescriptionPopup = ref(false);
    const openProductDescriptionPopup = () => {
      productDescriptionPopup.value = true;
      popupElement.value.openPopup();
    };

    /*
      =================================================================================
      ===========================加入购物车===================================
      =================================================================================
    */
    const {
      addProductToBag,
      changeNumberOfOrders,
      selectedSize,
      availableSizes,
      updateSelectedSize,
      selectedProperty,
      updateSelectedPropertyMethod,
      curCard,
      isCurSelectionAdded,
      numberOfOrders,
      ordersNumberIsBeingChanged,
      productIsBeingAdded,
      maxQuantity,
    } = useBag(props.product);

    const submitData = async () => {
      if (isCurSelectionAdded.value) await changeNumberOfOrders();
      else await addProductToBag();
      selectorsWindow.value = false;
    };

    const isActiveProperty = (propertyName) => {
      if (!selectedProperty.value) return false;
      return selectedProperty.value.propertyName == propertyName;
    };

    const filterSizeName = (sizeName) => {
      sizeName = sizeName.split(" ");

      return sizeName.length > 1 ? sizeName[0] + sizeName[1][0] : sizeName[0];
    };

    const isActiveSize = computed(() => (size) => size == selectedSize.value);

    const mouseEntered = ref(false);

    // ========================== 验证规则 ================================
    const rules = {
      numberOfOrders: {
        required,
        integer,
        betweenRef: between(maxQuantity.value ? 1 : 0, maxQuantity),
      },
    };
    const v$ = useVuelidate(rules, { numberOfOrders }, { $lazy: true });

    return {
      v$,

      navigate,
      mouseEntered,

      curCard,
      isCurSelectionAdded,
      numberOfOrders,
      updateSelectedPropertyMethod,
      availableSizes,
      addProductToBag,
      changeNumberOfOrders,
      submitData,
      ordersNumberIsBeingChanged,
      productIsBeingAdded,
      maxQuantity,

      changeActiveImages,
      activeImages,
      productIsBeingToggledToWishlist,
      toggleWishlisted,
      isLiked,
      updateSelectedSize,
      selectorsWindow,

      popupElement,
      openProductDescriptionPopup,

      curPropertySizes,
      productDescriptionPopup,
      isActiveProperty,
      filterSizeName,
      isActiveSize,
      openAddToCartPopup,

      curPrice,
      discountForCurProperty,
      globalDiscount,
      productImageMdeium
    };
  },
};
</script>

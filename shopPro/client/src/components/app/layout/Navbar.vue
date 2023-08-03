<template>
  <div>
    <div class="nav__top">
      <div class="nav__logo">
        <router-link to="/home">
          <img
            src="@/assets/images/logo-inline.png"
            alt="logo"
            class="nav__logo--img"
          />
        </router-link>
      </div>

      <div class="search__group">
        <input type="text" class="search__input" placeholder="搜索" />
        <svg class="search__icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-search2"></use>
        </svg>
      </div>

      <div id="taps" class="nav__taps"></div>

      <button class="nav__btn nav__menu" @click="phoneMenu = true">
        <svg class="nav__btn--icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-th-menu"></use>
        </svg>
      </button>

      <div class="btn__group nav__auth" v-if="!isUserExists">
        <router-link class="btn btn-light" to="/login"> 登录 </router-link>
        <router-link class="btn btn-dark" to="/register">注册</router-link>
      </div>

      <div class="nav__user--area" v-if="isUserExists">
        <div class="nav__user__icon" @click="toggleWishlistMenu()">
          <span v-if="numOfWishitems > 0">{{ numOfWishitems }}</span>
          <svg class="nav__heart">
            <use xlink:href="@/assets/images/sprite.svg#icon-heart"></use>
          </svg>
        </div>
        <div class="nav__user__icon" @click="toggleBagMenu()">
          <span v-if="numOfCards > 0">{{ numOfCards }}</span>
          <svg class="nav__cart">
            <use xlink:href="@/assets/images/sprite.svg#icon-shopping-cart1"></use>
          </svg>
        </div>
        <div class="nav__user--container">
          <button
            class="nav__user"
            @click="userMenu = !userMenu"
            @blur="userMenu = false"
          >
            <span class="nav__user__name">{{ userName.split(" ")[0] }}</span>
            <div class="nav__user__image">
              <img :src="defaultPhoto" alt="" />
            </div>
          </button>
          <teleport to="body">
            <transition name="slide" mode="in-out">
              <ul class="nav__user__menu select__box__options" v-if="userMenu">
                <li
                  class="nav__user__item select__box__option"
                  @click="$router.push('/dashboard')"
                >
                  <svg class="nav__user__item--icon select__box__icon">
                    <use xlink:href="@/assets/images/sprite.svg#icon-th-small" />
                  </svg>
                  我的
                </li>

                <li
                  class="nav__user__item select__box__option"
                  @click="logUserOut"
                >
                  <svg class="nav__user__item--icon select__box__icon">
                    <use xlink:href="@/assets/images/sprite.svg#icon-angry2" />
                  </svg>
                  退出
                </li>
              </ul>
            </transition>
          </teleport>
        </div>
      </div>
    </div>

    <div class="nav__left">
      <div class="nav__logo">
        <router-link to="/home">
          <img src="@/assets/images/logo.png" alt="logo" class="nav__logo--img" />
        </router-link>
      </div>

      <ul class="nav__icon--list">
        <li class="nav__icon--item active">
          <router-link to="/home" class="nav__icon--link">
            <svg class="nav__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-home"></use>
            </svg>
          </router-link>
        </li>

        <li class="nav__icon--item">
          <router-link to="/store" class="nav__icon--link">
            <svg class="nav__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-shop"></use>
            </svg>
          </router-link>
        </li>

        <li class="nav__icon--item">
          <router-link to="/about-us" class="nav__icon--link">
            <svg class="nav__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-group"></use>
            </svg>
          </router-link>
        </li>

        <li class="nav__icon--item">
          <router-link to="/blog" class="nav__icon--link">
            <svg class="nav__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-earth"></use>
            </svg>
          </router-link>
        </li>

        <li class="nav__icon--item">
          <router-link to="/contact" class="nav__icon--link">
            <svg class="nav__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-briefcase"></use>
            </svg>
          </router-link>
        </li>
      </ul>

      <div class="nav__settings" title="设置功能维护中">
        <svg class="nav__icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-settings"></use>
        </svg>
      </div>
    </div>

    <nav class="nav__phone fade_in_bottom">
      <router-link to="/dashboard/home" class="nav__phone__list">
        <svg class="nav__phone__icon nav__phone__icon--user">
          <use xlink:href="@/assets/images/sprite.svg#icon-th-large"></use>
        </svg>
      </router-link>

      <router-link to="/store" class="nav__phone__list">
        <svg class="nav__phone__icon nav__phone__icon--shop">
          <use xlink:href="@/assets/images/sprite.svg#icon-store_mall_directory"></use>
        </svg>
      </router-link>

      <router-link to="/home" class="nav__phone__list">
        <svg class="nav__phone__icon nav__phone__icon--home">
          <use xlink:href="@/assets/images/sprite.svg#icon-home1"></use>
        </svg>
      </router-link>

      <li
        class="nav__phone__list nav__phone__list--heart"
        @click="toggleWishlistMenu"
      >
        <span class="nav__phone--num" v-if="numOfWishitems">{{
          numOfWishitems
        }}</span>
        <svg class="nav__phone__icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-heart"></use>
        </svg>
      </li>

      <li
        class="nav__phone__list nav__phone__list--cart"
        @click="toggleBagMenu"
      >
        <span class="nav__phone--num" v-if="numOfCards">{{ numOfCards }}</span>
        <svg class="nav__phone__icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-shopping-cart1"></use>
        </svg>
      </li>
    </nav>

    <nav class="nav__phone--menu" v-if="phoneMenu">
      <div
        class="nav__phone--menu--close fade_in_top"
        @click="phoneMenu = false"
      >
        <span></span>
        <span></span>
      </div>
      <router-link
        @click="phoneMenu = false"
        to="/home"
        class="nav__phone--menu--link fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-home"></use>
        </svg>
        首页
      </router-link>

      <router-link
        @click="phoneMenu = false"
        to="/store"
        class="nav__phone--menu--link fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-shop"></use>
        </svg>
        商城
      </router-link>

      <router-link
        @click="phoneMenu = false"
        to="/about-us"
        class="nav__phone--menu--link fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-group"></use>
        </svg>
        关于我们
      </router-link>

      <router-link
        @click="phoneMenu = false"
        to="/blog"
        class="nav__phone--menu--link fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-earth"></use>
        </svg>

        圈子
      </router-link>

      <router-link
        @click="phoneMenu = false"
        to="/contact"
        class="nav__phone--menu--link fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-briefcase"></use>
        </svg>

        联系我们
      </router-link>

      <router-link
        @click="phoneMenu = false"
        to="/login"
        class="nav__phone--menu--link fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-lock-full"></use>
        </svg>

        登录
      </router-link>

      <button
        @click="
          logUserOut();
          phoneMenu = false;
        "
        class="nav__phone--menu--link nav__phone--menu--btn fade_in_left"
      >
        <svg class="nav__phone--menu--icon bounace_rotate">
          <use xlink:href="@/assets/images/sprite.svg#icon-angry2"></use>
        </svg>

        退出
      </button>
    </nav>

    <teleport to="body">
      <transition name="slide">
        <wishlist-app
          :wishlist="wishlist"
          @close-wishlist="wishlist = false"
        ></wishlist-app>
      </transition>
    </teleport>

    <teleport to="body">
      <transition name="slide">
        <bag-app :bag="bag" @close-bag="bag = false"></bag-app>
      </transition>
    </teleport>
  </div>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";

import WishlistApp from "./Wishlist.vue";
import BagApp from "./Bag.vue";

export default {
  props: ["shortcuts", "curCategory"],
  emits: ["shortcut-change"],
  components: { WishlistApp, BagApp },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    // ================================= 登录验证开始 ====================================
    const user = computed(() => store.getters["auth/getUserData"]);
    const isUserExists = computed(() => store.getters["auth/isUserExists"]);
    const userName = ref(user.value.name);
    const defaultPhoto = require('@/assets/images/users/default.png').default;
    const userPhoto = ref(
      user.value && user.value.photo && user.value.photo.length > 0
        ? user.value.photo[0].small_image
        : defaultPhoto
    );
    

    watch(user, (userData) => {
      userPhoto.value =
        userData.photo && userData.photo.length > 0
          ? userData.photo[0].small_image
          : defaultPhoto;
      userName.value = userData.name;
    });

    // ================================= 登录验证结束 ====================================
    // ================================= 弹框开始 ====================================
    const wishlist = ref(false);
    const numOfWishitems = computed(() => {
      return store.getters["wishlist/getNumOfWishtems"];
    });

    const toggleWishlistMenu = () => {
      if (isUserExists.value) {
        wishlist.value = !wishlist.value;
        bag.value = false;
        return;
      }
      router.push("/login");
    };

    const toggleBagMenu = () => {
      if (isUserExists.value) {
        bag.value = !bag.value;
        wishlist.value = false;
        return;
      }
      router.push("/login");
    };

    const bag = ref(false);
    const numOfCards = computed(() => {
      return store.getters["bag/getNumOfCards"];
    });

    watch(route, () => {
      if (wishlist.value) wishlist.value = false;

      if (bag.value) bag.value = false;
    });
    // ================================= 弹框结束 ====================================

    const userMenu = ref(false);
    const userIsBeingLoggedOut = ref(false);
    const logUserOut = () => {
      if (userIsBeingLoggedOut.value) return;
      userIsBeingLoggedOut.value = true;
      store.dispatch("auth/logUserOut");

      userIsBeingLoggedOut.value = false;
    };

    const phoneMenu = ref(false);

    return {
      logUserOut,
      userMenu,
      userName,
      userPhoto,
      isUserExists,
      wishlist,
      numOfWishitems,
      numOfCards,
      bag,
      defaultPhoto,

      phoneMenu,
      toggleBagMenu,
      toggleWishlistMenu,
    };
  },
};
</script>

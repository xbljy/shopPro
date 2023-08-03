<template>
  <div>
    <nav class="nav_dashboard">
      <router-link to="/home">
        <div class="nav_dashboard__logo">
          <img src="@/assets/images/logo.png" alt="" />
        </div>
      </router-link>

      <ul class="nav_dashboard__list">
        <li
          class="nav_dashboard__item"
          v-if="isUserAdmin"
          @click="toggleSubMenu($event)"
        >
          <a class="nav_dashboard__link prevent__click" href="#">
            <svg class="nav_dashboard__icon prevent__click">
              <use xlink:href="@/assets/images/sprite.svg#icon-user" />
            </svg>
            管理员

            <svg class="nav_dashboard__icon--chevron prevent__click">
              <use xlink:href="@/assets/images/sprite.svg#icon-chevron-right" />
            </svg>
          </a>
          <!-- 子菜单 -->
          <teleport to="body">
            <transition name="slide" mode="in-out">
              <ul class="sub_menu" ref="subMenu" v-if="subMenuOpened">
                <li class="sub_menu__item sub_menu__item-red">
                  <router-link
                    class="sub_menu__link"
                    to="/dashboard/admin-products"
                  >
                    <svg class="sub_menu__icon">
                      <use xlink:href="@/assets/images/sprite.svg#icon-shop" />
                    </svg>

                    商品
                  </router-link>
                </li>

                <li class="sub_menu__item sub_menu__item-green">
                  <router-link
                    class="sub_menu__link"
                    to="/dashboard/admin-billings"
                  >
                    <svg class="sub_menu__icon">
                      <use xlink:href="@/assets/images/sprite.svg#icon-dollar-sign" />
                    </svg>

                    订单
                  </router-link>
                </li>

                <li class="sub_menu__item sub_menu__item-indigo">
                  <router-link
                    class="sub_menu__link"
                    to="/dashboard/admin-blog"
                  >
                    <svg class="sub_menu__icon">
                      <use xlink:href="@/assets/images/sprite.svg#icon-edit" />
                    </svg>

                    圈子
                  </router-link>
                </li>
                <li class="sub_menu__item sub_menu__item-orange">
                  <router-link
                    class="sub_menu__link"
                    to="/dashboard/admin-locations"
                  >
                    <svg class="sub_menu__icon">
                      <use xlink:href="@/assets/images/sprite.svg#icon-map" />
                    </svg>

                    地址
                  </router-link>
                </li>

                <li class="sub_menu__item sub_menu__item-violet">
                  <router-link
                    class="sub_menu__link"
                    to="/dashboard/admin-events"
                  >
                    <svg class="sub_menu__icon">
                      <use xlink:href="@/assets/images/sprite.svg#icon-fire" />
                    </svg>

                    活动
                  </router-link>
                </li>
              </ul>
            </transition>
          </teleport>
          <!-- end sub menu -->
        </li>

        <li class="nav_dashboard__item active">
          <router-link class="nav_dashboard__link" to="/dashboard/home">
            <svg class="nav_dashboard__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-home-full" />
            </svg>
            主页
          </router-link>
        </li>

        <li class="nav_dashboard__item">
          <router-link class="nav_dashboard__link" to="/dashboard/favorites">
            <svg class="nav_dashboard__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-heart" />
            </svg>
            收藏
          </router-link>
        </li>

        <li class="nav_dashboard__item">
          <router-link class="nav_dashboard__link" to="/dashboard/bag">
            <svg class="nav_dashboard__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-bag12" />
            </svg>
            购物车
          </router-link>
        </li>

        <li class="nav_dashboard__item">
          <router-link class="nav_dashboard__link" to="/dashboard/billings">
            <svg class="nav_dashboard__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-money" />
            </svg>
            订单
          </router-link>
        </li>

        <li class="nav_dashboard__item">
          <router-link class="nav_dashboard__link" to="/dashboard/privacey">
            <svg class="nav_dashboard__icon">
              <use xlink:href="@/assets/images/sprite.svg#icon-lock-full" />
            </svg>
            隐私政策
          </router-link>
        </li>
      </ul>

      <div class="nav_dashboard__social">
        <img src="@/assets/images/social.png" alt="" />
      </div>
    </nav>

    <!-- ///////////////////////////////////////// phone /////////////////////////////// -->
    <div class="nav__dashboard--phone">
      <router-link to="/home">
        <img
          class="nav__dashboard--phone--logo"
          src="@/assets/images/logo-inline.png"
          alt="LOGO"
        />
      </router-link>
      <button
        class="nav__btn nav__menu nav__dashboard--phone__menu"
        @click="phoneMenu = true"
      >
        <svg class="nav__btn--icon">
          <use xlink:href="@/assets/images/sprite.svg#icon-th-menu"></use>
        </svg>
      </button>
    </div>

    <nav class="nav__phone--menu" v-if="phoneMenu">
      <div class="nav__phone--menu--close fade_in_top" @click="closePhoneMenu">
        <span></span>
        <span></span>
      </div>

      <!-- 子菜单 -->
      <template v-if="subMenuPhone">
        <router-link
          class="nav__phone--menu--link fade_in_left"
          to="/dashboard/admin-products"
          @click="closePhoneMenu()"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-shop" />
          </svg>

          商品
        </router-link>

        <router-link
          class="nav__phone--menu--link fade_in_left"
          to="/dashboard/admin-billings"
          @click="closePhoneMenu()"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-dollar-sign" />
          </svg>

          订单
        </router-link>

        <router-link
          class="nav__phone--menu--link fade_in_left"
          to="/dashboard/admin-blog"
          @click="closePhoneMenu()"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-edit" />
          </svg>

          圈子
        </router-link>
        <router-link
          class="nav__phone--menu--link fade_in_left"
          to="/dashboard/admin-locations"
          @click="closePhoneMenu()"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-map" />
          </svg>

          地址
        </router-link>

        <router-link
          class="nav__phone--menu--link fade_in_left"
          to="/dashboard/admin-events"
          @click="closePhoneMenu()"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-fire" />
          </svg>

          活动
        </router-link>
      </template>

      <template v-else>
        <button
          v-if="isUserAdmin"
          @click="subMenuPhone = true"
          class="nav__btn nav__menu nav__dashboard--phone__menu nav__phone--menu--link fade_in_left"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-th-large"></use>
          </svg>
          管理员
          <svg class="nav__phone--menu--icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-chevron-right"></use>
          </svg>
        </button>

        <router-link
          @click="phoneMenu = false"
          to="/dashboard/home"
          class="nav__phone--menu--link fade_in_left"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-home"></use>
          </svg>
          主页
        </router-link>

        <router-link
          @click="phoneMenu = false"
          to="/dashboard/favorites"
          class="nav__phone--menu--link fade_in_left"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-heart"></use>
          </svg>
          收藏
        </router-link>

        <router-link
          @click="phoneMenu = false"
          to="/dashboard/bag"
          class="nav__phone--menu--link fade_in_left"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-bag12"></use>
          </svg>
          购物车
        </router-link>

        <router-link
          @click="phoneMenu = false"
          to="/dashboard/billings"
          class="nav__phone--menu--link fade_in_left"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-money"></use>
          </svg>

          订单
        </router-link>

        <router-link
          @click="phoneMenu = false"
          to="/dashboard/privacey"
          class="nav__phone--menu--link fade_in_left"
        >
          <svg class="nav__phone--menu--icon bounace_rotate">
            <use xlink:href="@/assets/images/sprite.svg#icon-lock-full"></use>
          </svg>

          隐私政策
        </router-link>
      </template>
    </nav>
  </div>
</template>

<script>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";

import { useStore } from "vuex";
export default {
  setup() {
    const store = useStore();
    const route = useRoute();

    const subMenu = ref(null);
    const subMenuOpened = ref(false);

    const toggleSubMenu = (e) => {
      if (e.target.classList.contains("sub_menu_active")) {
        subMenuOpened.value = false;
      } else {
        subMenuOpened.value = true;
      }

      e.target.classList.toggle("sub_menu_active");
    };

    watch(route, () => {
      if (!subMenuOpened.value) return;
      subMenuOpened.value = false;
      document
        .querySelector(".sub_menu_active")
        .classList.remove("sub_menu_active");
    });

    const isUserAdmin = computed(() => store.getters["auth/isUserAdmin"]);

    const phoneMenu = ref(false);

    const subMenuPhone = ref(false);

    const closePhoneMenu = () => {
      phoneMenu.value = false;
      subMenuPhone.value = false;
    };
    return {
      phoneMenu,
      subMenu,
      toggleSubMenu,
      subMenuOpened,
      subMenuPhone,
      closePhoneMenu,

      isUserAdmin,
    };
  },
};
</script>

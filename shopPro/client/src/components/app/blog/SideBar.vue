<template>
  <aside class="blog__sidebar">
    <base-widget>
      <template #header>
        <div class="btn__group space_between">
          <base-button
            class="btn-wide btn-dark"
            :class="{ 'btn-gradient_blue': selectedTap == 'recent' }"
            :innerText="'最新'"
            @click="selectPosts('recent')"
          ></base-button>

          <base-button
            class="btn-wide btn-dark"
            :class="{ 'btn-gradient_blue': selectedTap == 'popular' }"
            :innerText="'火爆'"
            @click="selectPosts('popular')"
          ></base-button>
        </div>
      </template>
      <template #content v-if="posts">
        <post-thumb
          v-for="post in posts"
          :key="post.id"
          :post="post"
        ></post-thumb>
      </template>
    </base-widget>
    <base-widget>
      <template #header>
        <heading-sec>
          <template #title> 文章订阅 </template>
        </heading-sec>
      </template>
      <template #content>
        <form class="subscribe">
          <input
            type="email"
            class="subscribe__input"
            placeholder="请输入订阅邮箱"
            required
          />

          <base-button class="btn-dark" :innerText="'订阅'"></base-button>
        </form>
      </template>
    </base-widget>
    <base-widget>
      <template #header>
        <img
          src="@/assets/images/logo-inline.png"
          alt="logo"
          class="blog__brief--img"
        />
      </template>
      <template #content>
        <p class="text blog__brief--text">
          每天发布一篇饮食养生文章，向用户传达健康的饮食习惯和养生意识。
          订阅后每天晚上8点准时推送。感谢您的订阅
        </p>
      </template>
    </base-widget>

    <base-widget>
      <template #header>
        <heading-sec>
          <template #title> 最近话题 </template>
        </heading-sec>
      </template>
      <template #content>
        <ul class="topics--list">
          <li class="topics--item">
            <a href="#" class="topics--link">
              <span class="topics__title">
                <svg class="topics__chevron">
                  <use xlink:href="@/assets/images/sprite.svg#icon-chevron-right"></use>
                </svg>
                饮食养生
              </span>
              <span class="topics__count">(20)</span>
            </a>
          </li>

          <li class="topics--item">
            <a href="#" class="topics--link">
              <span class="topics__title">
                <svg class="topics__chevron">
                  <use xlink:href="@/assets/images/sprite.svg#icon-chevron-right"></use>
                </svg>
                每日一菜
              </span>
              <span class="topics__count">(20)</span>
            </a>
          </li>

          <li class="topics--item">
            <a href="#" class="topics--link">
              <span class="topics__title">
                <svg class="topics__chevron">
                  <use xlink:href="@/assets/images/sprite.svg#icon-chevron-right"></use>
                </svg>
                最新菜谱
              </span>
              <span class="topics__count">(20)</span>
            </a>
          </li>
        </ul>
      </template>
    </base-widget>
  </aside>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";

import PostThumb from "./PostThumb";

export default {
  components: { PostThumb },
  setup() {
    const store = useStore();
    const selectedTap = ref("recent");

    const recentPosts = computed(() => store.getters["blog/getRecentPosts"]);
    const popularPosts = computed(() => store.getters["blog/getPopularPosts"]);

    const posts = computed(() =>
      selectedTap.value == "recent" ? recentPosts.value : popularPosts.value
    );

    const selectPosts = (tap) => {
      selectedTap.value = tap;
    };

    (async () => {
      if (recentPosts.value.length > 0 && popularPosts.value.length > 0) return;
      await store.dispatch("blog/fetchRecentPosts");
      await store.dispatch("blog/fetchPopularPosts");
    })();

    return {
      posts,
      selectPosts,
      selectedTap,
    };
  },
};
</script>

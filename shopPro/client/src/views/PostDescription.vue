<template>
  <div class="app__container custom custom-3">
    <template v-if="loaded && post.value.id">
      <header class="post_page__header u-margin-bottom-big">
        <div class="post_page__header__image--div">
          <img
            :src="postImageLarge"
            alt=""
            class="post_page__header__image"
          />
        </div>
        <button class="btn" @click="$router.go(-1)">
          <svg class="btn__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-arrow-left-10"></use>
          </svg>
        </button>
        <h1 class="heading--h1 uppercase">{{ post.value.title }}</h1>
        <p class="post__summary">
          {{ post.value.summary }}
        </p>
        <div class="post__publisher">
          <div class="post__publisher--img__div">
            <img
              :src="publisherPhoto"
              alt=""
              class="post__publisher--img"
            />
          </div>
          <h6 class="heading--h6">{{ post.value.publisher.name }}</h6>
        </div>

        <div class="post__time">
          <svg class="post__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-clock"></use>
          </svg>
          <time class="post__time--format"
            >{{ new Date(post.value.createdAt).toLocaleString().split(",")[0] }}
          </time>
        </div>
      </header>
      <div class="post_page__content u-margin-bottom-big">
        <section class="post_page__text">
          <h2 class="heading--h2__style--4">相关话题</h2>
          <pre class="text">{{ post.value.description }}</pre>
          <div class="post_page__images">
            <img
              v-for="image in post.value.images.slice(0, 4)"
              :key="image.id"
              :src="postImageMedium"
              alt=""
            />
          </div>
        </section>
        <div class="post_page__sidebar custom__padding">
          <side-bar></side-bar>
        </div>
      </div>
      <recommended-posts
        class="custom__padding"
        :posts="recommendedPosts"
        v-if="recommendedPosts && recommendedPosts.length > 0"
      ></recommended-posts>
    </template>

    <loader-app v-if="!loaded"></loader-app>
  </div>
</template>

<script>
import { ref, computed, watch, onUnmounted } from "vue";
import { useStore } from "vuex";

import RecommendedPosts from "@/components/app/blog/RecommendedPosts.vue";
import SideBar from "@/components/app/blog/SideBar.vue";

export default {
  props: ["id"],
  components: { SideBar, RecommendedPosts },
  setup(props) {
    const store = useStore();
    let post = ref({});
    post.value = ref({id: 0});
    let postImageLarge = ref('');
    let postImageMedium = ref('');
    let publisherPhoto = ref('');

    watch(post, (post) => {
      postImageLarge.value = require('@/assets/images/posts/' + post.value.images[0].large_image).default;
      postImageMedium.value = require('@/assets/images/posts/' + post.value.images[0].medium_image).default;
      publisherPhoto.value = require('@/assets/images/users/' + post.value.publisher.photo[0].small_image).default;
    })
    
    const loaded = ref(false);
    const loadData = async (id) => {
      loaded.value = false;
      await store.dispatch("blog/fetchOnePost", id);

      loaded.value = true;
      await store.dispatch("blog/fetchRecommendedPosts");

      post.value = computed(() => store.getters["blog/getCurPost"]);
    };

    loadData(props.id);
    watch(props, (value) => {
      store.dispatch("blog/resetCurPost");
      loadData(value.id);
    });

    onUnmounted(() => {
      store.dispatch("blog/resetCurPost");
    });

    const recommendedPosts = computed(
      () => store.getters["blog/getRecommendedPosts"]
    );

    


    

    return {
      post,
      recommendedPosts,
      loaded,
      postImageLarge,
      postImageMedium,
      publisherPhoto
    };
  },
};
</script>

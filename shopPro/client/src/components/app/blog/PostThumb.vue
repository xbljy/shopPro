<template>
  <router-link
    :to="'/blog/' + post.id"
    class="post__thumb"
    v-if="post && post.id"
  >
    <img :src="postImage" alt="post" />
    <h4 class="heading--h4">{{ post.title }}</h4>
    <div class="post__time">
      <svg class="post__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-clock"></use>
      </svg>
      <time class="post__time--format"
        >{{ new Date(post.createdAt).toLocaleString() }}
      </time>
    </div>
  </router-link>
</template>

<script>
export default {
  props: ["post"],
  setup(props) {
    const postImage = require('@/assets/images/posts/' + props.post.coverImage[0].small_image).default;
    const post = props.post;
    return {
      postImage,
      post
    }
  }
};
</script>

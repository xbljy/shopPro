<template>
  <section
    class="post"
    @mousedown="drag = false"
    @mousemove="drag = true"
    @mouseup="drag ? (drag = false) : navigate()"
  >
    <img
      :src="postImage"
      alt=""
      class="post__image"
    />
    <h4 class="heading--h4">{{ post.title }}</h4>
    <p class="post__summary">{{ formatSummary(post.summary) }}</p>
    <div class="post__publisher">
      <div class="post__publisher--img__div">
        <img
          :src="publisherPhoto"
          alt=""
          class="post__publisher--img"
        />
      </div>
      <h6 class="heading--h6">{{ post.publisher.name }}</h6>
    </div>

    <div class="post__time">
      <svg class="post__icon">
        <use xlink:href="@/assets/images/sprite.svg#icon-clock"></use>
      </svg>
      <time class="post__time--format">
        {{ new Date(post.createdAt).toLocaleString().split(",")[0] }}
      </time>
    </div>
  </section>
</template>

<script>
import { useRouter } from "vue-router";
export default {
  props: ["post"],
  setup(props) {
    const router = useRouter();

    const navigate = () => {
      router.push(`/blog/${props.post.id}`);
    };

    const formatSummary = (summary) => {
      let text = "";
      text = summary.split("").splice(0, 70).join("");

      return text;
    };

    const postImage = require('@/assets/images/posts/' + props.post.coverImage[0].medium_image).default;
    const publisherPhoto = require('@/assets/images/users/' + props.post.publisher.photo[0].small_image).default;

    return {
      navigate,
      formatSummary,
      postImage,
      publisherPhoto
    };
  },
};
</script>

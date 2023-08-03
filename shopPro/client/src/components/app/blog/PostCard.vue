<template>
  <section
    v-if="post"
    class="post u-margin-bottom-big"
    :class="{ 'post--2': type == 'style-2', 'post--3': type == 'style-3' }"
    @mousedown="drag = false"
    @mousemove="drag = true"
    @mouseup="drag ? (drag = false) : navigate($event)"
  >
    <base-button
      class="post__pen"
      @click="togglePinned(post.id, post.pinned)"
      v-if="isUserAdmin"
    >
      <template #content>
        <svg
          class="post__pen--icon"
          :class="{ active: post.pinned, rotate: postIsBeingToggled }"
        >
          <use
            xlink:href="@/assets/images/sprite.svg#icon-bookmark1"
            v-show="!postIsBeingToggled"
          />
          <use
            xlink:href="@/assets/images/sprite.svg#icon-loader"
            v-show="postIsBeingToggled"
          />
        </svg>
      </template>
    </base-button>

    <img
      :src="postImage"
      alt=""
      class="post__image"
    />
    <ul class="tags">
      <li class="tag">健康</li>
    </ul>
    <h4 class="heading--h4">{{ post.title }}</h4>
    <p class="post__summary">
      {{ post.summary }}
    </p>
    <div class="post__data">
      <div class="post__publisher">
        <div class="post__publisher--img__div">
          <img
            :src="publisherPhoto"
            alt="user image"
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
          {{ new Date(post.createdAt).toLocaleString() }}
        </time>
      </div>
    </div>
  </section>
</template>

<script>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  props: ["type", "post"],
  setup(props) {
    const store = useStore();
    const router = useRouter();

    const navigate = (e) => {
      if (
        Array.from(e.target.classList).find((curClass) =>
          curClass.startsWith("post__pen")
        )
      )
        return;
      router.push("/blog/" + props.post.id);
    };

    const postImage = require('@/assets/images/posts/' + props.post.coverImage[0].large_image).default;
    const publisherPhoto = require('@/assets/images/users/' + props.post.publisher.photo[0].small_image).default;

    const isUserAdmin = computed(() => store.getters["auth/isUserAdmin"]);

    const postIsBeingToggled = ref(false);
    const togglePinned = async (id, curStatus) => {
      if (postIsBeingToggled.value) return;
      postIsBeingToggled.value = true;
      await store.dispatch("blog/setPinnedPost", {
        postId: id,
        pinned: !curStatus,
      });
      postIsBeingToggled.value = false;
    };
    return {
      navigate,
      togglePinned,
      postIsBeingToggled,
      isUserAdmin,
      postImage,
      publisherPhoto
    };
  },
};
</script>

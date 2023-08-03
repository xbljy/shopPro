<template>
  <div class="dashboard__container">
    <div class="u-padding-left-small">
      <div class="admin__controller_bar">
        <button class="btn btn--square" @click="openAddPostPopUp()">
          <svg class="btn__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-plus1" />
          </svg>

          发布文章
        </button>
      </div>

      <table class="table billing__description u-margin-top-small">
        <tr class="table__row table__header">
          <th class="table__heading table__heading--wide">标题</th>
          <th class="table__heading">作者</th>
          <th class="table__heading">时间</th>
          <th class="table__heading table__heading--small">修改</th>
          <th class="table__heading table__heading--small">删除</th>
        </tr>

        <infinite-scroll
          :items="posts"
          :type="'table'"
          :reachedMax="reachedMax"
          :loading="itemsLoading"
          :loaded="itemsLoaded"
          @reached-bottom="fetchMorePosts($event)"
          :classes="'table__row'"
        >
          <template #item="{ item }">
            <td class="table__data table__data--wide bold">
              <img
                v-if="item.images && item.images.length > 0"
                :src="require('@/assets/images/posts/' + item.images[0].small_image).default"
                alt=""
              />
              <span> {{ item.title }}</span>
            </td>
            <td class="table__data">{{ item.publisher.name }}</td>

            <td class="table__data">
              {{ new Date(item.createdAt).toLocaleString().split(",")[0] }}
            </td>

            <td class="table__data table__data--small">
              <button class="table__btn" @click="openEditPostPopUp(item.id)">
                <svg class="table__btn--icon">
                  <use xlink:href="@/assets/images/sprite.svg#icon-edit" />
                </svg>
              </button>
            </td>

            <td class="table__data table__data--small">
              <button
                class="table__btn"
                @click="openConfirmDeletePopup(item.id)"
              >
                <svg
                  class="table__btn--icon table__btn--icon--red table__btn--icon--small"
                >
                  <use xlink:href="@/assets/images/sprite.svg#icon-cross" />
                </svg>
              </button>
            </td>
          </template>
        </infinite-scroll>
      </table>

      <post-form ref="addPostComponent" :type="'create'"></post-form>
      <post-form ref="editPostComponent" :type="'edit'"></post-form>

      <confirm-popup
        ref="confirmComponent"
        @ProcessConfirmed="deletePost"
      ></confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";

import PostForm from "@/components/admin/blog/PostForm.vue";
export default {
  components: {
    PostForm,
  },
  setup() {
    const store = useStore();

    const query = reactive({
      sort: "",
    });
    const posts = computed(() => store.getters["blog/getAllPosts"]);

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    const loadAllPosts = async () => {
      itemsLoaded.value = false;
      itemsLoading.value = true;
      await store.dispatch("blog/fetchPosts", query);
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    loadAllPosts();

    const addPostComponent = ref(null);

    const openAddPostPopUp = () => {
      addPostComponent.value.openForm();
    };

    const confirmComponent = ref(null);
    const curPostId = ref("");

    const openConfirmDeletePopup = (id) => {
      curPostId.value = id;
      confirmComponent.value.openConfirmPopup();
    };

    const closeConfirmPopup = () => {
      confirmComponent.value.closeConfirmPopup();
    };

    const deletePost = async () => {
      if (!curPostId.value) return;
      confirmComponent.value.setLoadingStatus(true);
      await store.dispatch("blog/deletePost", curPostId.value);
      curPostId.value = "";
      confirmComponent.value.setLoadingStatus(false);
      closeConfirmPopup();
    };

    // 修改
    const editPostComponent = ref(null);
    const openEditPostPopUp = (id) => {
      editPostComponent.value.openForm();
      editPostComponent.value.setPostId(id);
    };

    const getNumberOfPosts = computed(
      () => store.getters["blog/getNumberOfPosts"]
    );

    const reachedMax = ref(false);
    const fetchMorePosts = async (itemsLength) => {
      if (itemsLoading.value) return;
      console.log("req-sent");
      itemsLoading.value = true;
      await store.dispatch("blog/fetchMorePosts", {
        skip: itemsLength,
        ...query,
      });

      reachedMax.value = getNumberOfPosts.value == itemsLength;

      itemsLoading.value = false;
    };

    return {
      posts,
      addPostComponent,
      openAddPostPopUp,
      deletePost,
      editPostComponent,
      openEditPostPopUp,
      fetchMorePosts,
      reachedMax,

      openConfirmDeletePopup,
      closeConfirmPopup,
      confirmComponent,
      itemsLoading,
      itemsLoaded,
    };
  },
};
</script>

<template>
  <form class="form__style--2 add__item--form custom--form">
    <div class="form__style--2__group rating__div">
      <star-rating
        :rounded-corners="true"
        :increment="0.1"
        v-model:rating="data.rating"
        :star-size="30"
        :border-width="0"
        :padding="5"
        text-class="rating__text"
      ></star-rating>
    </div>

    <div class="form__style--2__group">
      <label class="form__style--2__label add__item--label">评论</label>
      <textarea
        type="text"
        class="form__style--2__textarea add__item--textarea"
        placeholder="输入评论"
        v-model="data.description"
        required
      ></textarea>
    </div>

    <div class="form__group">
      <button
        type="button"
        class="btn btn-small btn-red"
        @click="cancelCreation"
      >
        取消
      </button>
      <button type="button" class="btn btn-small btn-blue" @click="sendData()">
        确定
      </button>
    </div>

    <slot name="content"></slot>
  </form>
</template>

<script>
import { reactive } from "vue";
import StarRating from "vue-star-rating";

export default {
  emits: ["data-provided", "form-canceled"],
  components: { StarRating },
  props: ["type"],
  setup(_, { emit }) {
    const data = reactive({
      rating: 1,
      description: "",
    });

    const setInitialData = (currentData) => {
      for (const prop in currentData) {
        data[prop] = currentData[prop];
      }
    };

    const sendData = async () => {
      if (data.description == "") return;
      emit("data-provided", data);
    };

    const cancelCreation = () => {
      emit("form-canceled");
    };

    return {
      data,
      sendData,
      cancelCreation,
      setInitialData,
    };
  },
};
</script>

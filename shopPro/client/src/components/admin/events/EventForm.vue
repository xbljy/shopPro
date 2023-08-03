<template>
  <base-popup ref="popup">
    <template #content>
      <base-form
        class="form__style--2 add__item--form custom--form"
        @form-closed="closeForm"
        @form-submitted="sendData($event)"
        ref="form"
        :initialData="currentEventData"
      >
        <template #content>
          <div class="form__style--2__group">
            <label class="form__style--2__label add__item--label">标题</label>
            <input
              type="text"
              class="form__style--2__input add__item--input"
              placeholder="请输入活动名称"
              name="title"
              :value="(currentEventData && currentEventData.title) || ''"
            />

            <span class="error__message" v-if="errors.title.invalid">
              {{ errors.title.message }}
            </span>
          </div>
          <div class="form__style--2__group">
            <label class="form__style--2__label add__item--label"
              >开始时间</label
            >
            <input
              type="date"
              class="form__style--2__input add__item--input"
              name="startsIn"
              :value="(currentEventData && currentEventData.startsIn) || ''"
            />

            <span class="error__message" v-if="errors.startsIn.invalid">
              {{ errors.startsIn.message }}
            </span>
          </div>

          <div class="form__style--2__group">
            <label class="form__style--2__label add__item--label"
              >结束时间</label
            >
            <input
              type="date"
              class="form__style--2__input add__item--input"
              name="endsIn"
              :value="(currentEventData && currentEventData.endsIn) || ''"
            />

            <span class="error__message" v-if="errors.endsIn.invalid">
              {{ errors.endsIn.message }}
            </span>
          </div>

          <div class="form__style--2__group">
            <label class="form__style--2__label add__item--label">简介</label>
            <textarea
              type="text"
              class="form__style--2__textarea add__item--textarea"
              placeholder="请输入简介"
              name="summary"
              :value="(currentEventData && currentEventData.summary) || ''"
            ></textarea>

            <span class="error__message" v-if="errors.summary.invalid">
              {{ errors.summary.message }}
            </span>
          </div>

          <div class="form__style--2__group">
            <label class="form__style--2__label add__item--label">文章</label>
            <textarea
              type="text"
              class="form__style--2__textarea add__item--textarea"
              placeholder="请输入内容"
              name="description"
              :value="(currentEventData && currentEventData.description) || ''"
            ></textarea>

            <span class="error__message" v-if="errors.description.invalid">
              {{ errors.description.message }}
            </span>
          </div>

          <div class="form__style--2__group">
            <span>封面图片</span>
            <label
              :for="type + 'eventCoverImage'"
              class="photo__label add__item--photo_label"
            >
              选择图片
            </label>

            <input
              :id="type + 'eventCoverImage'"
              type="file"
              class="form__style--2__input"
              name="coverImage"
            />

            <span class="error__message" v-if="errors.coverImage.invalid">
              {{ errors.coverImage.message }}
            </span>
          </div>
        </template>
      </base-form>
    </template>
  </base-popup>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";

export default {
  emits: ["data-provided", "form-canceled"],
  components: {},
  props: ["type"],
  setup(props) {
    const store = useStore();
    const popup = ref(null);
    const form = ref(null);

    const eventId = ref(undefined);
    const setEventId = (id) => {
      eventId.value = id;
    };

    const currentEventData = computed(() =>
      store.getters["events/getOneEvent"](eventId.value)
    );

    const errors = reactive({
      title: {
        invalid: false,
        message: "请输入标题",
      },

      summary: {
        invalid: false,
        message: "请选择简介",
      },

      startsIn: {
        invalid: false,
        message: "请选择开始时间",
      },

      endsIn: {
        invalid: false,
        message: "请选择结束时间",
      },

      description: {
        invalid: false,
        message: "请输入文章内容",
      },
      coverImage: {
        invalid: false,
        message: "请选择封面图片",
      },

      invalid: false,
    });

    const resetErrors = () => {
      for (const prop in errors) {
        if (prop == "invalid") errors.invalid = false;
        else errors[prop].invalid = false;
      }
    };

    const validateData = (requiredInputs, providedData) => {
      resetErrors();
      for (const prop of requiredInputs) {
        if (!providedData[prop]) {
          errors[prop].invalid = true;
          errors.invalid = true;
        }
      }
    };

    const sendData = async (data) => {
      form.value.setLoadingStatus(true);
      let requiredInputs;

      switch (props.type) {
        case "edit": {
          await store.dispatch("events/updateOneEvent", {
            eventId: eventId.value,
            updatedEventData: data,
          });
          break;
        }

        case "create": {
          requiredInputs = [
            "title",
            "startsIn",
            "endsIn",
            "summary",
            "description",
            "coverImage",
          ];

          validateData(requiredInputs, data);
          if (errors.invalid) {
            form.value.setLoadingStatus(false);
            return;
          }
          await store.dispatch("events/createEvent", data);
          break;
        }
        default:
          break;
      }
      form.value.setLoadingStatus(false);
    };

    const closeForm = () => {
      popup.value.closePopup();
    };

    const openForm = () => {
      popup.value.openPopup();
    };

    return {
      errors,
      popup,
      form,
      closeForm,
      openForm,
      sendData,
      setEventId,
      currentEventData,
    };
  },
};
</script>

<template>
  <div class="dashboard__container">
    <div class="u-padding-left-small">
      <div class="admin__controller_bar">
        <button class="btn btn--square" @click="openAddEventPopUp()">
          <svg class="btn__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-plus1" />
          </svg>
          发布活动
        </button>
      </div>
      <table class="table billing__description u-margin-top-small">
        <tr class="table__row table__header">
          <th class="table__heading table__heading--wide">标题</th>
          <th class="table__heading">开始时间</th>
          <th class="table__heading">结束时间</th>
          <th class="table__heading table__heading--small">修改</th>
          <th class="table__heading table__heading--small">删除</th>
        </tr>
        <tr class="table__row" v-for="event in events" :key="event._id">
          <td class="table__data table__data--wide bold uppercase">
            <img
              v-if="event.coverImage && event.coverImage.length > 0"
              :src="genEventImageSmall(event)"
              alt=""
            />
            <span> {{ event.title }}</span>
          </td>

          <td class="table__data">
            {{ new Date(event.startsIn).toLocaleString().split(",")[0] }}
          </td>

          <td class="table__data">
            {{ new Date(event.endsIn).toLocaleString().split(",")[0] }}
          </td>

          <td class="table__data table__data--small">
            <button class="table__btn" @click="openEditEventPopUp(event._id)">
              <svg class="table__btn--icon">
                <use xlink:href="@/assets/images/sprite.svg#icon-edit" />
              </svg>
            </button>
          </td>

          <td class="table__data table__data--small table__data--small">
            <button class="table__btn" @click="openConfirmPopup(event._id)">
              <svg
                class="table__btn--icon table__btn--icon--red table__btn--icon--small"
              >
                <use xlink:href="@/assets/images/sprite.svg#icon-cross" />
              </svg>
            </button>
          </td>
        </tr>
      </table>

      <event-form ref="addEventComponent" :type="'create'"></event-form>
      <event-form ref="editEventComponent" :type="'edit'"></event-form>

      <confirm-popup
        ref="confirmComponent"
        @ProcessConfirmed="deleteOneEvent"
      ></confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import EventForm from "@/components/admin/events/EventForm.vue";
export default {
  components: {
    EventForm,
  },
  setup() {
    const store = useStore();

    // 获取所有活动
    const events = computed(() => store.getters["events/getAllEvents"]);
    const loadAllEvents = async () => {
      await store.dispatch("events/fetchEvents");
    };

    loadAllEvents();

    const addEventComponent = ref(null);

    const openAddEventPopUp = () => {
      addEventComponent.value.openForm();
    };

    const confirmComponent = ref(null);
    const curEventId = ref("");

    const openConfirmPopup = (id) => {
      curEventId.value = id;
      confirmComponent.value.openConfirmPopup();
    };

    const closeConfirmPopup = () => {
      confirmComponent.value.closeConfirmPopup();
    };

    const deleteOneEvent = async () => {
      if (!curEventId.value) return;

      confirmComponent.value.setLoadingStatus(true);

      await store.dispatch("events/deleteOneEvent", curEventId.value);

      confirmComponent.value.setLoadingStatus(false);

      curEventId.value = "";

      closeConfirmPopup();
    };

    const editEventComponent = ref(null);
    const openEditEventPopUp = (id) => {
      editEventComponent.value.openForm();
      editEventComponent.value.setEventId(id);
    };

    const genEventImageSmall = event => require('@/assets/images/events/' + event.coverImage[0].small_image).default;

    return {
      events,
      addEventComponent,
      openAddEventPopUp,
      editEventComponent,
      openEditEventPopUp,

      confirmComponent,
      openConfirmPopup,
      closeConfirmPopup,
      deleteOneEvent,
      genEventImageSmall
    };
  },
};
</script>

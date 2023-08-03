<template>
  <div class="dashboard__container">
    <div class="u-padding-left-small">
      <div class="admin__controller_bar">
        <button class="btn btn--square" @click="openAddLocationPopUp()">
          <svg class="btn__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-plus1" />
          </svg>

          添加地址
        </button>
      </div>

      <table class="table billing__description u-margin-top-small">
        <tr class="table__row table__header">
          <th class="table__heading">地址</th>
          <th class="table__heading">详细地址</th>
          <th class="table__heading">经度</th>
          <th class="table__heading">纬度</th>
          <th class="table__heading min-width-medium">手机号</th>
          <th class="table__heading table__heading--small">删除</th>
        </tr>

        <tr
          class="table__row"
          v-for="location in locations"
          :key="location._id"
        >
          <td class="table__data bold">
            {{ location.information.address }}
          </td>
          <td class="table__data">{{ location.information.description }}</td>
          <td class="table__data">
            {{ Math.floor(location.information.coordinates[0]) }}
          </td>
          <td class="table__data">
            {{ Math.floor(location.information.coordinates[1]) }}
          </td>
          <td class="table__data min-width-medium">{{ location.phone }}</td>

          <td class="table__data table__data--small">
            <button
              class="table__btn"
              @click="openConfirmDeletePopup(location._id)"
            >
              <svg
                class="table__btn--icon table__btn--icon--red table__btn--icon--small"
              >
                <use xlink:href="@/assets/images/sprite.svg#icon-cross" />
              </svg>
            </button>
          </td>
        </tr>
      </table>

      <location-form
        ref="locationFormComponent"
        :type="'create'"
      ></location-form>
      <confirm-popup
        ref="confirmComponent"
        @ProcessConfirmed="deleteLocation"
      ></confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";

import LocationForm from "@/components/admin/locations/LocationForm.vue";
export default {
  components: {
    LocationForm,
  },
  setup() {
    const store = useStore();

    // 获取所有地址
    const locations = computed(
      () => store.getters["locations/getAllLocations"]
    );

    const loadAllLocations = async () => {
      await store.dispatch("locations/fetchLocations");
    };

    loadAllLocations();

    const locationFormComponent = ref(null);

    const openAddLocationPopUp = () => {
      locationFormComponent.value.openForm();
    };

    const confirmComponent = ref(null);
    const curLocationId = ref("");

    const openConfirmDeletePopup = (id) => {
      curLocationId.value = id;
      confirmComponent.value.openConfirmPopup();
    };

    const closeConfirmPopup = () => {
      confirmComponent.value.closeConfirmPopup();
    };

    const deleteLocation = async () => {
      if (!curLocationId.value) return;
      confirmComponent.value.setLoadingStatus(true);
      await store.dispatch("locations/deleteOneLocation", curLocationId.value);
      curLocationId.value = "";
      confirmComponent.value.setLoadingStatus(false);
      closeConfirmPopup();
    };

    return {
      locations,
      locationFormComponent,
      openAddLocationPopUp,
      deleteLocation,

      openConfirmDeletePopup,
      closeConfirmPopup,
      confirmComponent,
    };
  },
};
</script>

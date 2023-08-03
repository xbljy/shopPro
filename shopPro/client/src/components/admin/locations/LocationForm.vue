<template>
  <base-popup ref="popUp" @popup-closed="closePopup">
    <template #content>
      <div class="add_location__content">
        <div class="add_location__map" id="addLocationMap"></div>
        <baidu-map-input :map="map"/>
        <base-form
          class="form__style--2 custom--form fullwidth"
          ref="form"
          @form-closed="closeForm"
          @form-submitted="createLocation($event)"
        >
          <template #content>
            <div class="form__style--2__group">
              <label class="form__style--2__label">地址</label>
              <input
                type="text"
                class="form__style--2__input"
                name="address"
                placeholder="请输入地址"
                required
              />
            </div>

            <div class="form__style--2__group">
              <label class="form__style--2__label">详细地址</label>
              <input
                type="text"
                class="form__style--2__input"
                name="description"
                placeholder="请输入详细地址"
                required
              />
            </div>

            <div class="form__style--2__group">
              <label class="form__style--2__label">手机号</label>
              <input
                type="tel"
                class="form__style--2__input"
                @input="acceptNumber"
                name="phone"
                placeholder="请输入手机号"
                required
              />
            </div>
          </template>
          <template #controllers="{ loading }">
            <div class="form__style--2__group">
              <base-button
                type="submit"
                class="btn-blue"
                :innerText="'保存'"
                :loading="loading"
                :disabled="loading"
              ></base-button>
            </div>
          </template>
        </base-form>
      </div>
    </template>
  </base-popup>
</template>
<script>
import { ref, reactive, onMounted } from "vue";
import { useStore } from "vuex";

import { Alert } from "@/utils/Alert.js";
import BaiduMapInput from "@/components/shared/BaiduMapInput"

export default {
  components: {
    BaiduMapInput
  },
  setup() {
    const store = useStore();

    const popUp = ref(null);
    const form = ref(null);

    const closeForm = () => {
      popUp.value.closePopup();
    };

    const openForm = () => {
      popUp.value.openPopup();
    };

    const createLocation = async ({ address, description, phone }) => {
      if (locationData.information.coordinates.length < 1) return;
      locationData.information.address = address;
      locationData.information.description = description;
      locationData.phone = phone;

      form.value.setLoadingStatus(true);
      await store.dispatch("locations/createLocation", locationData);
      form.value.setLoadingStatus(false);
    };

    const closePopup = () => {
      console.log("popup closed");
    };

    // 地址数据
    const locationData = reactive({
      information: {
        address: "",
        description: "",
        coordinates: []
      },

      phone: ""
    });

    // 验证并格式化手机号格式
    const acceptNumber = (e) => {
      var x = e.target.value
        .replace(/\D/g, "")
        .match(/(\d{0,3})(\d{0,4})(\d{0,4})/);

      e.target.value = !x[2]
        ? x[1]
        : x[1] + "-" + x[2] + (x[3] ? "-" + x[3] : "");
    };

    let map = ref(null)
    let point, geolocation;
    onMounted(() => {
      try {
        // 初始化
        if(!window.BMapGL.Map) return;
        map.value = new window.BMapGL.Map("addLocationMap"); // 创建Map实例
        geolocation = new window.BMapGL.Geolocation();
        geolocation.enableSDKLocation();
        geolocation.getCurrentPosition(function(r){
          var mk = new window.BMapGL.Marker(r.point);
          map.value.addOverlay(mk);
          map.value.panTo(r.point);

          var pt = r.point;   
          map.value.panTo(pt);//移动地图中心点
          locationData.information.coordinates[0] = r.point.lng;
          locationData.information.coordinates[1] = r.point.lat;
          point = new window.BMapGL.Point(r.point.lng, r.point.lat); // 创建点坐标
          map.value.centerAndZoom(point, 10);
          map.value.enableScrollWheelZoom(); // 启用滚轮放大缩小
        });
      } catch(err) {
        console.log(err)
        Alert("error", "定位错误", 2000)
      }
      // 绑定点击事件
      map.value.on("click", (e) => {
        console.log(e);
      });

      // 加载后重置地图尺寸
      map.value.on("load", function () {
        map.value.resize();
      });
    });

    return {
      popUp,
      form,
      closeForm,
      openForm,
      createLocation,
      closePopup,
      acceptNumber,
      locationData,
      map
    };
  },
};
</script>

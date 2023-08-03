<template>
  <section class="map u-margin-top-big">
    <h2 class="heading--h2__style--6">地址管理</h2>
    <baidu-map-input :map="map"/>
    <div id="addLocationMap"></div>

    <div class="map_t map_t1"></div>
    <div class="map_t map_t2"></div>
    <div class="map_t map_t3"></div>
  </section>
</template>

<script>
import { computed, onBeforeMount, onMounted, ref, reactive } from "vue";
import { useStore } from "vuex";
import { Alert } from "@/utils/Alert.js";

import BaiduMapInput from "@/components/shared/BaiduMapInput"

export default {
  components: {BaiduMapInput},
  emit: ["map-loaded"],
  setup(_, { emit }) {
    const store = useStore();

    const mapLocations = computed(
      () => store.getters["locations/getAllLocations"]
    );

    // 地址数据
    const locationData = reactive({
      information: {
        address: "",
        description: "",
        coordinates: []
      },

      phone: ""
    });

    onBeforeMount(() => {
      const loadLocations = async () => {
        if (Object.keys(mapLocations.value).length > 0) return;
        await store.dispatch("locations/fetchLocations");
      };
      loadLocations();
    });
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
      map
    };
  },
};
</script>

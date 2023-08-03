<template>
  <div class="baidumap-ctrl-top-right">
    <div class="baidumap-ctrl-geocoder baidumap-ctrl">
      <svg
        class="baidumap-ctrl-geocoder--icon baidumap-ctrl-geocoder--icon-search"
      >
        <use xlink:href="@/assets/images/sprite.svg#icon-baidumap-search"></use>
      </svg>
      <input
        type="text"
        id="areaSearch"
        class="baidumap-ctrl-geocoder--input"
        placeholder="请输入要查询的地名"
        aria-label="请输入要查询的地名"        
      />
      <div class="suggestions-wrapper">
        <ul class="suggestions" v-show="areaList.length > 0">
          <li v-for="(area, index) in areaList" :key="index" @click="selectArea(area)">
            <a>
              <div class="baidumap-ctrl-geocoder--suggestion">
                <div class="baidumap-ctrl-geocoder--suggestion-address">
                  {{area}}
                </div>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="baidumap-ctrl-geocoder--pin-right">
        <button
          aria-label="Clear"
          class="baidumap-ctrl-geocoder--button"
          style="display: block"
          v-show="area && area.length > 0"
          @click="emptyInput"
        >
          <svg
            class="baidumap-ctrl-geocoder--icon baidumap-ctrl-geocoder--icon-close"
          >
            <use xlink:href="@/assets/images/sprite.svg#icon-baidumap-close"></use>
          </svg>
        </button>
        <svg
          class="baidumap-ctrl-geocoder--icon baidumap-ctrl-geocoder--icon-loading"
        >
          <use xlink:href="@/assets/images/sprite.svg#icon-baidumap-loading"></use>
        </svg>
      </div>
    </div>
  </div>
</template>
<script>
import { onMounted, onUpdated, ref } from "vue";
export default {
  props: ["map"],
  setup(props) {

    let area = ref("");
    let detailArea = ref("");
    let areaList = ref([]);
    let local;

    const areaInput = () => {
      if (area.value.trim().length == 0) return;
      searchArea(area.value)
    };

    const emptyInput = () => {
      area.value = ""
    };

    const searchArea = (keyword) => {
      let script = null;
      script = document.querySelector('#baiduSut');
      if (script) {
        document.body.removeChild(script);
      }
      script = document.createElement('script');
      script.id = 'baiduSut';
      script.src = 'http://suggestion.baidu.com/su?callback=window.baidu.sug&wd='+ keyword;
      document.body.appendChild(script);
    }

    const showAreaList = (baiduSearchMap) => {
      areaList.value = baiduSearchMap.s;
      console.log(areaList)
    }

    const selectArea = (selectArea) => {
      console.log(selectArea);
      area.value = selectArea;
      areaList.value = [];
    }

    onMounted(() => {
      window.baidu = {};
      window.baidu.sug = showAreaList;
    })

    onUpdated(() => {
      //建立一个自动完成的对象
      let ac = new window.BMapGL.Autocomplete({"input" : "areaSearch" ,"location" : props.map});
      //鼠标点击下拉列表后的事件
      ac.addEventListener("onconfirm", function(e) {
        console.log(e);
        let _value = e.item.value;
		    detailArea.value = _value.province +  _value.city +  _value.district +  _value.street +  _value.business;
        setPlace();
      });
    })

    const setPlace = () => {
      props.map.clearOverlays();    //清除地图上所有覆盖物
      
      local = new window.BMapGL.LocalSearch(props.map, { //智能搜索
        onSearchComplete: myFun
      });
      local.search(detailArea.value);
    }

    const myFun = () => {
      let res = local.getResults();
      var pp = res.getPoi(0).point;    //获取第一个智能搜索的结果
      props.map.centerAndZoom(pp, 18);
      props.map.addOverlay(new window.BMapGL.Marker(pp));    //添加标注
    }

    return {
      areaInput,
      area,
      emptyInput,
      selectArea,
      areaList
    };
  }
};
</script>

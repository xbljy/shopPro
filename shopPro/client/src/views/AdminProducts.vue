<template>
  <div class="dashboard__container">
    <div class="u-padding-left-small">
      <ul class="statistic__list">
        <li class="statistic__item">
          <h5 class="heading--h5__style--2">总金额</h5>
          <span class="statistic__number"
            ><span class="statistic__symbol"> ¥</span>140</span
          >
          <img src="@/assets/images/spent.png" alt="" class="statistic__image" />
        </li>

        <li class="statistic__item">
          <h5 class="heading--h5__style--2">今日销量</h5>
          <span class="statistic__number">105</span>
          <img src="@/assets/images/refund.png" alt="" class="statistic__image" />
        </li>

        <li class="statistic__item">
          <h5 class="heading--h5__style--2">产品数量</h5>
          <span class="statistic__number">50</span>
          <img src="@/assets/images/orders.png" alt="" class="statistic__image" />
        </li>
      </ul>

      <div class="admin__controller_bar">
        <button class="btn btn--square" @click="openAddProductPopup()">
          <svg class="btn__icon">
            <use xlink:href="@/assets/images/sprite.svg#icon-plus1" />
          </svg>

          上架商品
        </button>
        <section class="admin__controller_bar__section">
          <h4 class="heading--h4">排序</h4>
          <SelectBox
            @value-updated="updateFilterQuery('sort', $event)"
            ref="selectBox"
            :values="sortValues"
            :disableSelection="itemsLoading"
          ></SelectBox>
        </section>

        <section class="admin__controller_bar__section">
          <h4 class="heading--h4">类目</h4>
          <SelectBox
            @value-updated="updateFilterQuery('category', $event)"
            ref="selectBox"
            :values="categories"
            :disableSelection="itemsLoading"
          ></SelectBox>
        </section>
      </div>

      <table class="table billing__description u-margin-top-small">
        <tr class="table__row table__header">
          <th class="table__heading">商品</th>
          <th class="table__heading">价格</th>
          <th class="table__heading">数量</th>
          <th class="table__heading">属性</th>
          <th class="table__heading table__heading--small">修改</th>
          <th class="table__heading table__heading--small">删除</th>
        </tr>
        <infinite-scroll
          :items="products"
          :type="'table'"
          :loading="itemsLoading"
          :loaded="itemsLoaded"
          :reachedMax="reachedMax"
          @reached-bottom="fetchMoreProducts($event)"
          :classes="'table__row'"
        >
          <template #item="{ item }">
            <td class="table__data bold">
              <img
                v-if="item.properties.length > 0"
                :src="genImage(item)"
                alt=""
              />
              {{ item.name }}
            </td>
            <td class="table__data">
              ¥{{ item.properties[0] ? item.properties[0].price : "" }}
            </td>

            <td class="table__data">{{ calcQuantities(item.properties) }}</td>
            <td class="table__data">
              <ul class="property--square__list" v-if="item.properties.length > 0">
                <li
                  class="property--square__item"
                  v-for="property in item.properties"
                  :key="property.propertyName"
                  @click="openEditProperty(item, property)"
                >{{property.propertyName}}</li>
              </ul>
            </td>
            <td class="table__data table__data--small edit">
              <button class="table__btn" @click="openEditProductPopup(item.id)">
                <svg class="table__btn--icon">
                  <use xlink:href="@/assets/images/sprite.svg#icon-edit" />
                </svg>
              </button>
            </td>

            <td class="table__data table__data--small close">
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
      <add-product ref="addProductComponent"></add-product>
      <edit-product ref="editProductComponent"></edit-product>
      <edit-property ref="editPropertyComponent"></edit-property>
      <confirm-popup
        ref="confirmComponent"
        @ProcessConfirmed="deleteProduct"
      ></confirm-popup>
    </div>
  </div>
</template>

<script>
import { ref, reactive, computed } from "vue";
import { useStore } from "vuex";

import AddProduct from "@/components/admin/products/AddProduct.vue";
import EditProduct from "@/components/admin/products/EditProduct.vue";
import EditProperty from "@/components/admin/products/EditProperty.vue";
export default {
  components: {
    AddProduct,
    EditProduct,
    EditProperty,
  },
  setup() {
    const store = useStore();
    const query = reactive({
      category: "",
      sort: "",
      limit: 10,
    });

    const itemsLoading = ref(false);
    const itemsLoaded = ref(false);

    const genImage = (item) => {
      return require('@/assets/images/products/' + item.properties[0].images[0].small_image).default;
    }

    const updateFilterQuery = async (prop, val) => {
      if (itemsLoading.value) return;

      reachedMax.value = false;
      if (prop == "category" && val == "all") val = "";
      query[prop] = val;
      await loadAllProducts();
    };

    // 获取所有商品
    const products = computed(() => store.getters["products/getProducts"]);

    const loadAllProducts = async () => {
      itemsLoaded.value = false;
      itemsLoading.value = true;
      await store.dispatch("products/fetchProductsForAdmin", query);
      itemsLoading.value = false;
      itemsLoaded.value = true;
    };

    loadAllProducts();

    // 商品排序
    const sortValues = ["价格", "最新", "评价"];

    const categories = store.getters["products/getCategory"];

    const getNumberOfProducts = computed(
      () => store.getters["products/getNumberOfProductsForAdmin"]
    );

    const reachedMax = ref(false);
    const fetchMoreProducts = async (itemsLength) => {
      if (itemsLoading.value) {
        return;
      }

      itemsLoading.value = true;
      await store.dispatch("products/fetchMoreProductsForAdmin", {
        skip: itemsLength,
        ...query,
      });

      reachedMax.value = getNumberOfProducts.value == itemsLength;

      itemsLoading.value = false;
    };

    const addProductComponent = ref(null);
    const editProductComponent = ref(null);
    const openAddProductPopup = () => {
      addProductComponent.value.openPopup();
    };

    const openEditProductPopup = (id) => {
      editProductComponent.value.openPopup(id);
    };

    // Confirm popup
    const confirmComponent = ref(null);
    const curProductId = ref("");

    const openConfirmDeletePopup = (id) => {
      curProductId.value = id;
      confirmComponent.value.openConfirmPopup();
    };

    const closeConfirmPopup = () => {
      confirmComponent.value.closeConfirmPopup();
    };

    const deleteProduct = async () => {
      if (!curProductId.value) return;
      confirmComponent.value.setLoadingStatus(true);
      await store.dispatch("products/deleteProduct", curProductId.value);
      curProductId.value = "";
      confirmComponent.value.setLoadingStatus(false);
      closeConfirmPopup();
    };

    const getQuantityOfSizesForOneProperty = (property) => {
      if (property.quantity > 0) return property.quantity;
      let res = 0;
      property.sizes.forEach((size) => {
        res += size.quantity;
      });
      return res;
    };
    const calcQuantities = (properties) => {
      let res = 0;
      properties.forEach((property) => {
        res += getQuantityOfSizesForOneProperty(property);
      });

      return res;
    };

    const editPropertyComponent = ref(null);
    const openEditProperty = (product, property) => {
      editPropertyComponent.value.setSelectedProperty(property);
      editPropertyComponent.value.setProduct(product);
      editPropertyComponent.value.openPopup(product);
    };

    return {
      editPropertyComponent,
      openEditProperty,

      openEditProductPopup,
      openAddProductPopup,

      addProductComponent,
      editProductComponent,
      categories,
      sortValues,
      products,
      deleteProduct,
      updateFilterQuery,
      calcQuantities,
      fetchMoreProducts,
      reachedMax,
      openConfirmDeletePopup,
      closeConfirmPopup,
      confirmComponent,
      itemsLoading,
      itemsLoaded,
      genImage
    };
  },
};
</script>

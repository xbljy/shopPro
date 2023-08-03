import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { Alert } from "@/utils/Alert.js";
export function useBag(product, initialCard) {
  const store = useStore();
  const router = useRouter();

  const isUserExists = computed(() => store.getters["auth/isUserExists"]);

  // 添加到购物车的方法
  // custom => 只选择颜色
  // regular => 选择颜色和尺寸
  const typeOfAddingToBag = computed(() => {
    if (product.category == "accessories" || product.category == "bags") {
      return "custom";
    }
    return "regular";
  });

  // --------------- 处理尺寸 ---------------
  const initialSize = () => {
    if (initialCard && initialCard.size) {
      return initialCard.size;
    } else if (typeOfAddingToBag.value == "regular") {
      let sizes = product.properties[0].sizes;
      return sizes[0].size;
    }
    return null;
  };

  const selectedSize = ref(initialSize());

  const availableSizes = computed(() => {
    if (typeOfAddingToBag.value == "regular" && selectedProperty.value) {
      return selectedProperty.value.sizes;
    }
    return null;
  });

  const updateSelectedSize = (val) => {
    if (val.quantity) selectedSize.value = val.size;
  };

  // --------------- 颜色处理 ---------------
  const getPropertyDataFromProduct = (propertyName) =>
    product.properties.find((property) => property.propertyName == propertyName);

  const initialSelectedProperty = () => {
    // 获取选中的颜色
    if (initialCard && initialCard.property) {
      return getPropertyDataFromProduct(initialCard.property);
    }
    return product.properties[0];
  };

  const selectedProperty = ref(initialSelectedProperty());
  const selectedPropertyName = ref(selectedProperty.value.propertyName);

  const updateSelectedPropertyMethod = (property) => {
    if (typeOfAddingToBag.value == "custom") {
      if (!property.quantity) return;
      selectedProperty.value = property;
      selectedPropertyName.value = property.propertyName;
    } else {
      selectedProperty.value = property;
      selectedPropertyName.value = property.propertyName;

      // 选择颜色变化时初始化尺寸
      updateSelectedSize(property.sizes[0]);
    }
  };

  // -------------- 商品数量 ------------
  const maxQuantity = computed(() => {
    if (typeOfAddingToBag.value == "custom")
      return selectedProperty.value.quantity;
    return selectedProperty.value.sizes.find((el) => el.size == selectedSize.value)
      .quantity;
  });

  // --------------- 当前购物车处理 ---------------
  const curCard = computed(() => {
    if (
      typeOfAddingToBag.value == "regular" &&
      selectedSize.value &&
      selectedPropertyName.value
    ) {
      return store.getters["bag/isAddedToBag"](
        product.id,
        selectedSize.value,
        selectedPropertyName.value
      );
    } else if (selectedPropertyName.value) {
      return store.getters["bag/isAddedToBagCustom"](
        product.id,
        selectedPropertyName.value
      );
    }
    return false;
  });

  const isCurSelectionAdded = ref(curCard.value ? true : false);

  const numberOfOrders = ref(curCard.value ? curCard.value.numberOfOrders : 1);

  watch(curCard, (value) => {
    console.log("value", value);
    if (value) {
      numberOfOrders.value = value.numberOfOrders;
      isCurSelectionAdded.value = true;
    } else {
      numberOfOrders.value = 1;
      isCurSelectionAdded.value = false;
    }
  });

  // --------------- 购物车api ---------------
  const productIsBeingAdded = ref(false);
  const addProductCustom = async () => {
    if (!isUserExists.value) return router.push("/login");

    if (
      maxQuantity.value < numberOfOrders.value ||
      productIsBeingAdded.value ||
      isCurSelectionAdded.value ||
      !selectedProperty.value ||
      numberOfOrders.value < 1
    )
      return;
    productIsBeingAdded.value = true;

    await store.dispatch("bag/addToBagCustom", {
      product,
      property: selectedProperty.value.propertyName,
      numberOfOrders: numberOfOrders.value,
    });
    productIsBeingAdded.value = false;
  };

  const addProductRegular = async () => {
    if (!isUserExists.value) return router.push("/login");

    if (
      maxQuantity.value < numberOfOrders.value ||
      isCurSelectionAdded.value ||
      productIsBeingAdded.value ||
      !selectedSize.value ||
      !selectedProperty.value ||
      numberOfOrders.value < 1
    )
      return;
    productIsBeingAdded.value = true;
    // 添加到购物车
    await store.dispatch("bag/addToBag", {
      product,
      size: selectedSize.value,
      property: selectedProperty.value.propertyName,
      numberOfOrders: numberOfOrders.value,
    });
    productIsBeingAdded.value = false;
  };

  const toggleProductRegular = async () => {
    if (isCurSelectionAdded.value) {
      await deleteCard(curCard.value.id);
    } else {
      // 添加商品
      await addProductRegular(product);
    }
  };

  const toggleProductCustom = async () => {
    if (isCurSelectionAdded.value) {
      await deleteCard(curCard.value.id);
    } else {
      // 添加商品
      await addProductCustom(product);
    }
  };

  const cardIsBeingDeleted = ref(false);
  const deleteCard = async (id) => {
    if (!isUserExists.value) return router.push("/login");

    if (!id || cardIsBeingDeleted.value) return;
    cardIsBeingDeleted.value = true;
    await store.dispatch("bag/deleteCard", id);
    cardIsBeingDeleted.value = false;
  };

  const ordersNumberIsBeingChanged = ref(false);
  const changeNumberOfOrders = async () => {
    if (!isUserExists.value) return router.push("/login");

    if (maxQuantity.value < numberOfOrders.value) {
      Alert("error", `max quantity is ${maxQuantity.value}`, 1500);
      return;
    }
    if (
      !curCard.value.id ||
      !numberOfOrders.value ||
      curCard.value.numberOfOrders == numberOfOrders.value ||
      ordersNumberIsBeingChanged.value ||
      numberOfOrders.value < 1
    )
      return;

    ordersNumberIsBeingChanged.value = true;

    await store.dispatch("bag/changeNumberOfOrders", {
      cardId: curCard.value.id,
      numberOfOrders: numberOfOrders.value * 1,
    });
    ordersNumberIsBeingChanged.value = false;
  };

  const ordersNumberIsBeingIncreased = ref(false);
  const increaseNumberOfOrders = async (card) => {
    if (!isUserExists.value) return router.push("/login");

    if (!card.id || ordersNumberIsBeingIncreased.value) return;

    let count = numberOfOrders.value * 1 + 1;

    if (maxQuantity.value < count || count < 1) return;
    ordersNumberIsBeingIncreased.value = true;

    await store.dispatch("bag/changeNumberOfOrders", {
      cardId: card.id,
      numberOfOrders: count,
    });
    numberOfOrders.value = count;
    ordersNumberIsBeingIncreased.value = false;
  };

  const ordersNumberIsBeingDecreased = ref(false);
  const decreaseNumberOfOrders = async (card) => {
    if (!isUserExists.value) return router.push("/login");

    if (!card.id || ordersNumberIsBeingDecreased.value) return;
    let count = numberOfOrders.value * 1 - 1;
    if (count < 1) return;
    ordersNumberIsBeingDecreased.value = true;

    await store.dispatch("bag/changeNumberOfOrders", {
      cardId: card.id,
      numberOfOrders: count,
    });

    numberOfOrders.value = count * 1;

    ordersNumberIsBeingDecreased.value = false;
  };

  const addProductToBag = async () => {
    if (typeOfAddingToBag.value == "custom") await addProductCustom();
    else await addProductRegular();
  };

  const toggleProductToBag = async () => {
    if (typeOfAddingToBag.value == "custom") await toggleProductCustom();
    else await toggleProductRegular();
  };

  const addProductToBagAndNavigateToCheckoutPage = async () => {
    if (!isUserExists.value) return router.push("/login");
    await addProductToBag();

    router.push("/dashboard/bag");
  };

  return {
    addProductToBagAndNavigateToCheckoutPage,
    addProductToBag,
    toggleProductToBag,
    deleteCard,
    increaseNumberOfOrders,
    ordersNumberIsBeingIncreased,

    changeNumberOfOrders,
    ordersNumberIsBeingChanged,

    decreaseNumberOfOrders,
    ordersNumberIsBeingDecreased,

    selectedSize,
    availableSizes,
    updateSelectedSize,

    selectedProperty,
    selectedPropertyName,
    updateSelectedPropertyMethod,

    curCard,
    isCurSelectionAdded,
    numberOfOrders,
    productIsBeingAdded,

    cardIsBeingDeleted,

    maxQuantity,
  };
}

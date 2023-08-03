<template>
  <form class="checkout__form" @submit.prevent="handleSubmit($event)">
    <div class="heading u-margin-bottom-small">
      <div class="heading__text">付款</div>
      <img src="@/assets/images/wave.png" alt="" class="heading__wave" />
    </div>
    <div id="payment" class="checkout__form--payment">
      
    </div>

    <div class="checkout__btn checkout__form--btn">
      <button
        type="submit"
        class="btn btn-blue"
        :disabled="loading ? true : false"
      >
        立即付款
      </button>
    </div>
  </form>
</template>

<script>
import { onMounted, ref } from "vue";
import { Alert } from "@/utils/Alert.js";

import { useRouter } from "vue-router";
import { useStore } from "vuex";
export default {
  props: ["items"],
  setup(props) {
    const router = useRouter();
    const store = useStore();

    let stripe = null;
    let loading = ref(true);
    let elements = null;

    onMounted(async () => {
      
    });

    const handleSubmit = async () => {
      if (loading.value) return;
      loading.value = true;

      const res = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });

      if (res.error) {
        loading.value = false;
        Alert("error", "支付异常", 3000);

        return;
      } else if (
        res.paymentIntent &&
        res.paymentIntent.status === "succeeded"
      ) {
        Alert("success", "付款成功", 5000);

        store.commit("bag/deleteItemsWithIds", Object.keys(props.items));
      }

      loading.value = false;
      router.push("/dashboard/billings");
    };
    return { handleSubmit, loading };
  },
};
</script>

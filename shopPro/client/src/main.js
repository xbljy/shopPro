import { createApp, defineAsyncComponent } from "vue";
import App from "./App.vue";
import store from "./store";

import router from "./router";
import "@/assets/style/scss/main.scss";

import BaseButton from "@/components/layout/BaseButton.vue";
import BaseForm from "@/components/layout/BaseForm.vue";
import BasePopup from "@/components/layout/BasePopup.vue";
import LoaderApp from "@/components/layout/LoaderApp.vue";
import InfiniteScroll from "@/components/shared/InfiniteScroll.vue";
import ContentLoader from "@/components/layout/ContentLoader.vue";
import EmptyContent from "@/components/layout/EmptyContent.vue";

import Navbar from "@/components/app/layout/Navbar.vue";
import BaseMenu from "@/components/app/layout/BaseMenu.vue";
import BaseWidget from "@/components/app/layout/BaseWidget.vue";
import Footer from "@/components/app/layout/Footer.vue";
import HeadingSec from "@/components/app/layout/HeadingSec.vue";

import Shortcuts from "@/components/app/shared/Shortcuts.vue";
import Switch from '@/components/app/shared/Switch.vue';
import RatingsApp from "@/components/app/shared/RatingsApp.vue";
import SelectBox from "@/components/app/shared/SelectBox.vue";
import ProductCard from "@/components/app/shared/MainCard.vue";

import ReviewCard from "@/components/app/store/reviews/ReviewCard.vue";
const ProductDetails = defineAsyncComponent(() =>
  import("@/components/app/store/ProductDetails.vue")
);

import ConfirmPopup from "@/components/admin/shared/ConfirmPopup.vue";

import NavbarDashboard from "@/components/dashboard/layout/Navbar.vue";

import "vue3-carousel/dist/carousel.css";
import { Carousel, Slide, Pagination, Navigation } from "vue3-carousel";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/default.css";

import ColorInput from "vue-color-input";
const app = createApp(App).use(store).use(router);

app.component("NavbarApp", Navbar);
app.component("BaseButton", BaseButton);
app.component("FooterApp", Footer);
app.component("BaseMenu", BaseMenu);
app.component("BasePopup", BasePopup);
app.component("BaseWidget", BaseWidget);
app.component("BaseForm", BaseForm);

app.component("HeadingSec", HeadingSec);
app.component("ShortcutsApp", Shortcuts);
app.component("SwitchApp", Switch);
app.component("RatingsApp", RatingsApp);
app.component("SelectBox", SelectBox);
app.component("ConfirmPopup", ConfirmPopup);
app.component("ContentLoader", ContentLoader);
app.component("EmptyContent", EmptyContent);

app.component("NavbarDashboard", NavbarDashboard);

app.component("ProductCard", ProductCard);
app.component("ReviewCard", ReviewCard);
app.component("ProductDetails", ProductDetails);

app.component("Carousel", Carousel);
app.component("Slide", Slide);
app.component("Pagination", Pagination);
app.component("Navigation", Navigation);
app.component("InfiniteScroll", InfiniteScroll);

app.component("VueSlider", VueSlider);

app.component("ColorInput", ColorInput);
app.component("LoaderApp", LoaderApp);
app.mount("#app");

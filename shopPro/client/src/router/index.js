import { createRouter, createWebHistory } from "vue-router";
import store from "@/store/index.js";

const AppHome = () => import("../views/AppHome.vue");
const AppStore = () => import("../views/AppStore.vue");
const AppLogin = () => import("../views/AppLogin.vue");
const AppRegister = () => import("../views/AppRegister.vue");
const AppContact = () => import("../views/AppContact.vue");
const AppBlog = () => import("../views/AppBlog.vue");
const AppAbout = () => import("../views/AppAbout.vue");
const AppEvent = () => import("../views/AppEvent.vue");
const ErrorPage = () => import("../views/ErrorPage.vue");

const ProductDescription = () => import("../views/ProductDescription.vue");
const PostDescription = () => import("../views/PostDescription.vue");

const DashboardHome = () => import("../views/DashboardHome.vue");
const DashboardBillings = () => import("../views/DashboardBillings.vue");
const DashboardBag = () => import("../views/DashboardBag.vue");
const DashboardFavorites = () => import("../views/DashboardFavorites.vue");
const DashboardPrivacey = () => import("../views/DashboardPrivacey.vue");
const DashboardCheckout = () => import("../views/DashboardCheckout.vue");

const AdminBillings = () => import("../views/AdminBillings.vue");
const AdminBlog = () => import("../views/AdminBlog.vue");
const AdminEvents = () => import("../views/AdminEvents.vue");
const AdminLocations = () => import("../views/AdminLocations.vue");
const AdminProducts = () => import("../views/AdminProducts.vue");

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/home",
    name: "Home",
    component: AppHome,
  },
  {
    path: "/store",
    name: "Store",
    component: AppStore,
    props: (route) => ({ query: { category: route.query.category } }),
  },
  {
    path: "/store/:id",
    name: "product-description-page",
    component: ProductDescription,
    props: true,
  },
  {
    path: "/about-us",
    name: "about-us",
    component: AppAbout,
  },
  {
    path: "/contact",
    name: "contact",
    component: AppContact,
  },
  {
    path: "/login",
    name: "login",
    component: AppLogin,
  },
  {
    path: "/register",
    name: "register",
    component: AppRegister,
  },
  {
    path: "/blog",
    name: "blog",
    component: AppBlog,
  },
  {
    path: "/blog/:id",
    name: "post-description-page",
    component: PostDescription,
    props: true,
  },
  {
    path: "/events/:id",
    name: "event-page",
    component: AppEvent,
  },
  { path: "/dashboard", redirect: "/dashboard/home" },
  { path: "/dashboard/home", component: DashboardHome, name: "dashboard-home" },
  {
    path: "/dashboard/checkout",
    component: DashboardCheckout,
    name: "dashboard-checkout-page",
  },

  {
    path: "/dashboard/favorites",
    component: DashboardFavorites,
    name: "dashboard-favorites-page",
  },
  {
    path: "/dashboard/bag",
    component: DashboardBag,
    name: "dashboard-bag-page",
  },
  {
    path: "/dashboard/billings",
    component: DashboardBillings,
    name: "dashboard-billings-page",
  },
  {
    path: "/dashboard/privacey",
    component: DashboardPrivacey,
    name: "dashboard-privacey-page",
  },
  {
    path: "/dashboard/admin-products",
    component: AdminProducts,
    name: "dashboard-admin-products",
  },
  {
    path: "/dashboard/admin-billings",
    component: AdminBillings,
    name: "dashboard-admin-billings",
  },
  {
    path: "/dashboard/admin-blog",
    component: AdminBlog,
    name: "dashboard-admin-blog",
  },

  {
    path: "/dashboard/admin-events",
    component: AdminEvents,
    name: "dashboard-admin-events",
  },
  {
    path: "/dashboard/admin-locations",
    component: AdminLocations,
    name: "dashboard-admin-locations",
  },

  {
    path: "/:pathMatch(.*)*",
    component: ErrorPage,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to) {
    if (to.name !== "Store") {
      return {
        top: 0,
      };
    }
  },
});

router.beforeEach(async (to) => {
  if (!to.name || !to.name.startsWith("dashboard")) {
    return;
  } else if (
    !store.getters["auth/isUserExists"] &&
    to.name.startsWith("dashboard")
  ) {
    await store.dispatch("auth/autoLogin");
  }

  if (
    to.name.startsWith("dashboard-admin") &&
    !store.getters["auth/isUserAdmin"] &&
    store.getters["auth/isUserExists"]
  ) {
    return router.push("/dashboard");
  } else if (
    !to.name.startsWith("dashboard-admin") &&
    !store.getters["auth/isUserExists"]
  ) {
    return router.push("/login");
  }
});

export default router;

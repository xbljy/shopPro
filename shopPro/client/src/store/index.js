import { createStore } from "vuex";
import productsModule from "./modules/products/index.js";
import authModule from "./modules/auth/index.js";
import wishlistModule from "./modules/wishlist/index.js";
import bagModule from "./modules/bag/index.js";
import blogModule from "./modules/blog/index.js";
import eventsModule from "./modules/events/index.js";
import locationsModule from "./modules/locations/index.js";
import billingsModule from "./modules/billings/index.js";
import reviewsModule from "./modules/reviews/index.js";

export default createStore({
  state: {},
  mutations: {},
  actions: {},
  modules: {
    products: productsModule,
    auth: authModule,
    wishlist: wishlistModule,
    bag: bagModule,
    blog: blogModule,
    events: eventsModule,
    locations: locationsModule,
    billings: billingsModule,
    reviews: reviewsModule,
  },
});

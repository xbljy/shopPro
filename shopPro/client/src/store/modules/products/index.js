import mutations from "./mutations.js";
import actions from "./actions.js";
import getters from "./getters.js";
export default {
  namespaced: true,
  state() {
    return {
      isLoading: false,
      products: {},
      fruitProducts: {},
      seafoodProducts: {},
      meatProducts: {},
      frozenfoodProducts: {},
      vegetablesProducts: {},
      shoesProducts: {},
      curProduct: {},
      recommendedProducts: {},
      newlyAddedProducts: {},
      trendyProducts: {},
      relatedToCurrentProduct: {},
      filterQuery: {
        fruit: {
          age_group: "",
          gender: "",
          sizes: [],
          sort: "",
          types: [],
          price: [0, 1000],
          properties: [],
          category: "新鲜水果",
          limit: 10,
          tags: [],
          collection_season: [],
        },
        seafood: {
          age_group: "",
          gender: "",
          sizes: [],
          sort: "",
          types: [],
          price: [0, 1000],
          properties: [],
          category: "海鲜水产",
          limit: 10,
          tags: [],
          collection_season: [],
        },
        meat: {
          age_group: "",
          gender: "",
          sizes: [],
          sort: "",
          types: [],
          price: [0, 1000],
          properties: [],
          category: "精选肉类",
          limit: 10,
          tags: [],
          collection_season: [],
        },
        frozenfood: {
          age_group: "",
          gender: "",
          sizes: [],
          sort: "",
          types: [],
          price: [0, 1000],
          properties: [],
          category: "冷饮冻食",
          limit: 10,
          tags: [],
          collection_season: [],
        },
        vegetables: {
          age_group: "",
          gender: "",
          sizes: [],
          sort: "",
          types: [],
          price: [0, 1000],
          properties: [],
          category: "蔬菜蛋品",
          limit: 10,
          tags: [],
          collection_season: [],
        }
      },
      sizes: {
        sizes: ["s", "m", "l", "xl", "xxl", "xxxl", "xxxxl"],
        kidsSizes: ["4个月", "8个月", "12个月", "2年", "4年"],
        numericalSizes: [
          "25",
          "26",
          "27",
          "28",
          "29",
          "30",
          "31",
          "32",
          "33",
          "34",
          "35",
          "36",
          "37",
          "38",
          "39",
          "40",
          "41",
          "42",
          "43",
          "44",
          "45",
          "46",
          "47",
          "48",
          "49",
          "50",
        ],
      },
      collections: {
        "新鲜水果": {
          types: ["热销水果", "时令水果", "热带鲜果", "知名品牌", "地标水果", "新奇特"],
          tags: ["热销", "新鲜", "甘甜"]
        },
        fruit: {
          types: ["热销水果", "时令水果", "热带鲜果", "知名品牌", "地标水果", "新奇特"],
          tags: ["热销", "新鲜", "甘甜"]
        },
        "海鲜水产": {
          types: ["鱼类", "虾类", "蟹类", "贝类", "海参"],
          tags: ["特色", "知名品牌"]
        },
        seafood: {
          types: ["鱼类", "虾类", "蟹类", "贝类", "海参"],
          tags: ["特色", "知名品牌"]
        },
        "精选肉类": {
          types: ["猪肉", "羊肉", "牛肉", "鸡肉", "鸭肉"],
          tags: ["内脏", "新奇特", "知名品牌"]
        },
        meat: {
          types: ["猪肉", "羊肉", "牛肉", "鸡肉", "鸭肉"],
          tags: ["内脏", "新奇特", "知名品牌"]
        },
        "冷饮冻食": {
          types: ["面点", "方便速食", "饮品甜品", "火锅丸料", "烘培食材"],
          tags: ["烧烤", "美食", "特色"]
        },
        frozenfood: {
          types: ["面点", "方便速食", "饮品甜品", "火锅丸料", "烘培食材"],
          tags: ["烧烤", "美食", "特色"]
        },
        "蔬菜蛋品": {
          types: ["叶菜类", "根茎类", "鲜菌菇", "茄果瓜类", "葱姜蒜椒", "蛋类"],
          tags: ["新鲜", "时令", "热卖"]
        },
        vegetables: {
          types: ["叶菜类", "根茎类", "鲜菌菇", "茄果瓜类", "葱姜蒜椒", "蛋类"],
          tags: ["新鲜", "时令", "热卖"]
        }

      },
      collectionMap: {
        fruit: "新鲜水果",
        seafood: "海鲜水产",
        meat: "精选肉类",
        frozenfood: "冷饮冻食",
        vegetables: "蔬菜蛋品",
        "新鲜水果": "fruit", 
        "海鲜水产": "seafood", 
        "精选肉类": "meat", 
        "冷饮冻食": "frozenfood", 
        "蔬菜蛋品": "vegetables"
      },
      category: ["新鲜水果", "海鲜水产", "精选肉类", "冷饮冻食", "蔬菜蛋品"],
      properties: [
        "white",
        "silver",
        "grey",
        "beige",
        "black",
        "red",
        "maroon",
        "yellow",
        "olive",
        "Lime",
        "green",
        "aqua",
        "teal",
        "blue",
        "navy",
        "Fuchsia",
        "Purple",
      ],
    };
  },
  mutations,
  actions,
  getters,
};

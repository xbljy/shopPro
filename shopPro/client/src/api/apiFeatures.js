export const formatFilter = (query) => {
  console.log(query);
  if (Object.keys(query).length == 0) return {};
  const finalQuery = {};
  const queryCopy = { ...query };

  const excludedFileds = [
    "properties",
    "sizes",
    "sort",
    "price",
    "category",
    "types",
  ];
  excludedFileds.forEach((field) => delete queryCopy[field]);

  // 数组格式化
  for (let prop in queryCopy) {
    if (queryCopy[prop].length > 0) {
      finalQuery[prop] = { in: [...queryCopy[prop]] };
    }
  }

  // types字段格式化
  if (query["types"] && query["types"].length > 0) {
    finalQuery["type"] = {
      in: query["types"],
    };
  }

  // sizes字段格式化
  if (query["sizes"] && query["sizes"].length > 0) {
    finalQuery["properties.sizes.size"] = {
      in: query["sizes"],
    };
  }

  // properties字段格式化
  if (query["properties"] && query["properties"].length > 0) {
    finalQuery["properties.propertyName"] = {
      in: query["properties"],
    };
  }

  // sort字段格式化
  const sortValues = {
    price: "properties.price",
    "most recent": "-createdAt",
    rating: "-ratingsAverage",
  };
  if (query["sort"]) {
    finalQuery["sort"] = sortValues[query["sort"]];
  }

  // price字段格式化
  if (query["price"])
    finalQuery["properties.price"] = {
      gt: query["price"][0],
      lt: query["price"][1],
    };

  // category字段格式化
  if (query["category"]) finalQuery["category"] = query["category"];

  if (query["skip"]) finalQuery["skip"] = query.skip;
  if (query["limit"]) finalQuery["limit"] = query.limit;

  return finalQuery;
};

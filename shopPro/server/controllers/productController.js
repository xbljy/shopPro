const Product = require("./../models/Product.js");
const catchAsync = require("./../utils/catchAsync");
const factory = require("./handlerFactory.js");
const AppError = require("./../utils/appError.js");

exports.getTrendyProducts = (req, res, next) => {
  req.query.sort = "-numberOfViewers,-ratingsAverage";
  req.query.limit = 7;
  req.query.fields =
    "id,ratingsAverage, description,ratingsQuantity,createdAt, name, properties, category, global_discount";
  next();
};

exports.getRecommendedProducts = (req, res, next) => {
  req.query.sort = "price,-ratingsAverage,-createdAt";
  req.query.limit = 7;
  req.query.fields =
    "id,ratingsAverage, description,ratingsQuantity,createdAt, name,  properties, category, global_discount";

  next();
};

exports.getNewlyAddedProducts = (req, res, next) => {
  req.query.sort = "-createdAt";
  req.query.limit = 7;
  req.query.fields =
    "id,ratingsAverage, description,ratingsQuantity,createdAt, name, properties, category, global_discount";

  next();
};

exports.getRelatedToCurrentProduct = async (req, res, next) => {
  req.query.limit = 7;
  req.query.fields =
    "id,ratingsAverage, description,ratingsQuantity,createdAt, name, properties, category, global_discount";

  next();
};

exports.getAllProductsWithInIds = factory.getAllProductsWithArrayOfIds(Product);

exports.uploadPhotos = factory.uploadPhotos([
  {
    name: "images",
    maxCount: 10,
  },
]);

exports.resizeImages = factory.resizeImages({ name: "product" });

exports.createProduct = factory.createOne(Product);

exports.updateProduct = factory.updateOne(Product);

exports.createProperty = catchAsync(async (req, res, next) => {
  if (req.files.length === 0)
    return next(new AppError("请上传颜色对应图片", 400));
  req.body["images"] = req.files["images"].map((image) => {
    return {
      small_image: "small-" + image.filename,
      medium_image: "medium-" + image.filename,
      large_image: "large-" + image.filename,
    };
  });

  const product = await Product.findById(req.params.id);

  if (!product)
    return next(new AppError("商品不存在", 404));

  if (
    product.properties &&
    product.properties.length > 0 &&
    product.properties.find((property) => property.propertyName == req.body.propertyName)
  ) {
    return next(new AppError("颜色已添加", 400));
  } else {
    product.properties.push(req.body);
    await product.save();
  }

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.updateProperty = catchAsync(async (req, res, next) => {
  console.log(req.body);
  if (req.files["images"])
    req.body["images"] = req.files["images"].map((image) => {
      return {
        small_image: "small-" + image.filename,
        medium_image: "medium-" + image.filename,
        large_image: "large-" + image.filename,
      };
    });

  const product = await Product.findById(req.params.id);

  if (!product)
    return next(new AppError("商品不存在", 404));

  if (
    !product.properties ||
    product.properties.length == 0 ||
    !product.properties.find((property) => property._id == req.body._id)
  ) {
    return next(new AppError("服务异常", 400));
  } else {
    let property = product.properties.find((property) => property._id == req.body._id);

    for (const key in req.body) {
      if (req.body[key]) property[key] = req.body[key];
    }

    await product.save();
  }

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.deleteProperty = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return next(new AppError("商品不存在", 404));

  const propertyIndex = product.properties.findIndex(
    (property) => req.params.propertyName == property.propertyName
  );
  console.log(propertyIndex, req.params.propertyName);
  if (propertyIndex > -1) product.properties.splice(propertyIndex, 1);
  await product.save();

  res.status(204).json({
    status: "success",
  });
});

exports.getAllProducts = factory.getAll(Product, false, [
  {
    path: "reviews",
  },
]);

exports.getOneProduct = factory.getOne(Product, {
  path: "reviews",
});

exports.deleteOne = factory.deleteOne(Product);

exports.deleteAllProducts = factory.deleteAll(Product);

exports.addDiscountToPropertiesInProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  const property = product.properties.find((property) => req.body.discount[property._id]);
  console.log(property);
  if (property) property.priceDiscount = req.body.discount[property._id];

  await product.save();

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.deleteDiscountToPropertiesInProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  let idsObj = {};
  req.body.propertiesIds.forEach((id) => {
    idsObj[id] = 1;
  });

  product.properties.forEach((property) => {
    if (idsObj[property._id]) {
      property.priceDiscount = 0;
    }
  });

  await product.save();

  res.status(201).json({
    status: "success",
    product,
  });
});

exports.addDiscountToProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().where("_id").in(req.body.ids);

  products.forEach(async (product) => {
    product.global_discount = req.body.discount;
    await product.save();
  });

  res.status(201).json({
    status: "success",
    products,
  });
});

exports.deleteDiscountToProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().where("_id").in(req.body.ids);

  products.forEach(async (product) => {
    product.global_discount = 0;
    await product.save();
  });

  res.status(201).json({
    status: "success",
    products,
  });
});

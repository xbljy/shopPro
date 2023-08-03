const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const APIFeatures = require("./../utils/apiFeatures");

const multer = require("multer");
const sharp = require("sharp");

// ==============================================================================
// multer配置
// Multer 是一个 node.js 中间件，用于处理 multipart/form-data 类型的表单数据，它主要用于上传文件。它是写在 busboy 之上非常高效。
// 注意: Multer 不会处理任何非 multipart/form-data 类型的表单数据
// ==============================================================================
const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("请上传图片", 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

// ==============================================================================
// 上传头像
// ==============================================================================
exports.uploadPhotos = (options) => {
  console.log('上传商品图片')
  return upload.fields(options);
};

// ==============================================================================
// 重置图像大小并保存图像
// ==============================================================================
const resizeAndSaveImage = async (name, file) => {
  const sizes = [
    {
      path: "large",
      width: 1200,
    },
    {
      path: "medium",
      width: 400,
    },
    {
      path: "small",
      width: 100,
    },
  ];
  // --------------------------------
  // 保存多尺寸图片
  // --------------------------------

  for (let i = 0; i < sizes.length; i++) {
    console.log("ONE FILE BEING SAVED", sizes[i].path);
    await sharp(file.buffer)
      .resize(sizes[i].width)
      .toFormat("png", { quality: 100 })
      .toFile(
        `./../client/${
          process.env.NODE_ENV == "development" ? "src/assets" : "dist"
        }/images/${name}s/${sizes[i].path}-${file.filename}`
      );
    console.log("ONE FILE SAVED", sizes[i].path);
  }
};

// ==============================================================================
// 调整图片尺寸
// ==============================================================================
exports.resizeImages = ({ name }) => {
  return async (req, res, next) => {
    if (!req.files) return next();

    // --------------------------------
    // 遍历字段
    // --------------------------------
    try {
      for (let field in req.files) {
        for (const file of req.files[field]) {
          // 文件命名
          file.filename = `${name}-${
            req.params.id || req.user.id
          }-${Date.now()}.png`;

          // 调整并保存图片
          await resizeAndSaveImage(name, file);
          console.log("保存成功");
        }
      }
    } catch (err) {
      return next(
        new AppError("上传失败，请重新上传", 500)
      );
    }

    next();
  };
};



// ==============================================================================
// 删除一个文档
// ==============================================================================
exports.deleteOne = (Model, auth) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findByIdAndDelete(req.params.id);

    // 删除用户文档
    if (auth)
      query = Model.findByIdAndDelete(req.params.id).where({
        user: req.user.id,
      });

    // 获取要删除的文档
    const doc = await query;

    // 没有要删除的文档
    if (!doc) {
      return next(new AppError("没有要删除的数据", 404));
    }

    // 响应信息
    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// ==============================================================================
// 删除文档数据
// ==============================================================================
exports.deleteItemsForAUser = (Model, query) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany({ user: req.user.id, ...query });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// ==============================================================================
// 根据id批量删除商品
// ==============================================================================
exports.deleteItemsWithProductIdsForAUser = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany({
      user: req.user.id,
      product: { $in: req.body.ids },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// ==============================================================================
// 删除商品数据
// ==============================================================================
exports.deleteItemByProduct = (Model) =>
  catchAsync(async (req, res, next) => {
    await Model.deleteMany({
      user: req.user.id,
      product: req.params.productId,
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });

// ==============================================================================
// 根据id删除
// ==============================================================================
exports.deleteItemByIds = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body.ids, "-------------------------");
    await Model.deleteMany({
      _id: { $in: req.body.ids },
    });

    res.status(204).json({
      status: "success",
      data: null,
    });
  });
// ==============================================================================
// 删除所有文档
// ==============================================================================
exports.deleteAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const features = new APIFeatures(Model.find(), req.query).filter();

    await features.query.deleteMany();

    res.status(204).json({
      status: "success",
    });
  });

// ==============================================================================
// 在请求信息中添加图片名称
// ==============================================================================
const addFilesToBody = (req) => {
  // 保存图片名称
  for (let field in req.files) {
    let images = req.files[field].map((image) => {
      return {
        small_image: "small-" + image.filename,
        medium_image: "medium-" + image.filename,
        large_image: "large-" + image.filename,
      };
    });
    req.body[field] = images;
  }

  return req;
};

// ==============================================================================
// 修改一个文档
// ==============================================================================
exports.updateOne = (Model, auth) =>
  catchAsync(async (req, res, next) => {
    if (req.files) {
      req = addFilesToBody(req);
    }
    // console.log(req.body);

    let query = Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (auth) {
      query = query.where({ user: req.user.id });
    }

    // 要修改的文档
    const doc = await query;

    // 判断文档是否存在
    if (!doc) {
      return next(new AppError("没有要修改的数据", 404));
    }

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

// ==============================================================================
// 创建一个文档
// ==============================================================================
exports.createOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    // 获取图片名称并保存到请求体中
    if (req.files) {
      req = addFilesToBody(req);
    }
    // 创建文档
    let data = await Model.create(req.body);

    if (popOptions) {
      // console.log("POP");
      data = await Model.findById(data.id).populate(popOptions);
    }
    res.status(201).json({
      status: "success",
      data,
    });
  });

// ==============================================================================
// 批量创建文档
// ==============================================================================
exports.insertMany = (Model) =>
  catchAsync(async (req, res, next) => {
    console.log(req.body);
    // 获取图片名称并保存到请求体中
    if (req.files) {
      req = addFilesToBody(req);
    }
    // 创建文档
    let data = await Model.insertMany([req.body]);

    if (popOptions) {
      data = await Model.findById(data.id).populate(popOptions);
    }

    res.status(201).json({
      status: "success",
    });
  });

// ==============================================================================
// 获取文档
// ==============================================================================
exports.getOne = (Model, popOptions, auth) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);

    // 如果用户登录，获取该用户对应文档
    if (auth) {
      query = query.where({ user: req.user.id });
    }

    if (popOptions) {
      query = query.populate(popOptions);
    }

    // 要获取的文档
    const doc = await query;

    // 判断是否有对应的文档
    if (!doc) {
      return next(new AppError("没有数据", 404));
    }

    res.status(200).json({
      status: "success",
      data: doc,
    });
  });

// ==============================================================================
// 获取所有文档
// ==============================================================================
exports.getAll = (Model, auth, popOptions) =>
  catchAsync(async (req, res, next) => {
    let filter = {};
    // 记录商品id
    if (req.params.productId) filter["product"] = req.params.productId;

    // 如果用户登录，把当前id当作筛选条件
    if (auth) filter["user"] = req.user.id;

    let query = Model.find(filter);

    if (popOptions) {
      query = query.populate(popOptions);
    }
    console.log(req.query);
    if (req.query.query) {
      req.query = {
        ...req.query,
        ...JSON.parse(req.query.query),
      };
      delete req.query.query;
    }

    let features = new APIFeatures(query, req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    // 获取文档
    const documents = await features.query;
    // console.log(documents);
    res.status(200).json({
      status: "success",
      results: documents.length,
      data: documents,
    });
  });

exports.getAllProductsWithArrayOfIds = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    const ids = req.query.ids;

    let query = Model.find().where("_id").in(ids);

    if (popOptions) {
      query = query.populate(popOptions);
    }

    const result = await query;

    res.status(200).json({
      status: "success",
      results: result.length,
      result,
    });
  });

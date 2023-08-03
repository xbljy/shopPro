const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "请传入用户姓名"],
      trim: true,
      maxLength: 30,
    },
    email: {
      type: String,
      unique: true,
      required: [true, "请传入用户邮箱"],
      lowercase: true,
      validate: [validator.isEmail, "请传入可用的邮箱"],
    },
    photo: {
      type: [
        {
          small_image: String,
          medium_image: String,
          large_image: String,
        },
      ],
      default: [
        {
          small_image: "default.png",
          medium_image: "default.png",
          large_image: "default.png",
        },
      ],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    password: {
      type: String,
      minLength: [8, "密码至少需要8个字符"],
      required: [true, "请输入密码"],
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "请确认密码"],
      validate: {
        validator: function (val) {
          return this.password === val;
        },
        message: "两次密码输入不一致",
      },
    },
    phone: {
      type: String,
    },

    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

/*
  密码加密
*/
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;

  next();
});

// 虚拟填充
userSchema.virtual("posts", {
  ref: "Post",
  foreignField: "publisher",
  localField: "_id",
});

userSchema.virtual("bag", {
  ref: "Card",
  foreignField: "user",
  localField: "_id",
});

userSchema.virtual("wishlist", {
  ref: "Wishlist",
  foreignField: "user",
  localField: "_id",
});

userSchema.virtual("myNotifications", {
  ref: "Notification",
  foreignField: "user",
  localField: "_id",
});
/*
  ===============================================================
  如果密码被修改则添加passwordChangedAt属性
  ===============================================================
*/
userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

/*
  ===============================================================
  过滤非活跃用户
  ===============================================================
*/
userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre("findOne", function (next) {
  this.populate([
    {
      path: "wishlist",
    },
    {
      path: "bag",
    },
  ]);

  next();
});

/*
  ===============================================================
  校验密码是否正常
  ===============================================================
*/
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

/*
  ===============================================================
  密码修改后进行校验
  ===============================================================
*/
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    return JWTTimestamp < changedTimestamp;
  }

  return false;
};

/*
  ===============================================================
  创建token重置密码
  ===============================================================
*/
userSchema.methods.createPasswordResetToken = function () {
  // 创建token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 保存密码和过期日期
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

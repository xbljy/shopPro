const mongoose = require("mongoose");

const TodoListSchema = new mongoose.Schema(
  {
    body: {
      type: String,
      required: [true, "请传入任务内容"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      required: [true, "任务需要关联用户"],
      ref: "User",
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    done: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const ToDoList = mongoose.model("ToDoList", TodoListSchema);

module.exports = ToDoList;

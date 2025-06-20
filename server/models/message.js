const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    fromId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    fromType: {
      type: String,
      enum: ["user", "host"],
      required: true,
    },
    toId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    toType: {
      type: String,
      enum: ["user", "host"],
      required: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file", "audio", "video", "code"],
      default: "text",
    },
    content: {
      type: String,
      default: "", 
    },
    fileName: {
      type: String, 
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    deletedFor: [{ type: mongoose.Schema.Types.ObjectId }], 
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);

const mongoose = require("mongoose");

const HomepageContentSchema = new mongoose.Schema({
  cardItems: [
    {
      title: { type: String, required: true },
      subtitle: { type: String, required: true },
      image: { type: String, required: true },
      span: { type: String, required: true },
      route: { type: String, required: true },
      blur: { type: Boolean, default: false },
    },
  ],
  testimonialList: [
    {
      author: {
        fullName: { type: String, required: true },
        picture: { type: String, required: true },
        designation: { type: String, required: true },
      },
      description: { type: String, required: true },
    },
  ],
  faqList: [
    {
      isActive: { type: Boolean, default: false },
      question: { type: String, required: true },
      answer: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Content", HomepageContentSchema);

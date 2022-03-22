const mongoose = require("mongoose");
const marked = require("marked");
const slugify = require("slugify");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const dompurify = createDomPurify(new JSDOM().window);

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  markdown: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  sanitizedHtml: {
    type: String,
    required: true,
  },
});
//slugify는 Url을 예쁘게 정리해줌
articleSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true }); //lowercase로 변환,url 형식에 맞지 않는 것들 제거(:등등..)
  }

  if (this.markdown) {
    this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown));
  }

  next();
});

module.exports = mongoose.model("Article", articleSchema);

const mongoose = require("mongoose");
const PostSchema = mongoose.Schema({
  title: { type: String, required: true },
  desc: String,
  file: { type: mongoose.Types.ObjectId, ref: "file" },
  category: { type: mongoose.Types.ObjectId, ref: "category",required:true },
  updatedBy: { type: mongoose.Types.ObjectId, ref: "user" ,required:true},
},{timestamps:true});

const post=mongoose.model("post",PostSchema)
module.exports=post

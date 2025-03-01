const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, trim: true, unique: true, sparse: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, select: false },
    role: { type: String, default: "user" },
    country: { type: String, trim: true },
    googleId: { type: String, unique: true, sparse: true },
    street: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    image: { type: String, default: null },
    profileSetup: { type: Boolean, default: false },
    status:{type:String,enum:['active','inactive','Restricted'],default:'active'},
    city: { type: String, trim: true },
    gender: { type: String, enum: ["male", "female"] },
    isResticted:{type:Boolean,default:false},
    
    blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Blog" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;

import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Token from "./token.js"
import crypto from "crypto"

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: "Email is required",
      trim: true,
    },
    user: {
      type: String,
      unique: true,
      required: false,
      index: true,
      sparse: true,
      max: 256,
    },

    name: {
      type: String,
    },

    birthDate: {
      type: Date,
    },

    pass: {
      type: String,
      required: "Your password is required",
      max: 100,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpires: {
      type: Date,
      required: false,
    },
    permissions:[String]
  },
  { timestamps: true }
);

userSchema.pre("save", function (next) {
  const user = this;

  if (!user.isModified("pass")) return next();
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);
    console.log(user.pass);
    bcrypt.hash(user.pass, salt, function (err, hash) {
      if (err) return next(err);
      user.pass = hash;
      next();
    });
  });
});
userSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
userSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex"),
  };

  return new Token(payload);
};
userSchema.methods.comparePassword = function (pass) {
  return bcrypt.compareSync(pass, this.pass);
};

userSchema.methods.addPermission=function(perm) {
  this.permissions.push(perm);
}
userSchema.methods.removePermission=function(perm) {
  this.permissions=this.permissions.filter((p) => {
    return p!=perm
  })
}
userSchema.methods.hasPermission=function(perm) {
  return this.permissions.includes(perm);
}

userSchema.virtual("isTutor").get(function () { return this.hasPermission("post-session") });
userSchema.virtual("isAdmin").get(function () { return this.hasPermission("admin") });
userSchema.virtual("isStaff").get(function () { return this.isTutor || this.isAdmin; });

const User = mongoose.model("Users", userSchema);
export default User;
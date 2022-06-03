import mongoose from "mongoose";
import bcrypt from "bcrypt";
import Token from "./tokenschema.js"
import crypto from "crypto"

const UserSchema = new mongoose.Schema(
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

UserSchema.pre("save", function (next) {
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
UserSchema.methods.generatePasswordReset = function () {
  this.resetPasswordToken = crypto.randomBytes(20).toString("hex");
  this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};
UserSchema.methods.generateVerificationToken = function () {
  let payload = {
    userId: this._id,
    token: crypto.randomBytes(20).toString("hex"),
  };

  return new Token(payload);
};
UserSchema.methods.comparePassword = function (pass) {
  return bcrypt.compareSync(pass, this.pass);
};

UserSchema.methods.addPermission=function(perm) {
  this.permissions.push(perm);
}
UserSchema.methods.removePermission=function(perm) {
  this.permissions=this.permissions.filter((p) => {
    return p!=perm
  })
}
UserSchema.methods.hasPermission=function(perm) {
  return this.permissions.includes(perm);
}

const User = mongoose.model("Users", UserSchema);
export default User;
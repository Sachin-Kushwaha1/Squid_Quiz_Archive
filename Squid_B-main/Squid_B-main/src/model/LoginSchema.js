import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const Schema = mongoose.Schema({
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator: function (val) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      },
      message: "Invalid email address",
    },
  },
  password: {
    type: String,
    validate: {
      validator: function (val) {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/.test(
          val
        );
      },
      message:
        "Password must contain: 1) At least 8 characters long\n2) Contains at least one uppercase letter\n3) Contains at least one lowercase lette\n4) Contains at least one digit\nContains at least one special character\n",
    },
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
});
Schema.pre("save", async function (next) {
  if (!this.password || !this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(this.password, salt);
    this.password = hashedPassword;
  } catch (err) {
    next(err);
  }
});
Schema.methods.verifyPassword = async function (pwd) {
  return await bcrypt.compare(pwd, this.password);
};
Schema.methods.getResetPasswordToken = async function () {
  const resetToken = Math.floor(100000 + Math.random() * 900000);

  this.resetPasswordToken = resetToken;
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};
export const userModel1 = mongoose.model("Logreg", Schema);

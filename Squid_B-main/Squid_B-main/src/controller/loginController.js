import { userModel1 } from "../model/LoginSchema.js";
import {
  getUserRepo,
  createUserRepo,
  clearTokenDetails,
} from "../model/user.repo.js";
import { sendResetPasswordMail } from "../../config/nodemailer.config.js";
import crypto from "crypto";

export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    console.log(name);
    console.log(email);
    console.log(password);

    if (!name || !email || !password)
      return res.send({
        status: false,
        message: "All the fields are mandatory",
      });

    const user = await getUserRepo({ email: email });
    if (user) return res.send({ status: false, message: "Already registered" });

    const newUser = await createUserRepo({ name, email, password });
    return res.send({ status: true, message: "Registration Successful" });
  } catch (err) {
    return res.send({ status: false, message: err.message });
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await getUserRepo({ email });
    if (!user) res.send({ status: false, message: "Invalid credential" });

    if (!user.password)
      res.send({
        status: false,
        message:
          "You have register with us using Google. Try to login with the same",
      });

    const token = await user.getResetPasswordToken();
    await user.save();

    const callbacktoken = token;
    console.log(callbacktoken);
    sendResetPasswordMail(email, callbacktoken);
    clearTokenDetails(user._id);

    res.send({ status: true, message: "OTP is send in your mail." });
  } catch (err) {
    throw err;
  }
};

export const setNewPassword = async (req, res) => {
  try {
    const { password, confirmPassword, email } = req.body;

    if (password != confirmPassword) {
      res.send({
        status: false,
        message: "New Password and Confirm Password don't match",
      });
    } else {
      const user = await getUserRepo({ email });
      if (!user) res.send({ status: false, message: "user not found" });
      console.log(user);
      user.password = password;
      await user.save();
      console.log("Successfully Updated");
      res.send({ status: true, message: "Successfully Updated" });
    }
  } catch (err) {
    throw err;
  }
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) res.send({ status: false, message: "Something went wrong" });

  const user = await getUserRepo({ email });

  if (!user) res.send({ status: false, message: "User not found" });

  const token = await user.getResetPasswordToken();
  await user.save();

  const callbacktoken = token;
  console.log(callbacktoken);
  sendResetPasswordMail(email, callbacktoken);
  clearTokenDetails(user._id);

  res.send({ status: true, message: "OTP is send in your mail." });
};

export const verifyOtp = async (req, res) => {
  const { email, token } = req.body;
  console.log(token);

  if (!email || !token)
    res.send({ status: false, message: "Enter otp carefully" });

  const user = await getUserRepo({ email });

  if (!user) res.send({ status: false, message: "User not found" });

  if (user.resetPasswordExpire < Date.now())
    res.send({ status: false, message: "OTP is Expired. Try Again" });

  if (token != user.resetPasswordToken)
    res.send({ status: false, message: "OTP didn't match" });

  res.send({ status: true, message: "Successfully verified" });
};

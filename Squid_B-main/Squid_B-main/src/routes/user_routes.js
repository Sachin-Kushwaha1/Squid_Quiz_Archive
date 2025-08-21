import {Router} from "express"
import jwt from "jsonwebtoken"
import { checkToken, Final, firstLogin, isSelected, saveToken, thank } from "../controller/controller.js";
import { confirmPasswords } from "../middleware/confirm.js";
import { registerUser, resetPassword, verifyOtp,resendOtp, setNewPassword } from "../controller/loginController.js";
import passport from "../../config/passport.config.js"

export const userRoutes = Router();

userRoutes.get("/failure",(req,res)=>{
  res.send({status:false,message:"Invalid Credentials"});
})
userRoutes.get("/responseGoogle",(req,res)=>{
  res.send({status:true,message:"Successfully loggedIn"});
})

userRoutes.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRoutes.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    session:false,
    failureRedirect: "/user/failure",
    failureFlash: true,
  }),
  function (req, res) {
    const token=jwt.sign({email:req.user.email},"privacykey");
    res.cookie('sid',token);
    res.redirect("/user/responseGoogle")
    // res.send({status:true,message:"Successfully Login"})
  }
);

userRoutes.post("/select_cand", isSelected);

// // Level 2 token
userRoutes.post("/get_token", saveToken);

// // Submit token
userRoutes.post("/verify_token", checkToken);
// // Home page

userRoutes.post("/Start_Game", firstLogin);

userRoutes.post("/End_Game", Final);

userRoutes.post("/End", thank);

userRoutes.post("/register", confirmPasswords, registerUser);
userRoutes.post("/login",
    passport.authenticate("local", {
      session: false,
      failureRedirect: "/user/failure",
      failureFlash: true,
    }),
    (req, res) => {
      // console.log(req.user);
      const token=jwt.sign({email:req.user.email},"privacykey");
      res.cookie('sid',token);
      res.send({status:true,message:"Successfully Login"})
    }
);

userRoutes.post("/reset-password", resetPassword);
userRoutes.post("/set-password", setNewPassword);
userRoutes.post("/verifyOtp",verifyOtp);
userRoutes.post("/resendOtp",resendOtp);

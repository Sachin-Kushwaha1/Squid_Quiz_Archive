import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
import passport from "passport";
import {Strategy as LocalStrategy}  from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { userModel1 } from "../src/model/LoginSchema.js";
import { findOrCreate } from "../src/model/user.repo.js";

passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},
    function(email,password,next) {
      userModel1.findOne({ email: email }).then((user)=>{
        if (!user) { return next(null, false)};
        if(user.password){
            user.verifyPassword(password).then((isValid)=>{
                if(!isValid){
                    return next(null,false);
                }
                return next(null,user);
            });
        }else{
            return next(null,false);
        }
      });
    }
));

passport.use(new GoogleStrategy( {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.BASE_URL}/user/auth/google/callback`,
    passReqToCallback: true,
  },
  function (req, accessToken, refreshToken, profile, next) {
    const user = {
      name: profile.displayName,
      // profileId: profile.id,
      // method: "google",
      email: profile._json.email,
    };
    findOrCreate(user).then((user) => {
      console.log(user);
      //if the user is present it will retrieve or else a new user will be created and returned
      return next(null, user);
    });
  }))


//It will go inside session only when session is user..
// IF WE USE COOKIES IT WILL NOT GO INSIDE SERIALIZER AND DESERIALIZER

// passport.serializeUser(function(user, next) {
//     console.log(user);
//     next(null, user.email);
//   });
  
//   passport.deserializeUser(function(user, next) {
//         return next(null,user);
//   });

export default passport;
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { userRoutes } from "./src/routes/user_routes.js";
import passport from "passport";

export const app=express();

app.set("view engine", "ejs");
app.use(cors());
app.use(cookieParser());
app.use(passport.initialize());
// app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/user", userRoutes);
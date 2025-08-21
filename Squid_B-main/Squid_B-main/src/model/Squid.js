import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  selected: {
    type: Number,
  },
  win: {
    type: Date,
  },
  token: {
    type: Number,
  },
  starttime: {
    type: Date,
  },
  question: {
    type: Number,
  }
});
 export const userModel = mongoose.model("Squidquiz", userSchema);

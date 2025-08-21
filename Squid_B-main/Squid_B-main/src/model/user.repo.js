import { userModel1 } from "./LoginSchema.js";

export const createUserRepo = async (user) => {
  const newUser = userModel1(user);
  await newUser.save();
  return newUser;
};

export const getUserRepo = async (obj) => {
  return await userModel1.findOne(obj);
};

export const findOrCreate = async (newUser) => {
  let user = await userModel1.findOne({
    email: newUser.email,
  });
  if (user) return user;
  user = new userModel1(newUser);
  await user.save();
  return user;
};

export const clearTokenDetails = (id) => {
  setTimeout(async () => {
    await userModel1.updateOne(
      { _id: id },
      { $unset: { resetPasswordToken: 1, resetPasswordExpire: 1 } }
    );
  }, 10 * 60 * 1000);
};

import { userModel } from "../model/Squid.js";

export const checkToken = async (req, res, next) => {
  const { token, email } = req.body;
  try {
    const result = await userModel.findOne({ email: email });
    if (result) {
      if (result.token == token) {
        return res.json({ status: true, message: "correct" });
      } else {
        return res.json({
          message: "Invalid Token. Try again.",
          status: false,
        });
      }
    } else {
      return res.json({ status: false, message: "Incorrect" });
    }
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

export const Final = async (req, res) => {
  try {
    const { email, question } = req.body;

    const count = await userModel.countDocuments({ selected: 3 });

    if (count < 3) {
      await userModel.updateOne(
        { email: email },
        {
          $set: {
            win: new Date(),
            selected: 3,
            question: question,
          },
        }
      );

      return res.json({
        message: "Congratulations, you successfully cleared the challenges",
        selected: true,
      });
    } else {
      return res.json({
        message: "Unfortunately, you failed to save Jerry!!",
        selected: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

export const firstLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const count = await userModel.countDocuments({ email: email });

    if (count === 0) {
      await userModel.create({
        email: email,
        selected: 1,
        win: new Date(),
        starttime: new Date(),
        question: 0,
      });

      return res.json({ message: "success", selected: true });
    } else {
      return res.json({
        message: "You have already Participated",
        selected: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

export const isSelected = async (req, res) => {
  try {
    const { email } = req.body;

    const count = await userModel.countDocuments({ selected: 2 });

    if (count < 30) {
      await userModel.updateOne({ email: email }, { $set: { selected: 2 } });

      return res.json({ message: "", selected: true });
    } else {
      return res.json({
        message:
          "You have correctly answered the riddles but you were a little late, therefore Jerry couldn't be saved.",
        selected: false,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

export const saveToken = async (req, res) => {
  const token = Math.floor(100000 + Math.random() * 900000); // Generate a random six-digit number

  try {
    const { email } = req.body;

    await userModel.updateOne(
      { email: email },
      {
        $set: {
          token: token,
        },
      }
    );

    return res.json({ token });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

export const thank = async (req, res) => {
  try {
    const { email, question } = req.body;

    await userModel.updateOne(
      { email: email },
      {
        $set: {
          win: new Date(),
          question: question,
        },
      }
    );

    return res.json({
      message: "Unfortunately, you failed to save Jerry!!",
      selected: true,
    });
  } catch (err) {
    console.log(err);
    res.json({ err });
  }
};

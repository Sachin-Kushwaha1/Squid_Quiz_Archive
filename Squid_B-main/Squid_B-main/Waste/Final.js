const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Final = async (req, res) => {
  try {
    const { email, question } = req.body;

    // await client.connect();

    const db = client.db("auth");
    const squidCollection = db.collection("Squid");

    const count = await squidCollection.countDocuments({ selected: 3 });

    if (count < 3) {
      await squidCollection.updateOne(
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
  // finally {
  //   await client.close();
  // }
};

module.exports = Final;

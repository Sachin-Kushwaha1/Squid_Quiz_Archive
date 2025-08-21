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

    await squidCollection.updateOne(
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
  // finally {
  //   await client.close();
  // }
};

module.exports = Final;

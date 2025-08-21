const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const isSelected = async (req, res) => {
  try {
    const { email } = req.body;

    // await client.connect();

    const db = client.db("auth");
    const squidCollection = db.collection("Squid");

    const count = await squidCollection.countDocuments({ selected: 2 });

    if (count < 30) {
      await squidCollection.updateOne(
        { email: email },
        { $set: { selected: 2 } }
      );

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
  // finally {
  //   await client.close();
  // }
};

module.exports = isSelected;

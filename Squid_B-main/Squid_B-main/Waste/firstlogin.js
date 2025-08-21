const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const firstLogin = async (req, res) => {
  try {
    const { email } = req.body;

    // await client.connect();

    const db = client.db("auth");
    const squidCollection = db.collection("Squid");

    const count = await squidCollection.countDocuments({ email: email });

    if (count === 0) {
      await squidCollection.insertOne({
        email: email,
        selected: 1,
        win: new Date(), // You may want to set the appropriate value for your use case
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
  //  finally {
  //   await client.close();
  // }
};

module.exports = firstLogin;

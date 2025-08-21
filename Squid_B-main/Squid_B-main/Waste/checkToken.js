const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const giveAccess = async (req, res) => {
  const { token, email } = req.body;

  try {
    // await client.connect();

    const db = client.db("auth");
    const squidCollection = db.collection("Squid");

    const result = await squidCollection.findOne({ email: email });

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
  //  finally {
  //   await client.close();
  // }
};

module.exports = giveAccess;

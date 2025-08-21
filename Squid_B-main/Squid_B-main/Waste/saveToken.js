const { MongoClient } = require("mongodb");

const uri = process.env.MONGO_URL;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const sendToken = async (req, res) => {
  const token = Math.floor(100000 + Math.random() * 900000); // Generate a random six-digit number

  try {
    const { email } = req.body;

    // await client.connect();

    const db = client.db("auth");
    const squidCollection = db.collection("Squid");

    await squidCollection.updateOne(
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
  //  finally {
  //   await client.close();
  // }
};

module.exports = sendToken;

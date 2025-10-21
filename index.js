const express = require("express");
const urlRoute = require("./routes/url");
const URL = require("./models/url");
const { connectMongoDB } = require("./connection");

const app = express();
const PORT = 8001;

app.use(express.json());

connectMongoDB("mongodb://localhost/short-url").then(() => {
  console.log("MongoDB connected...");
});

app.use("/url", urlRoute);

app.get("/:shortId", async (req, res) => {
  const shortURL = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortURL,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(PORT, () => {
  console.log("Server started on PORT " + PORT);
});

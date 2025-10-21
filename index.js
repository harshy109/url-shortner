const express = require("express");
const path = require('path');
const urlRoute = require("./routes/url");
const staticRoute = require("./routes/staticRoute")
const URL = require("./models/url");
const { connectMongoDB } = require("./connection");

const app = express();
const PORT = 8001;

app.use(express.json());
app.use(express.urlencoded({extended:false})); //to parse form data

app.set('view engine', "ejs");
app.set('views', path.resolve("./views"));

connectMongoDB("mongodb://localhost/short-url").then(() => {
  console.log("MongoDB connected...");
});

app.get("/test", async (req, res)=>{
    // res.end(`<h1> Hello from Harshu </h1>`)
    const allUrls = await URL.find({});
    return res.render("home", {urls : allUrls});
})

app.use("/url", urlRoute);
app.use("/", staticRoute);

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

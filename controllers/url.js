const { nanoid } = require("nanoid");
const URL = require("../models/url");
const shortid = require("shortid");

async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) {
    return res.status(400).json({ msg: "url is required" });
  }
  const shortID = nanoid(8);
  await URL.create({
    shortURL: shortID,
    redirectURL: body.url,
    visitHistory: [],
  });
  return res.render("home", {
     id: shortID 
  });
}

async function handleAnalyticsById(req, res) {
    const shortURL = req.params.shortId;
    const result = await URL.findOne({shortURL});

    return res.json({
        total_clicks : result.visitHistory.length,
        analytics : result.visitHistory,
    });
}

module.exports = {
  handleGenerateNewShortURL,
  handleAnalyticsById
};

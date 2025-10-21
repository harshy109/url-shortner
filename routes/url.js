const express = require("express");
const { handleGenerateNewShortURL, handleAnalyticsById} = require("../controllers/url");

const router = express.Router();

router.post("/", handleGenerateNewShortURL);

router.get("/analytics/:shortId" , handleAnalyticsById)

module.exports = router;

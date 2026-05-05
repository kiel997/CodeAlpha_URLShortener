const Url = require("../models/Url");
const shortid = require("shortid");

exports.shortenUrl = async (req, res) => {
  const { originalUrl } = req.body;

  try {
    let existing = await Url.findOne({ originalUrl });

    if (existing) {
      return res.json({
        shortUrl: `http://localhost:3000/${existing.shortCode}`
      });
    }

    const shortCode = shortid.generate();

    const newUrl = new Url({
      originalUrl,
      shortCode
    });

    await newUrl.save();

    res.json({
      shortUrl: `http://localhost:3000/${shortCode}`
    });

  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortCode: req.params.code });

    if (!url) return res.status(404).send("Not found");

    res.redirect(url.originalUrl);

  } catch (err) {
    res.status(500).send("Server error");
  }
};

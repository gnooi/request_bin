function parseBody(req, res, next) {
  req.rawText = req.body; // string, from express.text()

  try {
    req.parsedBody = JSON.parse(req.body);
  } catch (err) {
    req.parsedBody = undefined;
  }

  next();
}

module.exports = parseBody;

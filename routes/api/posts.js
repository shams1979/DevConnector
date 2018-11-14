const express = require("express");
const router = express.Router();

router.get("/test", (req, res) => res.json({ Msg: "posts test called" }));

module.exports = router;

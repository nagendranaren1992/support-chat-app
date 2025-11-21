const express = require("express");
const router = express.Router();
const multer = require("multer");
const memoryStorage = multer.memoryStorage();
const upload = multer({ storage: memoryStorage });

const ticketsController = require("../controllers/ticketsController");

router.post(
  "/",
  upload.fields([
    { name: "screenshot", maxCount: 1 },
    { name: "video", maxCount: 1 },
  ]),
  ticketsController.createTicket
);

router.get("/", ticketsController.listTickets);

module.exports = router;

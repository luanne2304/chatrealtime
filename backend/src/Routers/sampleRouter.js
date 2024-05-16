const express = require("express");
const SampleRouter = express.Router();
const SampleController = require("../Controllers/sampleController");

SampleRouter.get("/api/Sample/getSample", SampleController.sample);
SampleRouter.get("/api/Sample/getSample/:test", SampleController.sample2);

module.exports = SampleRouter;
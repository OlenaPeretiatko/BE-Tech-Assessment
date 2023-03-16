module.exports = app => {
  const acronyms = require("../controllers/acronym.controller.js");

  var router = require("express").Router();

  // Retrieve all Acronyms
  router.get("/", acronyms.findAll);

  // Create a new Acronym
  router.post("/", acronyms.create);

  // Update a Acronym with id
  router.patch("/:id", acronyms.update);

  // Delete a Acronym with id
  router.delete("/:id", acronyms.delete);

  app.use("/acronym", router);
};
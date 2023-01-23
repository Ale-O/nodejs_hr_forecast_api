module.exports = app => {
  const elements = require("../controllers/element.controller.js");

  var router = require("express").Router();

  // Create a new Element
  router.post("/", elements.create);

  // Retrieve all Elements
  router.get("/", elements.findAll);

  // Retrieve all published Elements
  router.get("/published", elements.findAllActivated);

  // Retrieve a single Element with id
  router.get("/:id", elements.findOne);

  // Update a Element with id
  router.put("/:id", elements.update);

  // Delete a Element with id
  router.delete("/:id", elements.delete);

  // Delete all Elements
  router.delete("/", elements.deleteAll);

  app.use('/api/elements', router);
};

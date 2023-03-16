const db = require("../models");
const Acronym = db.acronyms;

// Create a new Acronym
exports.create = async (req, res) => {
  try {
    if (!req.body.acronym || !req.body.definition) {
      return res.status(400).send({ message: "Request body can not be empty!" });
    }

    const existingAcronym = await Acronym.findOne({ acronym: req.body.acronym });
    if (existingAcronym) {
      return res.status(409).send({ message: "Acronym already exists!" });
    }

    const acronym = new Acronym({
      acronym: req.body.acronym,
      definition: req.body.definition,
    });

    const savedAcronym = await acronym.save();
    res.send(savedAcronym);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Acronym.",
    });
  }
};

// Retrieve all Acronyms from the database.
exports.findAll = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search;

    const regex = new RegExp(search, "i");
    const condition = search
      ? {
        $or: [
          { acronym: { $regex: regex } },
          { definition: { $regex: regex } },
        ],
      }
      : {};

    const count = await Acronym.countDocuments(condition);
    const totalPages = Math.ceil(count / limit);

    const acronyms = await Acronym.find(condition)
      .skip((page - 1) * limit)
      .limit(limit);

    const baseUrl = `${req.protocol}://${req.get("host")}${req.baseUrl}`;
    const links = {};

    if (page < totalPages) {
      links.next = `<${baseUrl}?page=${page + 1}&limit=${limit}>; rel="next"`;
    }

    res.set("Link", Object.values(links).join(", ")).send(acronyms);
  } catch (err) {
    res.status(500).send({
      message:
        err.message || "Some error occurred while retrieving acronyms.",
    });
  }
};

// Update a Acronym by the id in the request
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const existingAcronym = await Acronym.findById(id);
    if (!existingAcronym) {
      return res
        .status(404)
        .send({ message: `Acronym with id=${id} not found.` });
    }

    const { acronym, definition } = req.body;
    if (!acronym && !definition) {
      return res.status(400).send({
        message: "Request body can not be empty!",
      });
    }

    const existingConflict = await Acronym.findOne({
      $or: [
        { acronym: acronym, _id: { $ne: id } },
        { definition: definition, _id: { $ne: id } },
      ],
    });
    if (existingConflict) {
      return res
        .status(409)
        .send({ message: "Acronym or definition already exists." });
    }

    const updatedAcronym = await Acronym.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true, useFindAndModify: false }
    );
    res.send({
      message: "Acronym was updated successfully.",
      data: updatedAcronym,
    });
  } catch (err) {
    res.status(500).send({
      message: "Error updating Acronym with id=" + id,
    });
  }
};

// Delete a Acronym with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Acronym.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Acronym with id=${id} not found.`
        });
      } else {
        res.send({
          message: "Acronym was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete Acronym with id=" + id
      });
    });
};

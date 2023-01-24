const db = require("../models");
const Element = db.elements;
const Op = db.Sequelize.Op;

// Function created and Saved a new Element
exports.create = (req, res) => {
  // Validation request
  if (!req.body.username) {
    res.status(400).send({
      message: "This content can not be empty"
    });
    return;
  }

  // Function created a Element
  const element = {
    username: req.body.username,
    rank: req.body.rank,
    published: req.body.published ? req.body.published : false,
    availability_date: req.body.availability_date,
    end_date: req.body.end_date,
    budget_line: req.body.budget_line
  };

  // Function saved this Element in the database
  Element.create(element)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "There are some error during the creation."
      });
    });
};

// Function retrieved all Elements from the database.
exports.findAll = (req, res) => {
  const username = req.query.username;
  var condition = username ? { username: { [Op.like]: `%${username}%` } } : null;

  Element.findAll({ where: condition })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "There are some error when retrieving elements."
      });
    });
};

// Function finded a single Element with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Element.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data);
      } else {
        res.status(404).send({
          message: `We cannot find Element with id=${id}.`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "This is an error when retrieving Element with id=" + id
      });
    });
};

// Function updated a Element by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  Element.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "This Element was updated successfully."
        });
      } else {
        res.send({
          message: `We cannot update Element with id=${id}. This Element was not found or the req.body is maybe empty!`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "This is an error during the update for Element with id=" + id
      });
    });
};

// Function deleted a Element with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Element.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: "This Element was deleted successfully"
        });
      } else {
        res.send({
          message: `We Cannot delete Element with id=${id}. The Element was not found`
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "We could not delete Element with id=" + id
      });
    });
};

// Function deleted all Elements from the database.
exports.deleteAll = (req, res) => {
  Element.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Elements were deleted successfully` });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "There are some error while removing all elements."
      });
    });
};

// Function finded all published Element
exports.findAllActivated = (req, res) => {
  Element.findAll({ where: { published: true } })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "There are some error while retrieving elements."
      });
    });
};

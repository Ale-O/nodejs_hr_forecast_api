const { json } = require('sequelize')
const db = require('../models')
const Element = db.elements
const Op = db.Sequelize.Op

// Function created and Saved a new Element
exports.create = (req, res) => {
  // Validation request
  if (!req.body.username) {
    res.status(400).send({
      message: 'This content can not be empty'
    })
    return
  }

  // Function created a Element
  const rank_B = {
    username: req.body.username,
    rank: req.body.rank,
    activated: req.body.activated ? req.body.activated : false,
    availability_date: req.body.availability_date,
    end_date: req.body.end_date,
    budget_line: req.body.budget_line
  }

  // Function saved this Element in the database
  Element.create(rank_B)
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'There are some error during the creation.'
      })
    })
}

// Function retrieved all Elements from the database.
exports.findAll = (req, res) => {
  const username = req.query.username
  var condition = username ? { username: { [Op.like]: `%${username}%` } } : null

  Element.findAll({ where: condition })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || 'There are some error when retrieving elements.'
      })
    })
}

// Function finded a single Element with an id
exports.findOne = (req, res) => {
  const id = req.params.id

  Element.findByPk(id)
    .then(data => {
      if (data) {
        res.send(data)
      } else {
        res.status(404).send({
          message: `We cannot find Element with id=${id}.`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'This is an error when retrieving Element with id=' + id
      })
    })
}

// Function updated a Element by the id in the request
exports.update = (req, res) => {
  const id = req.params.id

  Element.update(req.body, {
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'This Element was updated successfully.'
        })
      } else {
        res.send({
          message: `We cannot update Element with id=${id}. This Element was not found or the req.body is maybe empty!`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'This is an error during the update for Element with id=' + id
      })
    })
}

// Function deleted a Element with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id

  Element.destroy({
    where: { id: id }
  })
    .then(num => {
      if (num == 1) {
        res.send({
          message: 'This Element was deleted successfully'
        })
      } else {
        res.send({
          message: `We Cannot delete Element with id=${id}. The Element was not found`
        })
      }
    })
    .catch(err => {
      res.status(500).send({
        message: 'We could not delete Element with id=' + id
      })
    })
}

// Function deleted all Elements from the database.
exports.deleteAll = (req, res) => {
  Element.destroy({
    where: {},
    truncate: false
  })
    .then(nums => {
      res.send({ message: `${nums} Elements were deleted successfully` })
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'There are some error while removing all elements.'
      })
    })
}

// Function finded all activated Element
exports.findAllActivated = (req, res) => {
  Element.findAll({ where: { activated: true } })
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'There are some error while retrieving elements.'
      })
    })
}

// Function produced forecast since database
exports.produceForecast = async (req, res) => {
  let ranks_A = await Element.findAll({
    where: { rank: 'rank_A', activated: true }
  })
  let ranks_B = await Element.findAll({
    where: { rank: 'rank_B', activated: true }
  })

  // prepare array for comparison of follows
  let arrayFollows = []

  // function for comparing one follow to a other
  function comp1to1Follow (follow1, follow2) {
    if (
      (follow1['budget_line'] === follow2['budget_line'] &&
        follow1['release_date'] === follow2['release_date']) ||
      (follow1['new_owner'] === follow2['new_owner'] &&
        follow1['last_rank_new_owner'] === follow2['last_rank_new_owner'])
    ) {
      return false
    } else {
      return true
    }
  }

  // function for comparing one follow to many other
  function comp1toMFollow (follow1, follows2) {
    let check = true
    follows2.forEach(follow2 => {
      if (!comp1to1Follow(follow1, follow2)) {
        check = false
      }
    })
    return check
  }

  // function for creating many possibles matchs arrays of follows since one array of no match
  function splitMatchsFollow (follow, matchsFollows) {
    // prepare the result array
    let everyMatchs = []

    // loop on the entry array
    matchsFollows.forEach(match => {
      // prepare array of matchs for this match
      let matchs = []
      matchs.push(follow)
      matchs.push(match)

      // prepare array for comparing
      let otherFollows = [...matchsFollows]
      otherFollows.splice(otherFollows.indexOf(match), 1)

      // loop on the comparing array
      otherFollows.forEach(otherFollow => {
        if (comp1toMFollow(otherFollow, matchs)) {
          matchs.push(otherFollow)
        }
      })
      everyMatchs.push(matchs)
    })

    // result
    return everyMatchs
  }

  // function searching every matching of follows since one follow
  function searchMatchsFollows (follow, indexFollows) {
    let matchsFollows = []
    for (var i = indexFollows; i < arrayFollows.length; i++) {
      let follows2 = arrayFollows[i]
      follows2.forEach(follow2 => {
        if (comp1to1Follow(follow, follow2)) {
          matchsFollows.push(follow2)
        }
      })
    }
    result = splitMatchsFollow(follow, matchsFollows)
    return result
  }

  // function check no redundancy between 2 follows
  function noRedundancy (follows1, follows2) {
    if (follows1.length > follows2.length) {
      return follows1
    } else if (follows1.length < follows2.length) {
      return follows2
    } else if (follows1.length === follows2.length) {
      // identify the number of same follow who depend to follows1
      let count = 0
      follows1.forEach(follow1 => {
        follows2.forEach(follow2 => {
          if (follow1 === follow2) {
            count++
          }
        })
      })
      if (count === follows1.length) {
        return follows1
      } else {
        return true
      }
    }
  }

  // function deleting redundancys in array of follows
  function filterScripts (scripts) {
    let newScripts = [...scripts]

    // loop on reference script
    scripts.forEach(script => {
      // prepare array for comparing
      let otherFollows = [...newScripts]

      // if the analysed script still exist
      if (otherFollows.includes(script)) {
        // remove the analysed script
        otherFollows.splice(otherFollows.indexOf(script), 1)

        // loop on the comparing array
        for (var i = 0; i < otherFollows.length; i++) {
          let tg = otherFollows[i]
          if (noRedundancy(script, tg) === script) {
            newScripts.splice(newScripts.indexOf(tg), 1)
          } else if (noRedundancy(script, tg) === tg) {
            newScripts.splice(newScripts.indexOf(script), 1)
            break
          } else if (noRedundancy(script, tg) === true) {
            // nothing - the 2 follows are relevants
          }
        }
      }
    })

    return newScripts
  }

  // start with the highest rank : rank_A
  // loop on this rank
  ranks_A.forEach(rank_A => {
    let rank_AEndDate = new Date(rank_A['end_date'])
    let follows = []

    // construct all follows for this rank_A
    // loop on the below rank : rank_B
    ranks_B.forEach(rank_B => {
      if (Date.parse(rank_B['availability_date']) <= rank_AEndDate) {
        let follow = {
          budget_line: rank_A['budget_line'],
          last_owner: rank_A['username'],
          rank_last_owner: rank_A['rank'],
          release_date: rank_A['end_date'],
          new_owner: rank_B['username'],
          last_rank_new_owner: rank_B['rank']
        }

        // all possibles follows for this rank_A
        follows.push(follow)
      }
    })

    // construct array for comparisons of follows (type rank_A)
    arrayFollows.push(follows)
  })

  // construct array of scripts (on script = many compatibles follows)
  let scripts = []

  // loop on array of follows
  arrayFollows.forEach(follows => {
    follows.forEach(follow => {
      result = searchMatchsFollows(follow, arrayFollows.indexOf(follow) + 1)
      scripts = scripts.concat(result)
    })
  })

  scripts = filterScripts(scripts)

  const promise = new Promise((resolve, reject) => {
    resolve(scripts)
  })

  promise
    .then(data => {
      res.send(data)
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || 'There are some error while retrieving elements.'
      })
    })
}

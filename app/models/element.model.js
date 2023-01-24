module.exports = (sequelize, Sequelize) => {
  const Element = sequelize.define("element", {
    username: {
      type: Sequelize.STRING
    },
    rank: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    },
    availability_date: {
      type: Sequelize.DATE
    },
    end_date: {
      type: Sequelize.DATE
    },
    budget_line: {
      type: Sequelize.STRING
    }
  });

  return Element;
};

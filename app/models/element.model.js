module.exports = (sequelize, Sequelize) => {
  const Element = sequelize.define("element", {
    title: {
      type: Sequelize.STRING
    },
    description: {
      type: Sequelize.STRING
    },
    published: {
      type: Sequelize.BOOLEAN
    },
    field4: {
      type: Sequelize.STRING
    },
    field5: {
      type: Sequelize.STRING
    }
  });

  return Element;
};

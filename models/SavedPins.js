module.exports = (sequelize, DataTypes) => {
  const SavedPins = sequelize.define("SavedPins", {
    googleId: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    imageUrl: {
      type: DataTypes.STRING,
      unique: false,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
  });

  return SavedPins;
};

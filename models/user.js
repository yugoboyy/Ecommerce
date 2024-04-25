'use strict';
const {
  Model
} = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Order)
      User.belongsToMany(models.Product, {
        through: models.Order,
        foreignKey: 'UserId'
      })
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Email is required'
        },
        notNull: {
          msg: 'Email is required'
        },
        isEmail: {
          args: true,
          msg: 'Format email not valid'
        },
      },
      unique: {
        args: true,
        msg: 'Email is registered'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Password is required'
        },
        notNull: {
          msg: 'Password is required'
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Type is required'
        },
        notNull: {
          msg: 'Type is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User',
    hooks: {
      beforeCreate(obj) {
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(obj.password, salt);
        obj.password = hash
      }
    }
  });
  return User;
};
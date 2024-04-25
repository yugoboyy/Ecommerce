'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
    }

    get formatDate() {
      return this.dateOfBirth.toISOString().split('T')[0]
    }
  }
  Account.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Name is required'
        },
        notNull: {
          msg: 'Name is required'
        }
      }
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Date of Birth is required'
        },
        notNull: {
          msg: 'Date of Birth is required'
        }
      }
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Gender is required'
        },
        notNull: {
          msg: 'Gender is required'
        }
      }
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'User Id Id is required'
        },
        notNull: {
          msg: 'User Id is required'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};
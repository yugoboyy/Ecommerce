'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Order.belongsTo(models.User)
      Order.belongsTo(models.Product)
    }

    get formatDate() {
      return this.createdAt.toISOString().split('T')[0]
    }
  }
  Order.init({
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
    ProductId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    UserId: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Amount is required'
        },
        notNull: {
          msg: 'Amount is required'
        }
      }
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty:{
          msg: 'Quantity is required'
        },
        notNull: {
          msg: 'Quantity is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: "-"
    }
  }, {
    sequelize,
    modelName: 'Order',
    hooks: { 
      beforeCreate(data, opt) {
          data.amount = data.quantity * data.amount
      }
    }
  });
  return Order;
};

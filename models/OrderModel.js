import { Sequelize } from "sequelize";
import db from "../config/Database.js";

import Users from "./UserModel.js";
import Customers from "./CustomerModel.js";
import PaymentType from "./PaymentType.js";

const { DataTypes } = Sequelize;

const Orders = db.define(
  "orders",
  {
    uuid: {
      type: DataTypes.STRING,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    paymentTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },

  },
  {
    freezeTableName: true,
  }
);

Users.hasOne(Orders);
Orders.belongsTo(Users, { foreignKey: "userId" });

Customers.hasOne(Orders);
Orders.belongsTo(Customers, { foreignKey: "customerId" });

PaymentType.hasOne(Orders);
Orders.belongsTo(PaymentType, { foreignKey: "paymentTypeId" });

export default Orders;
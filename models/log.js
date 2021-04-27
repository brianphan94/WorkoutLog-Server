const {DataTypes} = require('sequelize');
const database = require('../db');

module.exports = database.define('user-log', {
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    
    definition: DataTypes.STRING,

    result: DataTypes.STRING,

    owner_id: DataTypes.INTEGER
})
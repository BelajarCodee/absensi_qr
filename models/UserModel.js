const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

const User = db.define('User', {
    uuid:{
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    jurusan:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    kelas:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type: DataTypes.STRING,
        allowNull: false,
        uniqen: true,
        validate:{
            isEmail: true
        }
    },
    password:{
        type: DataTypes.STRING,
        allowNull: false,
        validate:{
            len: [8]
        }
    },
    role:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user',
    },
    qr:{
        type: DataTypes.STRING,
        allowNull: false,
    }
});


module.exports = User;
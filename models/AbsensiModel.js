const {Sequelize, DataTypes} = require('sequelize');
const db = require('../config/database');

const Absensi = db.define('Absensi', {
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
    hari:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    masuk:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    pulang:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    keterangan:{
        type: DataTypes.STRING,
        allowNull: false,
    },
});


module.exports = Absensi;
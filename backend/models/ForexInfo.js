module.exports = (sequelize, DataTypes) => {
    const ForexInfo = sequelize.define("ForexInfo", {
        
        date: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        initial: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        high: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        low: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        open: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        volume: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        
    })

    return ForexInfo
}
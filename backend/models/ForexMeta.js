module.exports = (sequelize, DataTypes) => {
    const ForexMeta = sequelize.define("ForexMeta", {
        
        time: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        open: {
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
        close: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        tick_volume: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
    
        
    })

    return ForexMeta
}
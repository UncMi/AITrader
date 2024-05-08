const express = require("express");
const router = express.Router();
const { spawnSync } = require('child_process');
const { ForexMeta } = require("../models");
const { sequelize, Sequelize } = require('../models');

const forexData = [];

router.post("/", async (req, res) => {

    const { iterations } = req.body;

    if (!iterations || isNaN(iterations) || iterations <= 0) {
        return res.status(400).json({ error: 'Invalid or missing number of iterations' });
    }
    for (let iter = 0; iter < iterations; iter++) {
        const existingTables = await sequelize.getQueryInterface().showAllTables();
        let tableName = 'forexmeta';

        if (existingTables.includes('forexmeta')) {
            let index = 1;
            while (existingTables.includes(`forexmeta_${index}`)) {
                index++;
            }
            tableName = `forexmeta_${index}`;
        } else {
            tableName = 'forexmeta';
        }

        console.log(tableName);

        const ForexInstance = sequelize.define(tableName, {
            time: Sequelize.FLOAT,
            open: Sequelize.FLOAT,
            high: Sequelize.FLOAT,
            low: Sequelize.FLOAT,
            close: Sequelize.FLOAT,
            tick_volume: Sequelize.FLOAT
        }, {
            tableName: tableName // Explicitly specify the table name
        });

        // Synchronize the model with the database
        try {
            await ForexInstance.sync();
        } catch (error) {
            console.error(`Error synchronizing model with database: ${error.message}`);
            return res.status(500).json({ error: 'Error synchronizing model with database' });
        }

        const pythonProcess = spawnSync('python', ['../python/randomforexinfo.py']);

        if (pythonProcess.stderr.length > 0) {
            console.error(`Error executing Python script: ${pythonProcess.stderr.toString()}`);
            return res.status(500).json({ error: 'Error executing Python script' });
        }

        const forexInfo = pythonProcess.stdout.toString('utf-8').trim();
        const rows = forexInfo.split('0\r\n');
        console.log("post received");

        for (let i = 1; i < rows.length; i++) {
            const row = rows[i].trim();
            const elements = row.split(/\s+/);

            if (elements.length < 7) {
                console.error(`Incomplete data at row ${i + 1}: ${row}`);
                continue;
            }

            const time = parseFloat(elements[1]);
            const open = parseFloat(elements[2]);
            const high = parseFloat(elements[3]);
            const low = parseFloat(elements[4]);
            const close = parseFloat(elements[5]);
            const tick_volume = parseFloat(elements[6]);

            try {
                const instance = await ForexInstance.create({
                    time,
                    open,
                    high,
                    low,
                    close,
                    tick_volume
                });
                console.log(`Row ${i} processed`);
                forexData.push(instance);
            } catch (error) {
                console.error(`Error creating Forex instance at row ${i}: ${error.message}`);
                return res.status(500).json({ error: 'Error saving Forex data' });
            }
        }

    }
    

    return res.status(200).json({ message: 'Forex data saved successfully', data: forexData });
});




router.get("/", async (req, res) => {
    try {
        const dataLengths = {};
        const forexData = await ForexMeta.findAll();
        for(let i=1; i<1000; i++){
            const tableName = `forexmeta_${i}`;
            const forexQueryResult =  await sequelize.query(`SELECT COUNT(*) AS count FROM ${tableName}`);
            const count = forexQueryResult[0][0].count;
            dataLengths[tableName] = count;
        }
        console.log("DataLengths: ", dataLengths)
        return res.status(200).json({ dataLength: dataLengths.length });
    } catch (error) {
        console.error(`Error fetching Forex data: ${error.message}`);
        return res.status(500).json({ error: 'Error fetching Forex data' });
    }
});

module.exports = router;

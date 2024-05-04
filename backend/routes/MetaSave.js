const express = require("express");
const router = express.Router();
const { spawnSync } = require('child_process'); // Changed to spawnSync for synchronous execution
const { ForexMeta } = require("../models");
const { sequelize } = require('../models');

const forexData = [];

router.post("/", async (req, res) => {

    const pythonProcess = spawnSync('python', ['../python/randomforexinfo.py']);

    if (pythonProcess.stderr.length > 0) {
        console.error(`Error executing Python script: ${pythonProcess.stderr.toString()}`);
        return; // Return if there's an error
    }
    
    forexInfo = pythonProcess.stdout.toString('utf-8').trim();
    const rows = forexInfo.split('0\r\n');
    const data = [];
    console.log("post received")
    // Process each row
    for (let i = 1; i < rows.length; i++) { 
        
        const row = rows[i].trim();
        const elements = row.split(/\s+/)


        


        if (elements.length < 7) {
            console.error(`Incomplete data at row ${i + 1}: ${row}`);
            continue; // Skip this row if it's incomplete
        }
        console.log(elements)
        
        const time =  parseFloat(elements[1])
        const open = parseFloat(elements[2])
        const high = parseFloat(elements[3])
        const low = parseFloat(elements[4])
        const close = parseFloat(elements[5])
        const tick_volume = parseFloat(elements[6])
        
        try {
            const ForexInstance = await ForexMeta.create({
                time,
                open,
                high,
                low,
                close,
                tick_volume
            });
            console.log(`Row ${i} processed`);
            forexData.push(ForexInstance);
        } catch (error) {
            console.error(`Error creating Forex instance at row ${i}: ${error.message}`);
            return res.status(500).json({ error: 'Error saving Forex data' }); // Sending error response
        }
    }

    return res.status(200).json({ message: 'Forex data saved successfully', data: forexData }); // Sending success response
});

module.exports = router;

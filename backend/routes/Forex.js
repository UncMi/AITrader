const express = require("express");
const router = express.Router();
const { spawnSync } = require('child_process');
const { ForexInfo } = require("../models");
const { json } = require("sequelize");

let forexInfo = {};
let jsonData = {};
let test = {};
// Function to fetch data from Python script
function fetchDataFromPython() {
    const pythonProcess = spawnSync('python', ['../python/metatrader.py']);

    if (pythonProcess.stderr.length > 0) {
        console.error(`Error executing Python script: ${pythonProcess.stderr.toString()}`);
        return; // Return if there's an error
    }

    forexInfo = pythonProcess.stdout.toString('utf-8').trim();
    const rows = forexInfo.split('0\r\n');
    const data = [];

    // Process each row
    for (let i = 1; i < rows.length; i++) { // Start from index 1 to skip the header row
        
         const row = rows[i].trim();
        // if (row.length === 0) continue; // Skip empty rows

        // // Split the row into individual elements by whitespace
        const elements = row.split(/\s+/)
        // Create an object for the row data
        const rowData = {
            time: parseFloat(elements[1]),
            open: parseFloat(elements[2]),
            high: parseFloat(elements[3]),
            low: parseFloat(elements[4]),
            close: parseFloat(elements[5]),
            tick_volume: parseFloat(elements[6]),
        };
    
        // Check if any parsed value is not a valid float
        // Push the row data to the array
        data.push(rowData);
    }

    // Convert the parsed data to JSON
    jsonData = data

    console.log("Python script execution completed.");
}

// Initial data fetch
fetchDataFromPython();

// Set interval to periodically fetch data from Python script
const interval = setInterval(fetchDataFromPython, 60000); 

// Route handler for fetching forex info
router.get("/", async (req, res) => {
    // Send the forexInfo as response to the client
    res.json(jsonData);
});


module.exports = router;

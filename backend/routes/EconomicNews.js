const express = require("express");
const router = express.Router();
const { spawnSync } = require('child_process');

// Function to call Python script and get economic data
function fetchEconomicData() {
    const pythonProcess = spawnSync('python', ['../python/newsscrape.py']);

    if (pythonProcess.stderr.length > 0) {
        throw new Error(`Error executing Python script: ${pythonProcess.stderr.toString()}`);
    }

    const pythonOutput = pythonProcess.stdout.toString('utf-8').trim();
    let data;

    try {
        data = JSON.parse(pythonOutput); // Assuming the Python script returns JSON
    } catch (e) {
        throw new Error(`Error parsing Python script output: ${e}`);
    }

    return data;
}

// Route to get economic events
router.get("/", (req, res) => {
    try {
        const events = fetchEconomicData();
        res.json(events.slice(0, 3)); // Return only the first 3 events
    } catch (error) {
        console.error(error);
        res.status(500).send("Error fetching economic events data");
    }
});

module.exports = router;

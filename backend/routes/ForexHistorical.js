const express = require("express");
const router = express.Router();
const csv = require('csv-parser');
const fs = require('fs');
const { ForexInfo } = require("../models");
const { Readable } = require('stream');
const { createDeflate } = require("zlib");

const filePath = require("path").resolve(__dirname, "./EURUSD1.csv");

router.get("/", async (req, res) => {
    let limitValue = 5;

    //checks if there is an additional limitValue in the query "/api/forex?limit=10"
    if(req.query.limit && !isNaN(parseInt(req.query.limit))) {
        limitValue = parseInt(req.query.limit);
    }

    const listOfForex = await ForexInfo.findAll({limit:limitValue});
    res.json(listOfForex);
});

router.post("/", async (req, res) => {

    const forexData = [];

    try {
        // Create a readable stream from the CSV file content
        
        const readableStream = fs.createReadStream(filePath);
        const forexData = [];
        

        readableStream
        .pipe(csv())
        .on('data', async (row) =>{
            const rowData = Object.values(row)[0].split('\t');
            console.log(rowData);
            const date = rowData[0];
            const initial = parseFloat(rowData[1]);
            const high = parseFloat(rowData[2]);
            const low = parseFloat(rowData[3]);
            const open = parseFloat(rowData[4]);
            const volume = parseFloat(rowData[5]);

            const forexInstance = await ForexInfo.create({
                date,
                initial,
                high,
                low,
                open,
                volume,
            });
            forexData.push(forexInstance);

        })
        .on('end', () => {
            console.log("CSV file successfully processed");
            // Respond with success message or forexData
            res.status(200).json({ message: "CSV file successfully processed", data: forexData });
        });
       
        
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
});




module.exports = router;

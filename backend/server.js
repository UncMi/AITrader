const express = require('express');
const mysql = require('mysql');
const db = require('./models');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const postRouter = require("./routes/Posts");
const forexInfoRouter = require("./routes/Forex");
const forexHistorical = require("./routes/ForexHistorical");
const metaData = require("./routes/MetaSave");
const economicNewsRouter = require("./routes/EconomicNews");

app.use("/posts", postRouter);
app.use("/forex", forexInfoRouter);
app.use("/forexh", forexHistorical);
app.use("/meta", metaData);
app.use("/economicnews", economicNewsRouter); 

db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on 3001");
    });
});

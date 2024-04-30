

const express = require('express');
const mysql = require('mysql');
const db = require('./models');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

const postRouter = require("./routes/Posts")
const forexInfoRouter = require("./routes/Forex")
const forexHistorical = require("./routes/ForexHistorical")

app.use("/posts", postRouter);
app.use("/forex", forexInfoRouter);
app.use("/forexh", forexHistorical);


db.sequelize.sync().then(() => {
    app.listen(3001, () => {
        console.log("Server running on 3001");
    });
});


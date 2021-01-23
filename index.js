const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const postRouter = require('./routes/postRoutes');

const app = express();

var fs = require('fs');
var dir = './uploads';

if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
}


mongoose.connect(process.env.MONGODB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log("connected to database"))
    .catch(err => console.log(err.getMessage()));

app.use('/posts', postRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
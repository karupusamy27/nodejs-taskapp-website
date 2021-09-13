const mongoose = require("mongoose");

const mongooseUrl = process.env.MONGODB_URL;

//Database connection
//useCreateIndex:true
mongoose.connect(mongooseUrl, { useNewUrlParser: true });

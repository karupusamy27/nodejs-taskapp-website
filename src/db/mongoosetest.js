const mongoose = require('mongoose');

const mongoURL = MONGODB_URL;

//Database connection
mongoose.connect(mongoURL,{useNewUrlParser:true});

//Model Creation
const Task=mongoose.model('task',{
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    }
});

//Instance creation
const inst = new Task({
    description:' Learn the Mongoose library    ',
    completed:true
});

//Save data to database
inst.save().then((result)=>{
    console.log(result)
}).catch((error)=>{
    console.log(error)
})

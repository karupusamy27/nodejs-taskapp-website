const mongoose = require('mongoose');

//Schema Creation
const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true,
        trim:true
    },
    completed:{
        type:Boolean,
        required:false,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref: 'User'
    }
},{
    timestamps : true
})
//Model Creation
const Task=mongoose.model('Task',taskSchema);

module.exports=Task;
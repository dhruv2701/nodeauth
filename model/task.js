const mongoose  = require('mongoose');
const taskSchema = new mongoose.Schema({
    description:{
        type:String,
        required:true 
    },
    isCompleted:{
        type:Boolean,
        default:false
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    }
})


const Task = mongoose.model('task', taskSchema)
module.exports = Task;

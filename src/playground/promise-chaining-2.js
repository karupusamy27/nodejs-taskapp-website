require("../db/mongoose");
const Task=require("../models/task");

//Promise chaining
/*
Task.findByIdAndDelete({_id:'612e2343e3ca68154abcd1b9'}).
then((task)=>{
    console.log(task);
    return Task.countDocuments({completed:true});
}).then((count)=>{
    console.log(count);
}).catch((error)=>{
    console.log(error);
})
*/

//Async-Await
const deleteTaskAndCount= async (id,completed)=>{
    const task = await Task.findByIdAndDelete(id);
    const count =await Task.countDocuments(completed);
    return count;
}

deleteTaskAndCount('612f3207947b4c9f28a180c5',false).then((count)=>{
    console.log(count);
}).catch((error)=>{
    console.log(error);
});

require("../db/mongoose");
const User = require("../models/user");

//Promise chaining
/*
User.findByIdAndUpdate({_id:'612dd87325713220d9ea73c5'},{age:24}).
then((user)=>{
    console.log(user);
    return User.countDocuments({age:24})
}).then((count)=>{
    console.log(count);
})
.catch((error)=>{
    console.log(error);
})
*/

//Async-Await
const updateUserAndCount=async (id,age)=>{
    const user=await User.findByIdAndUpdate(id,{age});
    const count=await User.countDocuments({age});
    return count;
};

updateUserAndCount('612e14c281b8682217892a5f',24).
    then((count)=>{
        console.log(count);
    }).catch((error)=>{
        console.log(error);
    })
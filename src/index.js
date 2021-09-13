const express = require("express");
require("./db/mongoose");
const userRouter=require("./routers/user");
const taskRouter=require("./routers/task");
const Task = require("./models/task");
const User = require("./models/user");

const app = express();
const port = process.env.PORT | 3000;

// const multer = require('multer');

// const upload = multer({
//   dest:'upload',
//   limits:{
//     fileSize:1000000
//   },
//   fileFilter(req,file,callback){
//     if(!file.originalname.match(/\.(pdf)$/)){
//       callback(new Error('Please update the PDF document!!!'));
//     }
//     callback(undefined,true);
//   }
// });

// app.post('/upload',upload.single('upload'),(req,res)=>{
//      res.status(200).send();
// },
// (error,req,res,next)=>{
//   res.status(400).send({error:error.message})
// })

/*
//Middleware
app.use((req,res,next)=>{
  //res.status(503).send('Maintanance');
  console.log(req.method);
  console.log(req.path);
  next()
})
*/

// Setup Relationship between two models

// const taskUser = async()=>{
//   try{
//     // const task = await Task.findById('613857ba7877f502423bf7a7');
//     // await task.populate('owner');
//     // console.log(task.owner.toString());
//     const user= await User.findById('613847e523fadca02c44afc1');
//     await user.populate('tasks');
//     //console.log(user.tasks);
//   }catch(e){
//     //console.log(e);
//   }
// }

// taskUser();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server is up and running on ${port}!!!`);
});

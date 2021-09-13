const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth");
const router = new express.Router();

// router.post("/task", async (req, res) => {
//   //Instance creation

//   const user = await Task(req.body).save();
//   try {
//     res.status(201).send(user);
//   } catch (e) {
//     res.status(404).send(e);
//   }
//   /*new Task(req.body)
//       .save()
//       .then((result) => {
//         res.send(result);
//       })
//       .catch((error) => {
//         res.status(400).send(error);
//       });*/
// });

router.post("/task",auth,async(req,res)=>{
  const task = new Task({
    ...req.body,
    owner:req.user._id
  });
  try{
    await task.save();
    res.status(201).send(task);
  }catch(e){
    res.send(401).send();
  }
});

//GET /tasks?completed=true
//GET /tasks?limit=2&skip=2
//GET /tasks?sortBy
router.get("/tasks",auth, async (req, res) => {

  const match = {};
  const sort = {};

  if(req.query.completed){
    match.completed = req.query.completed;
  }

  if(req.query.sortBy){
    const parts = req.query.sortBy.split('_');
    sort[parts[0]]=parts[1]==='desc'?-1:1;
  }
 
  try {
     //const users = await Task.find({owner:req.user._id});
    await req.user.populate({
      path:'tasks',
      match,
      options:{
        limit:parseInt(req.query.limit),
        skip:parseInt(req.query.skip),
        sort
      }
    });
    res.status(201).send(req.user.tasks);
  } catch (e) {
    console.log(e);
  }
  /*Task.find({}).then((tasks)=>{
          res.send(tasks);
      }).catch((error)=>{
          res.send(error);
      })*/
});

router.get("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id;

  try {
    //const task = await Task.findById({ _id });
    const task = await Task.findOne({_id,owner:req.user._id});
    if (!task) {
      return res.status(404).send();
    }
    res.status(201).send(task);
  } catch (e) {
    res.status(500).send(e);
  }
  /*Task.findById({_id}).then((task)=>{
          if(!task){
              return res.status(404).send();
          }
          res.send(task)
      }).catch((error)=>{
          res.status(500).send(error)
      })*/
});

router.patch("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowUpdates = ["description", "completed"];
  const validate = updates.every((update) => allowUpdates.includes(update));

  if (!validate) {
    return res.status(400).send({ error: "Invalid Property Update!!!" });
  }

  try {
    const task = await Task.findOne({_id,owner:req.user._id});
    // const task = await Task.findByIdAndUpdate({ _id, owner:res.user._id }, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update)=>(task[update]=req.body[update]))
    await task.save();
    res.status(200).send(task);
  } catch (e) {
    res.status(500).send(e);
  }

  /*Task.findByIdAndUpdate({_id},req.body,{new:true,runValidators:true}).
    then((task)=>{
      res.status(200).send(task)
    }).catch((error)=>{
      res.status(500).send(error)
    })*/
});

router.delete("/tasks/:id",auth, async (req, res) => {
  const _id = req.params.id;

  try {
    // task = await Task.findByIdAndDelete({ _id,owner : req.user._id });
    task = await Task.findByOneAndDelete({ _id,owner : req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.status(200).send(task);
  } catch (e) {
    res.status(404).send(e);
  }
  /*
    Task.findByIdAndDelete({_id}).then((task)=>{
      res.status(200).send(task);
    }).catch((error)=>{
      res.status(500).send(task)
    })*/
});

module.exports = router;

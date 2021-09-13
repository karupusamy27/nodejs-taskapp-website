const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const router = new express.Router();
const bcrypt = require("bcryptjs");
const sharp = require("sharp");
const {welcomeEmail,cancelEmail} = require("../emails/account");

router.post("/users", async (req, res) => {
  //Setup Instance
  const inst = new User(req.body);
  //Save data to database

  try {
    const user = await inst.save();
    welcomeEmail(user.email,user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(404).send(e);
  }
  /*inst
      .save()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(400).send(error);
      });*/
});

router.get("/users/me", auth, (req, res) => {
  res.send(req.user);
});

router.get("/users", auth, async (req, res) => {
  try {
    const users = await User.find({});
    res.status(201).send(users);
  } catch (e) {
    res.status(500).send(e);
  }
  /*User.find({}).then((users)=>{
          res.send(users)
      }).catch((error)=>{
          res.send(error);
      })*/
});

router.get("/users/me", auth, (req, res) => {
  console.log(token);
});

// router.get("/users/:id", async (req, res) => {
//   const _id = req.params.id;

//   try {
//     const user = await User.findById({ _id });
//     const token = await user.generateAuthToken();
//     if (!user) {
//       return res.status(404).send("User Not found");
//     }
//     res.status(201).send({ user, token });
//   } catch (e) {
//     res.status(500).send(e);
//   }
//   /*User.findById(_id).then((user)=>{
//           if(!user){
//               return res.status(404).send();
//           }
//           res.send(user)
//       }).catch((error)=>{
//           res.send(error);
//       })*/
// });

router.patch("/users/me", auth, async (req, res) => {
  // const _id = req.params.id;
  const updates = Object.keys(req.body);
  const allowUpdates = ["name", "age", "password", "email"];
  const validation = updates.every((update) => allowUpdates.includes(update));
  if (!validation) {
    return res.status(404).send({ error: "Invalid Property Update!!!" });
  }

  try {
    //const user = await User.findById({ _id });
    const user = req.user;
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    /*
    const user = await User.findByIdAndUpdate({ _id }, req.body, {
      new: true,
      runValidators: true,
    });
    */
    // if (!user) {
    //   return res.status(404).send();
    // }
    res.status(200).send(user);
  } catch (e) {
    res.status(500).send(e);
  }
  /*
    User.findByIdAndUpdate({_id},req.body).then((user)=>{
      res.send(user);
    }).catch((error)=>{
      console.log(error);
    })
    */
});

router.post("/users/login", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email });
    const token = await user.generateAuthToken();
    if (!user) {
      throw new Error("Unable to login!!!");
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      throw new Error("Unable to login!!!");
    }
    res.send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
});

router.post("/users/logout", auth, async(req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
    await req.user.save();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(404).send();
  }
});

router.delete("/users/me", auth, async (req, res) => {
  //const _id = req.params.id;
  //const _id=req.user._id;

  try {
    // const user = await User.findOneAndDelete({ _id });
    // if (!user) {
    //   res.status(404).send();
    // }
    //const user=await User.findByIdAndDelete({_id});
    cancelEmail(req.user.email,req.user.name);
    await req.user.remove();
    res.status(200).send(req.user);
  } catch (e) {
    res.status(500).send(e);
  }
  /*
    User.findOneAndDelete({_id}).then((user)=>{
      res.status(200).send(user)
    }).catch((error)=>{
      res.status(500).send(e)
    })
    */
});

const multer=require("multer");

const avatar=multer({
  // dest:'avatar',
  limits:{
    fileSize:1000000
  },
  fileFilter(req,file,callback){
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
      return callback(new Error('Please upload Image document!!!'));
    }
    callback(undefined,true);
  }
});

router.post('/users/me/avatar',auth,avatar.single('avatar'),async(req,res)=>{
  try{
    const buffer= await sharp(req.file.buffer).resize({width:250,height:250}).png().toBuffer();
    req.user.avatar = buffer;
    await req.user.save();
    res.status(200).send()
  }catch(e){
    res.status(500).send()
  }
},
(error,req,res,next)=>{
  res.status(404).send({error:error.message})
});

router.delete('/users/me/avatar',auth,avatar.single('avatar'),async(req,res)=>{
    req.user.avatar = undefined;
    await req.user.save();
    res.status(200).send()
},
(error,req,res,next)=>{
  res.status(404).send({error:error.message})
});

router.get('/users/:id/avatar',async (req,res)=>{
  try{
    const user= await User.findById(req.params.id);
    if(!user || !user.avatar){
      throw new Error("Unable to fetch user's avatar");
    }
    res.set('Content-Type','image/png');
    res.status(200).send(user.avatar);
  }catch(e){
    res.status(500).send(e)
  }
})

module.exports = router;

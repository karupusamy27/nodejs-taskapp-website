const jwt =require('jsonwebtoken');
const User=require('../models/user');

const auth =async (req,res,next)=>{
     const token = req.header('Authorization').replace('Bearer ','');
     const decoded= jwt.verify(token,process.env.JWT_SECRET);
     const user = await User.findOne({_id:decoded,'tokens.token':token});
     try{
        if(!user){
            throw new Error('Unable to find user')
        }
        req.user=user;
        req.token=token;
        next();
     }catch(e){
         res.status(401).send({'error':'Please authenticate'});
     }
};

module.exports = auth;

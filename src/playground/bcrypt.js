const bcrypt=require('bcryptjs');

const hashAlgorithm =async (password)=>{
    const hashValue=await bcrypt.hash(password,7);
    console.log(hashValue);
    const isMatch=await bcrypt.compare('Karupu@123',hashValue);
    console.log(isMatch);
};

hashAlgorithm('karupu@123');

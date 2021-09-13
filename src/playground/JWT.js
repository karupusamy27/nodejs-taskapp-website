const jwt = require("jsonwebtoken");

const JWTtoken = async (_id) => {
  const token = await jwt.sign({ _id }, "karupu", { expiresIn: "10 seconds" });
  console.log(token);
  setTimeout(async () => {
    const isVerify = await jwt.verify(token, "karupu");
    try {
      console.log("Token is valid");
    } catch (e) {
      console.log(isVerify);
    }
  }, 3000);
};

JWTtoken("karupu123");

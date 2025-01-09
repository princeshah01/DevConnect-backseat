const validator = require("validator");

const validateLogIn = async (req) => {

    const { emailId , password} = req?.body  ;
if(!emailId || !validator.isEmail(emailId)){
    throw new Error("Invalid Email Id") ;
}
if(!password || !validator.isStrongPassword(password)){
    throw new Error("Invalid password") ;
}


};

module.exports = validateLogIn;

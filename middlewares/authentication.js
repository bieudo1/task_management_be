const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const {AppError} = require("../helpers/utils");

const authentication = {}

authentication.loginRequired = (req, res, next) => {
    try{
        const tokenString = req.headers.authorization;
        if(!tokenString) c

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (err, payload) => {
            if(err) {
                if(err.name === "TokenExpiredError"){
                    throw new AppError(401 , "Token Expired","Authentication Error ,")
                }else{
                    throw new AppError(401 , "Token is invalid","Authentication Error ,")
                }
            }
            rep.userId = payload._id;
        });
        next();
    }catch(err){
        next(err);
    }
}

module.exports = authentication;
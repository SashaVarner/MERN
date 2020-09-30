const jwt = require('jsonwebtoken');
const config = require('config');


//This is a middleware function, it takes in request, response and next
//Next is a callback we have to run once we're done so it moves on to the next middleware
module.exports = function (req, res, next) {
    //Get token from header
    const token = req.header('x-auth-token');

    //Check if no token
    if (!token) {
        return res.status(401).json({
            msg: 'No token, authorization denied'
        });
    }

    //Verify Token
    try {
        const decoded = jwt.verify(
            token,
            config.get("jwtSecret"));
        req.user = decoded.user;
        next();
     } catch (err) {
        res.status(401).json({
            msg: 'Token is not valid'
        });
    }
}
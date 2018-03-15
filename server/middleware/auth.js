//this middleare is for api/logout and '/api/auth'
// checks if users login and logout 
//auth gets the unique token so server knows who the exact user is 
const { User } = require('./../models/user');

let auth = (req, res , next) => {

    //this gets unique jwt token 
    let token = req.cookies.auth; 

    //findByToken function is defined in user.js 
    User.findByToken(token, (err, user) => {
        //if token is not valid do this 
        if(err) throw err;
        if(!user) return res.json({
            error: true
        }); 

        //if token is valid do this and call next which does to (req,res) /logout 
        req.token = token;
        req.user = user
        next(); 
    })
}

//gives a name to the middle and exports so it can be accessed in other files 
module.exports = { auth }
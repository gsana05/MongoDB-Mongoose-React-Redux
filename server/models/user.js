const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('./../config/config').get(process.env.NODE_ENV);
const SALT_I = 10;

const userSchema = mongoose.Schema({
    email:{
        type:String,
        required:true,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    name:{
        type:String,
        maxlength:100
    },
    lastname:{
        type:String,
        maxlength:100
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    }
})


//pre - before we save data 
userSchema.pre('save',function(next){
    var user = this;
//isModified is a mongoose method 
    if(user.isModified('password')){
        bcrypt.genSalt(SALT_I,function(err,salt){ //genSalt is from bcrypt module to encrypt password by the given number parameter
            if(err) return next(err); //if error do this 

            //hash is from bcrypt module 
            // salt is a method in bcrypt module 
            // salt adds extra characters on the end of a hashed password to make it more secure 
            bcrypt.hash(user.password,salt,function(err,hash){ 
                if(err) return next(err);
                user.password = hash; //saved hash version of password 
                next();
            })
        })
    } else {
        next()
    }
})

//CREATING THE METHODS TO BE USED IN SERVER.JS 

//comparePassword is not a method call it what you want, it just the name for the function 
//this function takes the password created by user and compares to bcrypt version and returns a cb (callback)
userSchema.methods.comparePassword = function(candidatePassword,cb){
    //compare is a method of bcrypt // this compares hashed (this.password) and non-hashed password (candidatePassword)
    // isMatch is a method 
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return cb(err); // if error do this 
        cb(null,isMatch); //if succesful do this 
    })
}

// JWT to verify the authenticity of a user //protect routes 
//generateToken is not a method call it what you want, it just the name for the function 
userSchema.methods.generateToken = function(cb){
    var user = this;
    //.sign() is a method of jwt and this creates a token 
    var token = jwt.sign(user._id.toHexString(),config.SECRET);

    //saves user with token 
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user)
    })
}

//statics is a mongoose method 
userSchema.statics.findByToken = function(token,cb){
    var user  = this;

    //verify is a jwt method 
    jwt.verify(token,config.SECRET,function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user)
        })
    })
}

// methods is a mongoose method 
userSchema.methods.deleteToken = function(token,cb){
    var user = this;

    //mongoDB/mongoose method: when using update method you have access to $unset 
    //$unset deletes token/particular field assigned to  - replaces element with null  
    user.update({$unset:{token:1}},(err,user)=>{
        if(err) return cb(err);
        cb(null,user)
    })
}

const User = mongoose.model('User', userSchema)

module.exports = { User }
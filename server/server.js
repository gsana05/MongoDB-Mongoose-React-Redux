const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const config = require('./config/config').get(process.env.NODE.ENV); //for production 
const app = express(); //express routing gives you access to (req,res, next)

//es6 promises
// promises are objects that represents and action that has not finished yet but will do at some point 
mongoose.Promise = global.Promise; // opens up mongoose to use the promise librar methods 
mongoose.connect(config.DATABASE) //connects mongoose to mongoDB 

//gives access to use mongoose models and schema 
const { User } = require('./models/user');
const { Book } = require('./models/book'); 

//allows access to auth middleware 
const { auth } = require('./middleware/auth')

//middleware
app.use(bodyParser.json()); //allows you to access the req.body within the routes
app.use(cookieParser()); //used for authentication - storing data

// GET 
// if user is logged in, you have access to this information 
// everytime user goes to new route in the app it runs auth to check you are authorised 
app.get('/api/auth',auth,(req,res)=>{
    res.json({
        isAuth:true,
        id:req.user._id,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname
    })
});

// when this route is requested it has to go through auth middleware
// once authorised next() takes it tot the (req,res) stage 
app.get('/api/logout',auth,(req,res)=>{
    //gets the function deleteToken from { User }
    req.user.deleteToken(req.token,(err,user)=>{
        if(err) return res.status(400).send(err);
        res.sendStatus(200)
    })
})

//a single book
app.get('/api/getBook', (req, res ) => {
    // locahost:3001/api/getBook?id=(_id) 
    //req: http request object - gives you access to the querry // locahost:3001/api/getBook
    //query: is ? and everything after // in url this allows to find unique id // ?
    // id: is the objectId number automatically genrated by mongoose // id=656564850558
    let id = req.query.id; 

    Book.findById(id, (err,doc) => { //findById is a method provided by mongoose 
        if(err) return res.status(400).send(err); //if error do this 
        res.send(doc); // if you get the book do this // DOC is ALL of the data for that id see robo-T 
    })
})

//GET all books 
app.get('/api/books',(req,res)=>{
    // locahost:3001/api/books?skip=3&limit=2&order=asc // this is the query part ?skip=3&limit=2&order=asc
    //parseInt: converts a string into integer (which is a whole number) mongo needs skip and limit to be a number
    let skip = parseInt(req.query.skip);
    let limit = parseInt(req.query.limit);
    let order = req.query.order;

    // ORDER = asc || desc
    // mongoDB/mongoose methods: find, skip, sort, limit and exec 
    Book.find().skip(skip).sort({_id:order}).limit(limit).exec((err,doc)=>{
        if(err) return res.status(400).send(err); // if error do this 
        res.send(doc); // DOC is ALL of the data for that id see robo-T //if sucessful do this 
    })
})


app.get('/api/getReviewer', (req, res) => {
    let id = req.query.id; 
//finds user by name 
    User.findById(id, (err, doc ) => {
        if(err) return res.status(400).send(err); // if error do this 
        res.json({
            name: doc.name,
            lastname: doc.lastname 
        })
    })
})

//finds all users // attention to the empty array if you have lots of users 
app.get('/api/users', (req, res) => {
    User.find({}, (err, users) => {
        if(err) return res.status(400).send(err); // if error do this 
        res.status(200).send(users)
    })
})

app.get('/api/user_posts', (req, res) => {
    //finds all the books that belong to the unique ownerId 
    //ownerId is one of results in the docs made by the books model schema you can call
    //query: the ? and everything after it in the url 
    Book.find({ownerId: req.query.user}).exec((err,docs) => {
        if(err) return res.status(400).send(err); // if error do this 
        res.send(docs); 

    })
})

// POST // 
//REQ.BODY holds parameters that are sent up from the client as part of a POST request
//ADDS BOOK
app.post('/api/book', ( req, res ) => {
    const book = new Book(req.body) //this gives you access to body schema put into "book" const 

    //save is a mongoose method 
    book.save((err,doc) =>{ //book is connected with mongoose so allows me to pull data out e.g doc._id 
        if(err) return res.status(400).send(err); // if there is an error do this 
        res.status(200).json({ // if book is saving do this 
            post:true,
//_id is coming from the database check robo-T to see. You can also use other variables look and see in robo-T
// shows a unique id for each book 
// DOC is ALL of the data for that id see robo-T 
            bookId: doc._id
        })
    })
})

app.post('/api/register',(req,res)=>{
    //allows access to the user mongoose model schema 
    const user = new User(req.body); 

    user.save((err,doc)=>{ // saves new user in database 
        if(err) return res.json({success:false}); //if error do this 
        res.status(200).json({ // if successful do this 
            success:true,
            user:doc
        })
    })
})

app.post('/api/login',(req,res)=>{
    //findOne mongoDB/mongoose method 
    // find a specific email and either return an error or the user details 
    User.findOne({'email':req.body.email},(err,user)=>{
        // if user is not found do this and exits the function 
        // isAuth is a method 
        if(!user) return res.json({isAuth:false,message:'Auth failed, email not found'})

        user.comparePassword(req.body.password,(err,isMatch)=>{
            if(!isMatch) return res.json({
                isAuth:false,
                message:'Wrong password'
            });

            // JWT to verify the authenticity of a user //protect routes // saves in cookies
            // e.g DreamTeam only authorised user can access routes to transfer players in their team 
            user.generateToken((err,user)=>{
                if(err) return res.status(400).send(err);
                //stores token in cookies 
                res.cookie('auth',user.token).json({
                    isAuth:true,
                    id:user._id,
                    email:user.email,
                    password: user.password
                })
            })
        })
    })
})

// UPDATE //
app.post('/api/book_update',(req,res)=>{
    // mongoDB/mongoose method findByIdAndUpdate 
    Book.findByIdAndUpdate(req.body._id,req.body,{new:true},(err,doc)=>{
        if(err) return res.status(400).send(err); // if error do this 
        res.json({ // if successful show the updated doc 
            success:true,
            doc
        })
    })
})

//DELETE //
app.delete('/api/delete_book',(req,res)=>{
    //req: http request object - gives you access to the querry // locahost:3001/api/getBook
    //query: is ? and everything after // in url this allows to find unique id // ?
    // id: is the objectId number automatically genrated by mongoose // id=656564850558
    let id = req.query.id;
    // mongoDB/Mongoose method findByIdAndRemove
    Book.findByIdAndRemove(id,(err,doc)=>{
        if(err) return res.status(400).send(err); //if error do this 
        res.json(true) //if successful do this 
    })
})

const port = process.env.port || 3001;
app.listen(port, () => {
    console.log('SERVER IS RUNNING');
})
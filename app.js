const express  =  require('express');
const app = express();
const mongoose =  require("mongoose");
const passport =  require("passport");
const bodyParser =  require("body-parser");
// we're calling in the mongoose schema user
const User = require("./models/user");

//we're setting up the strategy to provide security
const LocalStrategy =  require("passport-local");
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser()); 
passport.use(new LocalStrategy(User.authenticate()));

const passportLocalMongoose =  require("passport-local-mongoose"); ////simplifies the integration between Mongoose and Passport for local authentication
const twig = require('twig');

// views
app.set('view engine', 'html');
app.engine('html', twig.__express);
app.set('views','views');

const mongourl = "mongodb+srv://test_1:admintim@cluster0.p4iym.mongodb.net/node-auth?retryWrites=true&w=majority";

mongoose.connect(mongourl, { useUnifiedTopology: true });
app.use(require("express-session")({
    secret:"Hello i am talking right now", //decode or encode session, this is used to compute the hash.
    resave: false,              //What this does is tell the session store that a particular session is still active, in the browser
    saveUninitialized:false    //the session cookie will not be set on the browser unless the session is modified
}));

// add the bodyParser so we can return our information to the database
app.use(bodyParser.urlencoded({ extended:true }))
app.use(passport.initialize());
app.use(passport.session());

// start our server
const port = 3000;

app.listen(port ,function (err) {
    if(err){
        console.log(err);
    }else {
        console.log("Server Started At Port " + port);
    } 
});

// get our views set up
app.get("/", (req,res) =>{
    res.render("home")
})
app.get("/login", (req,res) =>{
    res.render("login")
})
app.get("/register", (req,res) =>{
    res.render("register")
})
app.get("/dashboard", (req,res) =>{
    res.render("dashboard")
})

// set up the functionality for registering a new user

app.post("/register",(req,res)=>{ 
    User.register(new User({            //passport-local-mongoose function to register a new user
    	username: req.body.username,
    	phone:req.body.phone,
    	}),
    	req.body.password,function(err,user){
        if(err){
            console.log(err);
        }
        passport.authenticate("local")(req,res,function(){ // authenticate the local session and redirect to login page
            console.log(req);
            res.redirect("/login");
        })    
    })

});
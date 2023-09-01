//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt =require("mongoose-encryption");
 
const app = express();

app.set("view engine","ejs");
mongoose.set("strictQuery",false);
 
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
 
mongoose.connect("mongodb://127.0.0.1:27017/userDB",{useNewUrlParser:true});
 
const userSchema = new mongoose.Schema ({
    email : String,
    password : String,
});

userSchema.plugin(encrypt, { secret: process.env.SECRET, excludeFromEncryption: ["email"] });


const User = mongoose.model("User", userSchema);
 
app.get("/",function(req, res){
    res.render("home");
});
 
app.get("/login",function(req, res){
    res.render("login");
});
 
app.get("/register",function(req, res){
    res.render("register");
});
 
app.post("/register", async(req, res) => {
    try{
        const newUser = new User({
            email : req.body.username,
            password : req.body.password
        });
 
    await newUser.save();
    console.log("Successfully inserted !");
    res.render("secrets");
    }catch(err){
        console.log(err);
             }
    });
    app.post("/login",function(req, res){
        const userName = req.body.username;
        const userPassword = req.body.password;
        
     
        findUser(userName,userPassword).then(function(foundUser){
            if(foundUser){
                if(foundUser.email === userName && foundUser.password === userPassword){
                res.render('secrets');
                }
            }
            else{
                res.render('login');
            }
        })
    });
    async function findUser(reqUsername, reqPassword) {  
        const findUser = await User.findOne({ email: reqUsername });
        if (findUser.password === reqPassword) {
            return findUser;
        }}

 
 
 
app.listen(3000, function(){
    console.log("Server started on port 3000.")
});  
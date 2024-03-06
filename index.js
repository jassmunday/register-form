const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const path = require("path");

const app = express();// to run the node server
dotenv.config(); //

const port =  process.env.PORT || 3000;

const user1 = process.env.MONGODB_USER;
const pswrd = process.env.MONGODB_PSWRD;



// Creating connection with mongodb database
mongoose.connect(`mongodb+srv://${user1}:${pswrd}@cluster0.faqdlfi.mongodb.net/registrationFormDB`);

// Create Schema(Structure/Design of Data) that is to be stored in MongoDB 
const registrationInfo = new mongoose.Schema({
    user:String, 
    email:String,
    password:String
})

// Creating the model of the schema
const registration = mongoose.model("registration",registrationInfo);

// to simplyfy the response
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// to listen the app on server
app.listen(port,() => {
    console.log(`Server is Running on ${port}`);
})


// creating the get request to server to load the registration form


app.get('/',(req,res) => {
   
   res.sendFile(__dirname+'/pages/index.html');
})

// creating post request to add credentials to the mongodb database
app.post('/register', async (req,res) => {
    try{
        
        const {user,email,password} = req.body;
        const existingUser = await registration.findOne({email:email})
        if(!existingUser){
            const data = new registration({
                user,
                email,
                password
            });
            await data.save();
            res.redirect('/success');
        }else{
            console.log("User Already Exists");
            res.redirect('/error');
        }
        
    }
   catch(error){
        console.log(error);
        res.redirect('/error');
   }
})

app.get('/success', (req,res) => {
    res.sendFile(__dirname+'/pages/success.html')
})

app.get('/error', (req,res) => {
    res.sendFile(__dirname+'/pages/error.html')
})
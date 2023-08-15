const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const router = express.Router();

const User = require('../models/adminSchema');

router.get('/', (req, res) =>{
    res.render('auth/login',{message:''});
});

router.get('/login',(req, res) =>{
    res.render('auth/login', {message:''});
});

router.post('/login', (req, res, next)=>{
  console.log(req.body);
 
    passport.authenticate('local', {
      successRedirect: '/admin',
      failureRedirect: '/auth/login',
      failureFlash: true
    })(req, res, next);
  
});

router.post('/create/:userName/:password',async (req, res) =>{

    const userName = req.params.userName;
    const password = req.params.password;
    await registerUser(userName, password);

    res.render('auth/login', {message:''});
});


async function registerUser(userName, password) {
  try {
    // Generate a salt to use for hashing the password
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user document with the hashed password
    const user = new User({
      userName: userName,
      password: hashedPassword
    });

    // Save the user document to the database
    await user.save();

    console.log(`User ${userName} registered successfully`);
  } catch (error) {
    console.error(`Error registering user: ${error.message}`);
  }
}

module.exports = router
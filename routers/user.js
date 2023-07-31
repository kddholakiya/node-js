const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userschema');


router.get('/', (req, res) => {
  res.render('home');
});
router.get('/login',(req,res)=>{
  res.render('login')
})
router.post('/login', 
async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.redirect('login');
    }

    req.session.isLoggedIn = true;
    req.session.user = user;
    req.session.save(err => {
      if (err) {
        console.log(err);
      }
      res.redirect('/user');
    });
  } catch (err) {
    console.log(err);
    res.render('login');
  }
}
);

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', async (req, res) => {
  const { name, email, password, password2 } = req.body;
  if (!name || !email || !password || !password2) {
    res.status(400).json({ error: 'All fields are required' }); 
  } else if (password.length < 6) {
    res.status(401).json({ error: 'Please enter a 6-digit password' }); 
  } else if (password !== password2) {
    res.status(500).json({ error: 'Passwords do not match' }); 
  } else {
    // Validation for an existing user
    const user = await User.findOne({ email });
    if (user) {
      res.status(400).json({ error: 'User already exists, try to login' }); 
    } else {
      const hashedPass = bcrypt.hashSync(password, 10);
      const newuser = new User({
        _id: new mongoose.Types.ObjectId(),
        name,
        email,
        password: hashedPass
      });
      newuser.save()
        .then((data) => {
          console.log(data.id, data.name);
          res.redirect('login'); 
        })
        .catch((err) => {
          console.error('Error while saving user:', err);
          res.status(500).json({ error: 'Server error' });
        });
    }
  }
});

module.exports = router;

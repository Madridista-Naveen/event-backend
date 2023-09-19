  const express = require('express')
  const { default: mongoose } = require("mongoose");
  const User = require('./models/User')
  const UserAuthentication = require('./models/userAuthentication'); 
  // const UserProfile = require('../models/UserProfile');
  const bcrypt = require('bcrypt');
  const router =  express.Router();

  const cors = require("cors");
  const { generateAuthToken } = require('./models/Auth');
  const app = express();

  app.use(cors({credentials:true,origin:'http://localhost:3000'}));
  app.use(express.json())

  mongoose.connect('mongodb+srv://admin:password321@cluster.4wui5nc.mongodb.net/?retryWrites=true&w=majority')


  app.post('/userRegister', async (req, res) => {
    const { name,  email, password } = req.body;
  
    if ( !name || !email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
  
    try {
      // Check if the email already exists in the database
      const existingUser = await UserAuthentication.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already exists.' });
      }
  
      // Hash the password before storing it in the database
      const hashedPassword = await bcrypt.hash(password, 10); // You can adjust the salt rounds
  
      // Create a new user document in UserAuthentication
      const newUser = new UserAuthentication({
        email,
        password: hashedPassword,
        name
      });
  
      await newUser.save();
  
      res.status(201).json({ message: 'Registration successful.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  });
  
  
app.post('/userLogin', async (req, res) => {
  const { email, password } = req.body;

  // Validate input data
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    const user = await UserAuthentication.findOne({ email });

    // If the user does not exist, respond with an error
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Compare the provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Generate a JWT token for the user using the imported function
    const token = generateAuthToken(user);

    res.status(200).json({ token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});



  app.post('/register', async (req, res) => {
      const { name, year, email, mnumber } = req.body;
      try {
        const userDoc = await User.create({
          name,
          year,
          mnumber,
          email,
          registrationDate: new Date(),
        });
        res.status(201).json(userDoc); 
      } catch (error) {
        console.error(error); 
        res.status(400).json({ message: 'Failed to create user.' }); 
      }
    });
    
    app.get('/users', async (req, res) => {
      try {
        const users = await User.find(); 
        res.status(200).json(users);
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to fetch users.' });
      }
    });

  
    
  app.listen(5000, ()=> {
      console.log('Server running on Port 5000')
  })
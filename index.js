const express = require('express')
const { default: mongoose } = require("mongoose");
const User = require('./models/User')
const cors = require("cors");

const app = express();

app.use(cors({credentials:true,origin:'http://localhost:3000'}));
app.use(express.json())

mongoose.connect('mongodb+srv://admin:password321@cluster.4wui5nc.mongodb.net/?retryWrites=true&w=majority')

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
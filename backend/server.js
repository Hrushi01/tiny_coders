const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Plan = require('./Models/plan'); // Import the Plan model

// Create an Express application
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// MongoDB connection URL
const mongoURL = 'mongodb+srv://admin:admin123@cluster0.2rf47.mongodb.net/LMS?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        // Start the server
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Express server listening on port ${port} in ${app.settings.env} mode`);
        });
    })
    .catch((err) => console.log(err));

// Main page of backend - Add a function API that will take place, day, and body from frontend and store it in the database using Mongoose schema

// Define route for storing data
app.post('/api/plans', (req, res) => {
    const { place, day, body } = req.body;

    const newPlan = new Plan({
        Place: place,
        Day: day,
        body: body
    });

    newPlan.save()
        .then(result => {
            console.log('Data stored successfully:', result);
            res.sendStatus(201); // Send a success response
        })
        .catch(error => {
            console.error('Error storing data:', error);
            res.sendStatus(500); // Send an error response
        });
});
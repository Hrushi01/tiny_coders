// Install required dependencies:
// npm install express body-parser mongoose

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const proxy = require('proxy-middleware')





const app = express();

//Setting Up CORS Policy
var corsOptions = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204,
};
app.options("*", cors()); // preFlight
app.use("*", cors(corsOptions), function (req, res, next) {
  next();
});


const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});
// app.use(proxy('http://localhost:8080', {
//     proxyReqPathResolver: (req) => {
//         return req.originalUrl
//     }
// }))
const { PORT } = process.env;



app.use(bodyParser.json());

const mongoURL = 'mongodb+srv://admin:admin123@cluster0.2rf47.mongodb.net/LMS?retryWrites=true&w=majority';

// Connect to MongoDB
mongoose.connect(mongoURL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for the itinerary
const itinerarySchema = new mongoose.Schema({
  days: String,
  city: String,
  itinerary: String,
});

const Itinerary = mongoose.model("Itinerary", itinerarySchema);

// Define the API endpoint to save the itinerary
app.post("/api/saveItinerary", async (req, res) => {
  try {
    const { days, city, itinerary } = req.body;

    // Create a new itinerary document
    const newItinerary = new Itinerary({
      days,
      city,
      itinerary,
    });

    // Save the itinerary to the database
    await newItinerary.save();

    res.status(200).json({ message: "Itinerary saved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});


// Define the API endpoint to fetch all itineraries
app.get("/api/getItineraries", async (req, res) => {
  try {
    // Fetch all the itineraries from the database
    const itineraries = await Itinerary.find();

    res.status(200).json(itineraries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "An error occurred" });
  }
});



app.listen(PORT, (Error) => {
  console.log(`Application listening on PORT ${PORT}`);
});
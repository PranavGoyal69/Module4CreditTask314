// api.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const Weather = require('./models/weather'); // Import the Weather model
const weather = require('weather-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost/weather', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a Weather reading
app.post('/api/weather', async (req, res) => {
    try {
        const newWeather = new Weather(req.body);
        await newWeather.save();
        res.status(201).send(newWeather);
    } catch (error) {
        res.status(400).send({ error: 'Failed to create weather reading' });
    }
});

// Read the latest Weather reading
app.get('/api/weather/latest', async (req, res) => {
    try {
        const latestWeather = await Weather.find().sort({ createdAt: -1 }).limit(1);
        res.send(latestWeather);
    } catch (error) {
        res.status(500).send({ error: 'Failed to retrieve latest weather reading' });
    }
});

// Update a Weather reading by ID
app.put('/api/weather/:id', async (req, res) => {
    try {
        const updatedWeather = await Weather.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedWeather) {
            return res.status(404).send({ error: 'Weather reading not found' });
        }
        res.send(updatedWeather);
    } catch (error) {
        res.status(400).send({ error: 'Failed to update weather reading' });
    }
});

// Delete a Weather reading by ID
app.delete('/api/weather/:id', async (req, res) => {
    try {
        const deletedWeather = await Weather.findByIdAndDelete(req.params.id);
        if (!deletedWeather) {
            return res.status(404).send({ error: 'Weather reading not found' });
        }
        res.status(204).send();
    } catch (error) {
        res.status(500).send({ error: 'Failed to delete weather reading' });
    }
});

// Get weather data for a specific location
app.get('/api/weather/location', (req, res) => {
    const location = req.query.location;
    console.log(`Fetching weather for location: ${location}`); // Log location
    weather.find({ search: location, degreeType: 'C' }, function(err, result) {
        if (err || result.length === 0) {
            console.error(err); // Log the error
            return res.status(404).send({ error: 'Location not found or weather data unavailable' });
        }
        res.send(result);
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

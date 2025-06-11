const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_KEY;

app.get("/weather", async (req, res) => {
    const city = req.query.city;
    try {
        const geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`);
        const geoData = await geoRes.json();

        if (!geoData.length) {
            return res.status(404).json({ error: "Grad nije pronađen" });
        }

        const { lat, lon } = geoData[0];

        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherRes.json();

        res.json({
            city: weatherData.name,
            temperature: Math.round(weatherData.main.temp),
            description: weatherData.weather[0].description,
            windSpeed: weatherData.wind.speed,
            icon: weatherData.weather[0].icon
        });
    } catch (error) {
        res.status(500).json({ error: "Greška prilikom pozivanja API-ja" });
    }
});

app.listen(PORT, () => {
    console.log(`Server radi na portu ${PORT}`);
});

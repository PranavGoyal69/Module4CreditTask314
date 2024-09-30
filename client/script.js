// script.js
document.getElementById('weatherForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = document.getElementById('location').value;
    const temperature = document.getElementById('temperature').value;

    try {
        const response = await fetch('http://localhost:3000/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ location, temperature }),
        });

        if (response.ok) {
            alert('Weather reading added!');
            document.getElementById('weatherForm').reset();
        } else {
            const errorData = await response.json();
            alert('Failed to add weather reading: ' + errorData.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Failed to add weather reading. Please try again.');
    }
});

document.getElementById('getLatest').addEventListener('click', async () => {
    try {
        const response = await fetch('http://localhost:3000/api/weather/latest');
        const latestWeather = await response.json();
        document.getElementById('latestReading').innerText = JSON.stringify(latestWeather, null, 2);
    } catch (error) {
        console.error('Error fetching latest weather:', error);
        alert('Failed to retrieve the latest weather reading.');
    }
});

document.getElementById('getWeather').addEventListener('click', async () => {
    const location = document.getElementById('searchLocation').value;
    console.log(`Button clicked, searching for location: ${location}`); // Add log here
    if (!location) {
        alert('Please enter a location.');
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/weather/location?location=${encodeURIComponent(location)}`);
        console.log(`Response status: ${response.status}`); // Log response status
        if (!response.ok) {
            const errorData = await response.json();
            alert('Failed to retrieve weather data: ' + errorData.error);
            return;
        }

        const weatherData = await response.json();
        console.log('Weather data received:', weatherData); // Log received data
        document.getElementById('weatherResult').innerText = JSON.stringify(weatherData, null, 2);
    } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to retrieve weather data. Please try again.');
    }
});

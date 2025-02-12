import express from 'express';
import fetch from 'node-fetch';
import path from 'path';

const app = express();
const PORT = 3000;

app.use(express.static('public'));  // Serve static files (like HTML, JS, CSS) from the 'public' directory

// API routes for fetching pharmacies and washrooms
app.get('/api/pharmacies', async (req, res) => {
    const { location, radius, keyword, apiKey } = req.query;

    const pharmaciesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${apiKey}`;
    
    try {
        const response = await fetch(pharmaciesUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        const results = data.results.map(place => ({
            name: place.name,
            vicinity: place.vicinity,
            geometry: place.geometry,
            place_id: place.place_id  
        }));

        res.json({ results });
    } catch (error) {
        console.error('Error fetching pharmacies:', error);
        res.status(500).json({ error: error.message });
    }
});

// API route for fetching pharmacy details
app.get('/api/pharmacyDetails', async (req, res) => {
    const { place_id, apiKey } = req.query;

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`;
    
    try {
        const response = await fetch(detailsUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();
        res.json(data.result);
    } catch (error) {
        console.error('Error fetching pharmacy details:', error);
        res.status(500).json({ error: error.message });
    }
});

// API route for fetching washrooms (toilets)
app.get('/api/washroom', async (req, res) => {
    const { location, radius, keyword, apiKey } = req.query;

    const toiletsUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${location}&radius=${radius}&keyword=${keyword}&key=${apiKey}`;
    
    try {
        const response = await fetch(toiletsUrl);
        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }
        const data = await response.json();

        const results = data.results.map(place => ({
            name: place.name,
            vicinity: place.vicinity,
            geometry: place.geometry,
            place_id: place.place_id  
        }));

        res.json({ results });
    } catch (error) {
        console.error('Error fetching toilets:', error);
        res.status(500).json({ error: error.message });
    }
});

// API route for fetching washroom (toilet) details
app.get('/api/washroomDetails', async (req, res) => {
    const { place_id, apiKey } = req.query;

    if (!place_id || !apiKey) {
        return res.status(400).json({ error: 'place_id and apiKey are required' });
    }

    const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${apiKey}`;
    console.log('Fetching details from:', detailsUrl);

    try {
        const response = await fetch(detailsUrl);
        if (!response.ok) {
            const errorData = await response.json();
            console.error('Error fetching details:', errorData);
            throw new Error(`API request failed with status ${response.status}: ${errorData.error_message}`);
        }
        const data = await response.json();
        if (!data.result) {
            throw new Error('No details found for this place_id');
        }
        console.log('Fetched washroom details:', data);
        res.json(data.result);  
    } catch (error) {
        console.error('Error fetching washroom details:', error);
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config(); // To load environment variables from .env

const app = express();
const port = 5000;

// Load environment variables
const TOKEN = process.env.APPLICATION_TOKEN;
const BASE_API_URL = process.env.BASE_API_URL_;
const LANGFLOW_ID = process.env.LANGFLOW_ID_;
const FLOW_ID = process.env.FLOW_ID_;

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS to allow frontend requests from localhost
app.use(cors());

// Route to handle POST request for running flow
app.post('/run-flow', async (req, res) => {
    try {
        const { message } = req.body;

        // Validate the message
        if (!message) {
            return res.status(400).json({ error: "Empty message" });
        }

        const url = `${BASE_API_URL}/lf/${LANGFLOW_ID}/api/v1/run/${FLOW_ID}`;
        const headers = {
            "Authorization": `Bearer ${TOKEN}`,
            "Content-Type": "application/json",
        };

        const payload = {
            input_value: message,
            output_type: "chat",
            input_type: "chat"
        };

        // Make the API request to Langflow
        const response = await axios.post(url, payload, { headers });

        if (response.status === 200) {
            // Try to extract the message text from the API response
            try {
                const messageText = response.data.outputs[0].outputs[0].results.message.text;
                return res.json({ response: messageText });
            } catch (e) {
                return res.status(500).json({
                    error: "Response Processing Error",
                    details: `Could not extract message from API response: ${e}`
                });
            }
        } else {
            return res.status(response.status).json({
                error: "API Error",
                details: `Error ${response.status}: ${response.data}`
            });
        }
    } catch (e) {
        return res.status(500).json({
            error: "Server Error",
            details: `${e}`
        });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

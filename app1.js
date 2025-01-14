import express from 'express';
import axios from 'axios';
import gmailTransfer from './smtp.js';
import report_gen from './open1.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// CORS configuration
const corsOptions = {
    origin: '*', // Replace with your frontend domain in production
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/', async (req, res) => {
    const { name, email, text } = req.body;

    try {
        
        const cleanResponse = await axios.post('https://nlpapi-gq1y.onrender.com', { text: text });
        const clean_text = cleanResponse.data.text;

        const resp = await axios.post('https://text-correction-ccu9.onrender.com/correct', { text: text });
        const correctedText = resp.data.text;

        
        const data = await report_gen(correctedText);

        
        await gmailTransfer(email, name, data);

        
        res.status(200).send('Email Sent!');
    } catch (error) {
        console.error('Error details:', error.message);

        if (error.response) {
            // Log details of the failed API call
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
            console.error('Response headers:', error.response.headers);

            // Send appropriate error response
            res.status(error.response.status).send({
                error: 'Failed to process the request',
                details: error.response.data,
            });
        } else {
            // Handle generic errors
            res.status(500).send({
                error: 'An unexpected error occurred',
                details: error.message,
            });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

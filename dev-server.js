import express from 'express';
import handler from './api/diagnose.js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json({ limit: '50mb' }));

app.post('/api/diagnose', async (req, res) => {
    try {
        await handler(req, res);
    } catch (error) {
        console.error('Server Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log('API Server running at http://localhost:' + PORT);
});

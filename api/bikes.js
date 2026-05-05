import fs from 'fs';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'api', 'db', 'bikes.json');

export default async function handler(req, res) {
    if (req.method === 'GET') {
        try {
            const data = fs.readFileSync(DB_PATH, 'utf8');
            return res.status(200).json(JSON.parse(data));
        } catch (error) {
            return res.status(200).json([]);
        }
    }

    if (req.method === 'POST') {
        try {
            const newBike = req.body;
            const data = fs.existsSync(DB_PATH) ? fs.readFileSync(DB_PATH, 'utf8') : '[]';
            const bikes = JSON.parse(data);
            
            // Add unique ID and timestamp
            newBike.id = Date.now().toString();
            newBike.createdAt = new Date().toISOString();
            
            bikes.push(newBike);
            fs.writeFileSync(DB_PATH, JSON.stringify(bikes, null, 2));
            
            return res.status(201).json(newBike);
        } catch (error) {
            console.error('Save Error:', error);
            return res.status(500).json({ error: 'Failed to save bike specifications.' });
        }
    }

    res.status(405).json({ error: 'Method Not Allowed' });
}

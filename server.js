import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import multer from 'multer';
import Deck from './models/Deck.js';
import { fileURLToPath } from 'url';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});

// Middleware
app.use(express.json());
const upload = multer({ dest: 'uploads/' });
app.use('/uploads', express.static('uploads'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Placeholder route
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// GET Route to Fetch Stored Decks
app.get('/api/decks', async (req, res) => {
    try {
        const decks = await Deck.find();
        res.status(200).json(decks);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch decks.' });
    }
});

// POST Route to Upload New Decks
app.post('/api/deck', upload.single('file'), async (req, res) => {
    const { title, description } = req.body;

    if (!title || !req.file) {
        return res.status(400).json({ error: 'Title and file are required.' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;

    try {
        const newDeck = new Deck({ title, description, fileUrl });
        await newDeck.save();

        res.status(201).json({
            message: 'Deck created successfully!',
            deck: newDeck
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to create deck.' });
    }
});

// DELETE Route to Remove Decks
app.delete('/api/deck/:id', async (req, res) => {
    try {
        await Deck.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Deck removed successfully!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to remove deck.' });
    }
});

// Start the Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
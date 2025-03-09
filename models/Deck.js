import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    fileUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Deck = mongoose.model('Deck', deckSchema);

export default Deck;
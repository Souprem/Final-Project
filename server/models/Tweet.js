const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
    content: { type: String, required: true, maxLength: 280 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mediaId: { type: String, default: null }, // Giphy ID
    mediaUrl: { type: String, default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    parent: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', default: null }
}, { timestamps: true });

module.exports = mongoose.model('Tweet', tweetSchema);

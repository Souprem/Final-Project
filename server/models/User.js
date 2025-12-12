const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['member', 'moderator'], default: 'member' },
    profilePic: { type: String, default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png' },
    profile: {
        bio: { type: String, default: '' },
        location: { type: String, default: '' },
        website: { type: String, default: '' }
    },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true, discriminatorKey: 'role' });

module.exports = mongoose.model('User', userSchema);

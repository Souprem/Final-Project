const mongoose = require('mongoose');
const User = require('./User');

const moderatorSchema = new mongoose.Schema({
    assignedSections: { type: [String], default: ['general', 'support'] },
    adminLevel: { type: Number, default: 1 }
});

// The discriminator key 'role' was defined in User.js
// This creates a model that will store documents in the 'users' collection
// but with role='moderator' (inherited from discriminator name key)
module.exports = User.discriminator('moderator', moderatorSchema);

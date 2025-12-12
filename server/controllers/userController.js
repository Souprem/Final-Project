const User = require('../models/User');

const jwt = require('jsonwebtoken');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...otherDetails } = user._doc;

        let isOwner = false;
        const token = req.cookies.access_token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
                if (!err && decoded.id === req.params.id) {
                    isOwner = true;
                }
            });
        }

        if (isOwner) {
            res.status(200).json(otherDetails);
        } else {
            const { name, email, ...publicDetails } = otherDetails;
            res.status(200).json(publicDetails);
        }

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    if (req.params.id === req.user.id || req.user.role === 'moderator') {
        try {
            if (req.body.password || req.body.username || req.body.role) {
                return res.status(400).json({ message: 'Cannot update sensitive data (username, password, role) here.' });
            }

            let updateData = { ...req.body };

            if (req.file) {
                const protocol = req.protocol;
                const host = req.get('host');
                updateData.profilePic = `${protocol}://${host}/uploads/${req.file.filename}`;
            }

            const profileUpdates = {};
            if (req.body.bio !== undefined) profileUpdates.bio = req.body.bio;
            if (req.body.location !== undefined) profileUpdates.location = req.body.location;
            if (req.body.website !== undefined) profileUpdates.website = req.body.website;

            if (Object.keys(profileUpdates).length > 0) {
                updateData.profile = profileUpdates;
            }

            console.log("Updating user:", req.params.id, "Data:", updateData);

            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: updateData },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
            console.error("Update User Error:", err);
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(403).json({ message: 'You can only update your own account!' });
    }
};

exports.followUser = async (req, res) => {
    if (req.user.id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.user.id);

            if (!user.followers.includes(req.user.id)) {
                await user.updateOne({ $push: { followers: req.user.id } });
                await currentUser.updateOne({ $push: { following: req.params.id } });
                res.status(200).json({ message: 'User followed!' });
            } else {
                await user.updateOne({ $pull: { followers: req.user.id } });
                await currentUser.updateOne({ $pull: { following: req.params.id } });
                res.status(200).json({ message: 'User unfollowed!' });
            }
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    } else {
        res.status(403).json({ message: 'You cannot follow yourself!' });
    }
};

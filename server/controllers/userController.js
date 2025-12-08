const User = require('../models/User');

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        const { password, ...otherDetails } = user._doc;
        res.status(200).json(otherDetails);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateUser = async (req, res) => {
    if (req.params.id === req.user.id || req.user.role === 'moderator') {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            res.status(200).json(updatedUser);
        } catch (err) {
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

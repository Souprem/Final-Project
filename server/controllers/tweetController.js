const Tweet = require('../models/Tweet');
const User = require('../models/User');

exports.createTweet = async (req, res) => {
    const newTweet = new Tweet({ ...req.body, author: req.user.id });
    try {
        const savedTweet = await newTweet.save();
        res.status(200).json(savedTweet);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.deleteTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (tweet.author.toString() === req.user.id || req.user.role === 'moderator') {
            await tweet.deleteOne();
            res.status(200).json({ message: 'Tweet deleted' });
        } else {
            res.status(403).json({ message: 'You can only delete your own tweets!' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.likeTweet = async (req, res) => {
    try {
        const tweet = await Tweet.findById(req.params.id);
        if (!tweet.likes.includes(req.user.id)) {
            await tweet.updateOne({ $push: { likes: req.user.id } });
            res.status(200).json({ message: 'The tweet has been liked' });
        } else {
            await tweet.updateOne({ $pull: { likes: req.user.id } });
            res.status(200).json({ message: 'The tweet has been disliked' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getAllTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find().sort({ createdAt: -1 }).populate('author', 'username profile');
        res.status(200).json(tweets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTimeline = async (req, res) => {
    try {
        const currentUser = await User.findById(req.user.id);
        const userTweets = await Tweet.find({ author: currentUser._id }).populate('author', 'username profile');
        const friendTweets = await Tweet.find({
            author: { $in: currentUser.following },
        }).populate('author', 'username profile');

        // Combine and sort
        const timeline = userTweets.concat(friendTweets).sort((a, b) => b.createdAt - a.createdAt);
        res.status(200).json(timeline);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTweetsByMedia = async (req, res) => {
    try {
        const tweets = await Tweet.find({ mediaId: req.params.mediaId }).sort({ createdAt: -1 }).populate('author', 'username profile');
        res.status(200).json(tweets);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

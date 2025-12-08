const express = require('express');
const { createTweet, deleteTweet, likeTweet, getAllTweets, getTimeline, getTweetsByMedia } = require('../controllers/tweetController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', verifyToken, createTweet);
router.delete('/:id', verifyToken, deleteTweet);
router.put('/:id/like', verifyToken, likeTweet);
router.get('/all', getAllTweets); // Public feed
router.get('/timeline', verifyToken, getTimeline); // Personalized feed
router.get('/media/:mediaId', getTweetsByMedia);

module.exports = router;

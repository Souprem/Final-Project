const express = require('express');
const { getUser, updateUser, followUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', verifyToken, updateUser);
router.put('/:id/follow', verifyToken, followUser);

module.exports = router;

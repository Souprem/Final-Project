const express = require('express');
const { getUser, updateUser, followUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');

// Use MemoryStorage for Vercel/Render (Ephemeral File System)
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', verifyToken, upload.single('profilePic'), updateUser);
router.put('/:id/follow', verifyToken, followUser);

module.exports = router;

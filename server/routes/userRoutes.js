const express = require('express');
const { getUser, updateUser, followUser } = require('../controllers/userController');
const { verifyToken } = require('../middleware/authMiddleware');

const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get('/:id', getUser);
router.put('/:id', verifyToken, upload.single('profilePic'), updateUser);
router.put('/:id/follow', verifyToken, followUser);

module.exports = router;

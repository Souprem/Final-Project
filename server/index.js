const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const tweetRoutes = require('./routes/tweetRoutes');

const app = express();
dotenv.config();

const connect = () => {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log('Connected to DB');
        })
        .catch((err) => {
            throw err;
        });
};

// Middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: true, // Allow all origins for easier initial deployment
    credentials: true
}));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tweets', tweetRoutes);
app.use('/uploads', express.static('uploads'));

app.use((err, req, res, next) => {
    const status = err.status || 500;
    const message = err.message || 'Something went wrong!';
    console.error("Global Error Handler detected:", err);
    return res.status(status).json({
        success: false,
        status,
        message,
    });
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
    app.listen(PORT, () => {
        connect();
        console.log(`Connected to Server on port ${PORT}`);
    });
}

module.exports = app;

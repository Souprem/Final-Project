import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import TweetCard from '../components/TweetCard';

const Details = () => {
    const { mediaId } = useParams();
    const { state } = useLocation(); // Get gif from invalidation if avail
    const [gif, setGif] = useState(state?.gif || null);
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');
    const { currentUser } = useContext(AuthContext);

    const API_KEY = import.meta.env.VITE_GIPHY_API_KEY || 'dc6zaTOxFJmzC';

    useEffect(() => {
        // Fetch GIF if not passed via state
        if (!gif) {
            const fetchGif = async () => {
                try {
                    const res = await axios.get(`https://api.giphy.com/v1/gifs/${mediaId}?api_key=${API_KEY}`);
                    setGif(res.data.data);
                } catch (err) {
                    console.log(err);
                }
            }
            fetchGif();
        }

        // Fetch Local Tweets about this GIF
        const fetchTweets = async () => {
            try {
                const res = await api.get(`/tweets/media/${mediaId}`);
                setTweets(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTweets();
    }, [mediaId, gif]);

    const handlePost = async () => {
        try {
            const res = await api.post('/tweets', {
                content,
                mediaId: gif.id,
                mediaUrl: gif.images.original.url // Save URL for display in feed
            });
            setTweets([res.data, ...tweets]);
            setContent('');
        } catch (err) {
            console.log(err);
        }
    };

    if (!gif) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Media Discussion</h2>
            <div style={{ marginBottom: '20px' }}>
                <img src={gif.images?.original?.url} alt="" style={{ maxWidth: '100%', borderRadius: '15px' }} />
                <h3>{gif.title}</h3>
            </div>

            <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                <textarea
                    className="form-input"
                    placeholder="Share your thoughts on this GIF..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    style={{ border: 'none', resize: 'none' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button className="btn" onClick={handlePost}>Tweet with GIF</button>
                </div>
            </div>

            <h3>Conversation</h3>
            {tweets.length === 0 ? <p>No tweets about this GIF yet.</p> : (
                tweets.map(tweet => (
                    <TweetCard key={tweet._id} tweet={tweet} setTweets={setTweets} />
                ))
            )}
        </div>
    );
};

export default Details;

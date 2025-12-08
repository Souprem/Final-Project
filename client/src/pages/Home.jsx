import { useState, useEffect, useContext } from 'react';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import TweetCard from '../components/TweetCard';

const Home = () => {
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                // For now, load public feed for everyone to ensure content is visible
                // Ideally: load /timeline if logged in
                const res = await api.get('/tweets/all');
                setTweets(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTweets();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tweets', {
                content
            });

            setTweets([res.data, ...tweets]);
            setContent('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div>
            <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
                <h2>Home</h2>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333' }}></div>
                    <div style={{ flex: 1 }}>
                        <textarea
                            className="form-input"
                            placeholder="What's happening?"
                            style={{ border: 'none', borderBottom: '1px solid var(--border-color)', resize: 'none' }}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn" onClick={handleSubmit} disabled={!content.trim()}>Tweet</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                {tweets.map(tweet => (
                    <TweetCard key={tweet._id} tweet={tweet} setTweets={setTweets} />
                ))}
            </div>
        </div>
    );
};

export default Home;

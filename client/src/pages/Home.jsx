import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import TweetCard from '../components/TweetCard';
import Share from '../components/Share';

const Home = () => {
    const [tweets, setTweets] = useState([]);
    const [feedType, setFeedType] = useState('all'); // 'all' or 'following'
    const { currentUser } = useContext(AuthContext);

    useEffect(() => {
        const fetchTweets = async () => {
            try {
                // Determine endpoint based on feed type
                const endpoint = feedType === 'following' ? '/tweets/timeline' : '/tweets/all';

                // If following feed is selected but user is logged out, switch back to all
                if (feedType === 'following' && !currentUser) {
                    setFeedType('all');
                    return;
                }

                const res = await api.get(endpoint);
                if (Array.isArray(res.data)) {
                    setTweets(res.data);
                } else {
                    console.error("API Error: Expected array but got:", res.data);
                    setTweets([]); // Fallback to avoid crash
                }
            } catch (err) {
                console.log(err);
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    // Fallback to public feed on auth error
                    setFeedType('all');
                }
            }
        };
        fetchTweets();
    }, [currentUser, feedType]);

    // Function to handle switching to Following tab
    const handleFollowingClick = () => {
        if (!currentUser) {
            alert("Please login to view your following feed.");
            return;
        }
        setFeedType('following');
    };

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', borderBottom: '1px solid #333', marginBottom: '20px' }}>
                <button
                    onClick={() => setFeedType('all')}
                    style={{
                        flex: 1,
                        padding: '15px',
                        background: 'transparent',
                        color: feedType === 'all' ? '#fff' : '#888',
                        border: 'none',
                        borderBottom: feedType === 'all' ? '4px solid #1da1f2' : 'none',
                        fontWeight: feedType === 'all' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '16px'
                    }}
                >
                    For You
                </button>
                <button
                    onClick={handleFollowingClick}
                    style={{
                        flex: 1,
                        padding: '15px',
                        background: 'transparent',
                        color: feedType === 'following' ? '#fff' : '#888',
                        border: 'none',
                        borderBottom: feedType === 'following' ? '4px solid #1da1f2' : 'none',
                        fontWeight: feedType === 'following' ? 'bold' : 'normal',
                        cursor: 'pointer',
                        fontSize: '16px',
                        opacity: currentUser ? 1 : 0.5
                    }}
                >
                    Following
                </button>
            </div>

            {currentUser ? (
                /* Pass setTweets to allow Share component to update the feed immediately */
                <Share setTweets={setTweets} />
            ) : (
                <div style={{ textAlign: 'center', padding: '20px', borderBottom: '1px solid #333', marginBottom: '20px' }}>
                    <p style={{ color: '#888', margin: 0 }}>Login to post buzzes and interact with the community</p>
                </div>
            )}

            {tweets.map((tweet) => (
                <TweetCard key={tweet._id} tweet={tweet} setTweets={setTweets} />
            ))}

            {tweets.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    {feedType === 'following' ? "You aren't following anyone yet, or they haven't buzzed." : "No buzzes found."}
                </div>
            )}
        </div>
    );
};

export default Home;

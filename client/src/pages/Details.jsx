import { useState, useEffect, useContext } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import TweetCard from '../components/TweetCard';

const Details = () => {
    const { mediaId } = useParams();
    const { state } = useLocation();
    const [article, setArticle] = useState(state?.article || null);
    const [tweets, setTweets] = useState([]);
    const [content, setContent] = useState('');
    const { currentUser } = useContext(AuthContext);

    // If direct link (no state), we could fetch or just show discussion.
    // For MVP, we assume navigation from Search or just show comments for this ID (url).

    useEffect(() => {
        // Fetch Local Tweets about this Article
        const fetchTweets = async () => {
            try {
                // mediaId is the encoded URL
                const res = await api.get(`/tweets/media/${encodeURIComponent(mediaId)}`);
                setTweets(res.data);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTweets();
    }, [mediaId]);

    const handlePost = async () => {
        try {
            const res = await api.post('/tweets', {
                content,
                mediaId: mediaId, // Save encoded URL as ID
                mediaUrl: article?.urlToImage // Save Image for display
            });
            setTweets([res.data, ...tweets]);
            setContent('');
        } catch (err) {
            console.log(err);
        }
    };

    if (!article && !mediaId) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Article Discussion</h2>
            {article && (
                <div style={{ marginBottom: '20px' }}>
                    {article.urlToImage && <img src={article.urlToImage} alt="" style={{ maxWidth: '100%', borderRadius: '15px' }} />}
                    <h3>{article.title}</h3>
                    <p>{article.description}</p>
                    <a href={article.url} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>Read Full Story at {article.source?.name}</a>
                </div>
            )}
            {!article && <p style={{ color: 'gray', fontStyle: 'italic' }}>Article details not available (Deep link). View discussion below.</p>}

            <div style={{ border: '1px solid var(--border-color)', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}>
                {currentUser ? (
                    <>
                        <textarea
                            className="form-input"
                            placeholder="Share your thoughts on this article..."
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            style={{ border: 'none', resize: 'none' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <button className="btn" onClick={handlePost}>Post Comment</button>
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <p style={{ marginBottom: '10px' }}>Join the conversation</p>
                        <Link to="/login" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Login to Comment</Link>
                    </div>
                )}
            </div>

            <h3>Conversation</h3>
            {tweets.length === 0 ? <p>No buzzes yet.</p> : (
                tweets.map(tweet => (
                    <TweetCard key={tweet._id} tweet={tweet} setTweets={setTweets} />
                ))
            )}
        </div>
    );
};

export default Details;

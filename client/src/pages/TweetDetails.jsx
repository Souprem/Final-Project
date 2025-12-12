import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { AuthContext } from '../context/AuthContext';
import TweetCard from '../components/TweetCard';

const TweetDetails = () => {
    const { id } = useParams();
    const { currentUser } = useContext(AuthContext);
    const [tweet, setTweet] = useState(null);
    const [replies, setReplies] = useState([]);
    const [replyContent, setReplyContent] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTweet = async () => {
            try {
                const res = await api.get(`/tweets/find/${id}`);
                setTweet(res.data);
                setReplies(res.data.replies);
            } catch (err) {
                console.log(err);
            }
        };
        fetchTweet();
    }, [id]);

    const handleReply = async () => {
        try {
            const res = await api.post('/tweets', {
                content: replyContent,
                parent: id
            });
            setReplies([res.data, ...replies]);
            setReplyContent('');
        } catch (err) {
            console.log(err);
        }
    };

    if (!tweet) return <div>Loading...</div>;

    return (
        <div style={{ padding: '20px' }}>
            <Link to="/" style={{ textDecoration: 'none', color: 'gray', marginBottom: '20px', display: 'block' }}>&larr; Back</Link>

            {/* Main Tweet */}
            <TweetCard
                tweet={tweet}
                updateTweet={setTweet}
                onDeleteSuccess={() => navigate('/')}
            />

            <div style={{ borderLeft: '2px solid #333', marginLeft: '20px', paddingLeft: '20px', marginTop: '20px' }}>
                <h3>Replies</h3>

                {currentUser ? (
                    <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333', overflow: 'hidden' }}>
                            <img src={currentUser.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <textarea
                                className="form-input"
                                placeholder="Buzz your reply"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                                style={{ resize: 'none' }}
                            />
                            <button className="btn" onClick={handleReply} disabled={!replyContent.trim()} style={{ marginTop: '10px' }}>Reply</button>
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <p style={{ marginBottom: '10px' }}>Join the conversation</p>
                        <Link to="/login" className="btn" style={{ textDecoration: 'none', display: 'inline-block' }}>Login to Reply</Link>
                    </div>
                )}

                {replies.map(reply => (
                    <TweetCard key={reply._id} tweet={reply} setTweets={setReplies} />
                ))}
            </div>
        </div>
    );
};

export default TweetDetails;

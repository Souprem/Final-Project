import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { AiOutlineHeart, AiFillHeart, AiOutlineDelete } from 'react-icons/ai';

const TweetCard = ({ tweet, setTweets, updateTweet, onDeleteSuccess }) => {
    const { currentUser } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleDelete = async (e) => {
        e.stopPropagation();
        if (!currentUser) return;
        try {
            await api.delete(`/tweets/${tweet._id}`);
            if (onDeleteSuccess) {
                onDeleteSuccess();
            } else if (setTweets) {
                setTweets((prev) => prev.filter((t) => t._id !== tweet._id));
            }
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        if (!currentUser) {
            navigate('/login');
            return;
        }
        try {
            const isLiked = tweet.likes.includes(currentUser._id);
            const newLikes = isLiked
                ? tweet.likes.filter(id => id !== currentUser._id)
                : [...tweet.likes, currentUser._id];

            if (updateTweet) {
                updateTweet((prev) => ({ ...prev, likes: newLikes }));
            } else if (setTweets) {
                setTweets((prev) =>
                    prev.map((t) => t._id === tweet._id ? { ...t, likes: newLikes } : t)
                );
            }

            await api.put(`/tweets/${tweet._id}/like`);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCardClick = () => {
        navigate(`/tweet/${tweet._id}`);
    };

    return (
        <div className="tweet-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/profile/${tweet.author?._id}`} onClick={(e) => e.stopPropagation()}>
                    <img
                        src={tweet.author?.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt=""
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', backgroundColor: '#333' }}
                    />
                </Link>
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{tweet.author?.username}</span>
                        <span style={{ color: 'gray' }}>@{tweet.author?.username}</span>
                        <span style={{ color: 'gray' }}>· {new Date(tweet.createdAt).toDateString()}</span>
                        {currentUser && (currentUser._id === tweet.author?._id || currentUser.role === 'moderator') && (
                            <AiOutlineDelete style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={handleDelete} />
                        )}
                    </div>
                    <div>
                        <p style={{ margin: '5px 0' }}>{tweet.content}</p>
                        {tweet.mediaUrl && (
                            <img src={tweet.mediaUrl} alt="" style={{ width: '100%', borderRadius: '15px', marginTop: '10px' }} />
                        )}
                    </div>
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: 'gray' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={handleLike}>
                            {currentUser && tweet.likes.includes(currentUser._id) ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
                            <span>{tweet.likes.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;

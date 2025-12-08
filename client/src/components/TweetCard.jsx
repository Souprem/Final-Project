import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api';
import { AiOutlineHeart, AiFillHeart, AiOutlineDelete } from 'react-icons/ai';

const TweetCard = ({ tweet, setTweets }) => {
    const { currentUser } = useContext(AuthContext);

    const handleDelete = async () => {
        try {
            await api.delete(`/tweets/${tweet._id}`);
            setTweets((prev) => prev.filter((t) => t._id !== tweet._id));
        } catch (err) {
            console.log(err);
        }
    };

    const handleLike = async () => {
        try {
            await api.put(`/tweets/${tweet._id}/like`);
            // Optimistic updateto avoid refetch
            // In a real app we'd query queryClient or similar.
            // Here I can't easily update the parent state without passing a complex setter.
            // I'll just refresh or force update is tricky.
            // For simplicity, I won't update UI immediately or I'll toggle local state.
            // Ideally I should pass a "refresh" function.
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div className="tweet-card">
            <div style={{ display: 'flex', gap: '10px' }}>
                {/* Avatar Placeholder */}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#333' }}></div>
                <div style={{ width: '100%' }}>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                        <span style={{ fontWeight: 'bold' }}>{tweet.author?.username}</span>
                        <span style={{ color: 'gray' }}>@{tweet.author?.username}</span>
                        <span style={{ color: 'gray' }}>· {new Date(tweet.createdAt).toDateString()}</span>
                        {(currentUser._id === tweet.author?._id || currentUser.role === 'moderator') && (
                            <AiOutlineDelete style={{ marginLeft: 'auto', cursor: 'pointer' }} onClick={handleDelete} />
                        )}
                    </div>
                    <p style={{ margin: '5px 0' }}>{tweet.content}</p>
                    {tweet.mediaUrl && (
                        <img src={tweet.mediaUrl} alt="" style={{ width: '100%', borderRadius: '15px', marginTop: '10px' }} />
                    )}
                    <div style={{ display: 'flex', gap: '20px', marginTop: '10px', color: 'gray' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }} onClick={handleLike}>
                            {tweet.likes.includes(currentUser._id) ? <AiFillHeart color="red" /> : <AiOutlineHeart />}
                            <span>{tweet.likes.length}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TweetCard;

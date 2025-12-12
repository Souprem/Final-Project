import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../api';

const Share = ({ setTweets }) => {
    const { currentUser } = useContext(AuthContext);
    const [content, setContent] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/tweets', {
                content
            });

            // Update parent state to show new tweet immediately
            setTweets((prev) => [res.data, ...prev]);
            setContent('');
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <div style={{ padding: '20px', borderBottom: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', gap: '10px' }}>
                <Link to={`/profile/${currentUser._id}`}>
                    <img
                        src={currentUser.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                        alt=""
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', cursor: 'pointer' }}
                    />
                </Link>
                <div style={{ flex: 1 }}>
                    <textarea
                        className="form-input"
                        placeholder="What's happening?"
                        style={{ border: 'none', borderBottom: '1px solid var(--border-color)', resize: 'none', width: '100%', outline: 'none', padding: '10px 0' }}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                        <button
                            className="btn"
                            onClick={handleSubmit}
                            disabled={!content.trim()}
                            style={{ padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer', background: '#1da1f2', color: 'white', fontWeight: 'bold', opacity: !content.trim() ? 0.5 : 1 }}
                        >
                            Buzz
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Share;

import { Link, useLocation } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { BiLogOut, BiHome } from 'react-icons/bi';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    // --- RENDER ---
    return (
        <div className="sidebar">
            <div className="top">
                <h2 style={{ paddingLeft: '12px' }}>Buzz</h2>
                <Link to="/" className="nav-link" style={{ fontWeight: isActive('/') ? 'bold' : 'normal' }}>
                    <BiHome style={{ fontSize: '24px', strokeWidth: isActive('/') ? '1' : '0' }} />
                    <span>Home</span>
                </Link>
                <Link to="/search" className="nav-link" style={{ fontWeight: isActive('/search') ? 'bold' : 'normal' }}>
                    <AiOutlineSearch style={{ strokeWidth: isActive('/search') ? '20' : '0' }} />
                    <span>Search</span>
                </Link>
                {currentUser && (
                    <Link to={`/profile/${currentUser._id}`} className="nav-link" style={{ fontWeight: isActive(`/profile/${currentUser._id}`) ? 'bold' : 'normal' }}>
                        <AiOutlineUser style={{ strokeWidth: isActive(`/profile/${currentUser._id}`) ? '20' : '0' }} />
                        <span>Profile</span>
                    </Link>
                )}
            </div>
            <div className="bottom">
                {currentUser ? (
                    <>
                        <Link to={`/profile/${currentUser._id}`} style={{ textDecoration: 'none', color: 'inherit', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img
                                src={currentUser.profilePic || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                                alt=""
                                style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                            <div style={{ overflow: 'hidden' }}>
                                <span style={{ display: 'block', fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{currentUser.username}</span>
                                <span style={{ display: 'block', fontSize: '12px', color: 'gray' }}>@{currentUser.username}</span>
                            </div>
                        </Link>
                        <div className="nav-link" onClick={logout} style={{ cursor: 'pointer' }}>
                            <BiLogOut />
                            <span>Logout</span>
                        </div>
                    </>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <Link to="/login" className="btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block' }}>Login</Link>
                        <Link to="/register" className="btn" style={{ textAlign: 'center', textDecoration: 'none', display: 'block', backgroundColor: 'transparent', border: '1px solid var(--twitter-color)', color: 'var(--twitter-color)' }}>Register</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;

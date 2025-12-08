import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
// Using text instead of icons for simplicity, or I can use react-icons if installed. I installed react-icons.
import { AiFillHome, AiOutlineSearch, AiOutlineUser } from 'react-icons/ai';
import { BiLogOut } from 'react-icons/bi';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);

    return (
        <div className="sidebar">
            <div className="top">
                <h2 style={{ paddingLeft: '12px' }}>Buzz</h2>
                <Link to="/" className="nav-link">
                    <AiFillHome />
                    <span>Home</span>
                </Link>
                <Link to="/explore" className="nav-link">
                    <AiOutlineSearch />
                    <span>Explore</span>
                </Link>
                <Link to={`/profile/${currentUser._id}`} className="nav-link">
                    <AiOutlineUser />
                    <span>Profile</span>
                </Link>
            </div>
            <div className="bottom">
                <div className="nav-link" onClick={logout} style={{ cursor: 'pointer' }}>
                    <BiLogOut />
                    <span>Logout</span>
                </div>
            </div>
        </div>
    );
};

export default Navbar;

import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav style={styles.navbar}>
            {/* Left Section */}
            <div>
                <Link to="/" style={styles.logo}>
                    <span style={styles.logoIcon}>📖</span> LearnIT
                </Link>
            </div>

            {/* Middle Section */}
            <div style={styles.navLinks}>
                <Link to='/' style={styles.link}>Home</Link>
                <Link to='/courses' style={styles.link}>Courses</Link>

                {/* Render My courses only if the user is Authenticated */}
                {user && (
                    user.is_instructor ? <Link to='/instructor' style={styles.link}>My Courses</Link> : <Link to='/my-learning' style={styles.link}>My Learning</Link>
                )}
            </div>

            {/* Authentication Section */}
            <div style={styles.rightSection}>
                <button style={styles.upgradeBtn}>Upgrade</button>
                {user ? (
                    <div style={styles.profileSection}>
                        <div style={styles.profileIcon} title={`Logged in as ${user.username}`}>
                            👤
                        </div>
                        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
                    </div>
                ) : (
                    <Link to='/login' style={styles.loginBtn}>Login</Link>
                )}
            </div>
        </nav>
    );
}

const styles = {
    navbar: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 40px',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e0e0e0',
        fontFamily: 'sans-serif'
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '22px',
        fontWeight: 'bold',
        textDecoration: 'none',
        color: '#1a1a1a'
    },
    logoIcon: {
        color: '#0056b3',
        fontSize: '26px'
    },
    navLinks: {
        display: 'flex',
        gap: '30px'
    },
    link: {
        textDecoration: 'none',
        color: '#555',
        fontSize: '16px',
        fontWeight: '500'
    },
    rightSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px'
    },
    upgradeBtn: {
        backgroundColor: '#2563eb', // Figma blue
        color: 'white',
        border: 'none',
        padding: '8px 20px',
        borderRadius: '20px',
        fontSize: '14px',
        fontWeight: 'bold',
        cursor: 'pointer'
    },
    profileSection: {
        display: 'flex',
        alignItems: 'center',
        gap: '15px'
    },
    profileIcon: {
        backgroundColor: '#f3f4f6',
        padding: '8px',
        borderRadius: '50%',
        fontSize: '16px',
        cursor: 'pointer'
    },
    logoutBtn: {
        backgroundColor: 'transparent',
        border: '1px solid #dc2626',
        color: '#dc2626',
        padding: '6px 15px',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px'
    },
    loginBtn: {
        textDecoration: 'none',
        color: '#2563eb',
        fontWeight: 'bold',
        fontSize: '15px'
    }
};
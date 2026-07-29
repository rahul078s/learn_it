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
        <nav className="bg-white shadow-md px-8 py-4 flex justify-between items-center sticky top-0 z-50" >
            {/* Left Section */}
            <div className="flex items-center gap-2" >
                <span className="text-2xl" >📖</span>
                <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors" >
                    LearnIT
                </Link>
            </div>

            {/* Middle Section */}
            <div className="hidden md:flex gap-6 font-small text-gray-600" >
                <Link to='/' className="hover:text-blue-600 transition-colors" >Home</Link>
                <Link to='/courses' className="hover:text-blue-600 transition-colors" >Courses</Link>

                {/* Render My courses only if the user is Authenticated */}
                {user && (
                    user.is_instructor ? <Link to='/instructor' className="hover:text-blue-600 transition-colors" >My Courses</Link> : <Link to='/my-learning' className="hover:text-blue-600 transition-colors" >My Learning</Link>
                )}
            </div>

            {/* Authentication Section */}
            <div className="flex items-center gap-4" >
                {/* <button className="" >Upgrade</button> */}
                {user ? (
                    <div className="flex items-center gap-3" >
                        <span className="bg-gray-100 p-2 rounded-full text-gray-600">👤</span>
                        <button onClick={handleLogout} className="text-red-500 font-medium hover:text-red-700 transition-colors border border-red-200 px-4 py-1 rounded-md hover:bg-red-50" >Logout</button>
                    </div>
                ) : (
                    <>
                        <Link to='/register' className="bg-blue-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors" >Sign Up</Link>
                        <Link to='/login' className="text-gray-600 font-medium hover:text-blue-600 transitions-colors" >Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

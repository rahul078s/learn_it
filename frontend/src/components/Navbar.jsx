import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import '@tailwindplus/elements'

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [dropDownOpen, setDropDownOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        };

        if (dropDownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropDownOpen]);

    return (
        <nav className="sticky top-0 z-50 flex items-center justify-between bg-white px-8 py-4 shadow-md transition-colors dark:bg-slate-900 dark:shadow-slate-950/40" >
            {/* Left Section */}
            <div className="flex items-center gap-2" >
                <span className="text-2xl" >📖</span>
                <Link to="/" className="text-2xl font-bold text-gray-800 transition-colors hover:text-blue-600 dark:text-white dark:hover:text-blue-400" >
                    LearnIT
                </Link>
            </div>

            {/* Middle Section */}
            <div className="font-small hidden gap-6 text-gray-600 dark:text-slate-300 md:flex" >
                <Link to='/' className="transition-colors hover:text-blue-600 dark:hover:text-blue-400" >Home</Link>
                <Link to='/courses' className="transition-colors hover:text-blue-600 dark:hover:text-blue-400" >Courses</Link>

                {/* Render My courses only if the user is Authenticated */}
                {user && (
                    user.is_instructor ? <Link to='/instructor' className="transition-colors hover:text-blue-600 dark:hover:text-blue-400" >My Courses</Link> : <Link to='/my-learning' className="transition-colors hover:text-blue-600 dark:hover:text-blue-400" >My Learning</Link>
                )}
            </div>

            {/* Authentication Section */}
            <div className="flex items-center gap-4" >
                {/* <button className="" >Upgrade</button> */}
                {user ? (
                    <div className="relative inline-block text-left" ref={dropdownRef} >
                        <button className="bg-blue-600 p-2 rounded-full cursor-pointer hover:bg-blue-700" onClick={() => setDropDownOpen(!dropDownOpen)}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                        </button>

                        {dropDownOpen && (
                            <div className="focus:outline-hidden absolute right-0 z-10 mt-2 w-50 origin-top-right rounded-xl bg-white px-3 py-2 shadow-lg ring-1 ring-black/5 dark:bg-slate-900 dark:ring-white/10">
                                <div className="flex flex-col gap-1 ">
                                    <div className="flex transtion-all">
                                        <Link to="/my-learning" onClick={() => setDropDownOpen(false)} className="w-full rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">My Learnings</Link>
                                    </div>
                                    <div className="flex transtion-all">
                                        <Link to="/account-settings" onClick={() => setDropDownOpen(false)} className="w-full rounded-md px-2 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">Settings</Link>
                                    </div>
                                    <div className="flex transtion-all">
                                        <button onClick={() => {
                                            handleLogout();
                                            setDropDownOpen(false);
                                        }} className="w-full cursor-pointer rounded-md px-2 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-gray-900 dark:text-slate-200 dark:hover:bg-slate-800 dark:hover:text-white">
                                            Log Out
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <>
                        <Link to='/register' className="rounded-lg bg-blue-600 px-5 py-2 font-bold text-white transition-colors hover:bg-blue-700" >Sign Up</Link>
                        <Link to='/login' className="transitions-colors font-medium text-gray-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400" >Login</Link>
                    </>
                )}
            </div>
        </nav>
    );
}

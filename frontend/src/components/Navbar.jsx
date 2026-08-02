import { useContext, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const publicNavigation = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "My Learning", to: "/my-learning" },
    { label: "Certificates" },
];

const studentNavigation = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "My Learning", to: "/my-learning" },
    { label: "Certificates" },
];

const instructorNavigation = [
    { label: "Home", to: "/" },
    { label: "Courses", to: "/courses" },
    { label: "My Courses", to: "/instructor" },
    { label: "Certificates" },
];

function LogoMark() {
    return (
        <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 shadow-sm shadow-blue-950/5">
            <svg className="h-6 w-6" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                <path d="M16 3 28 9.5 16 16 4 9.5 16 3Z" fill="#60A5FA" />
                <path d="M16 16 28 9.5V22L16 29V16Z" fill="#304FFE" />
                <path d="M16 16 4 9.5V22L16 29V16Z" fill="#4F46E5" />
                <path d="M16 3 28 9.5 16 16 4 9.5 16 3Z" stroke="white" strokeOpacity=".5" />
            </svg>
        </span>
    );
}

function SearchIcon({ className = "h-5 w-5" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-4.35-4.35m1.1-5.4a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" />
        </svg>
    );
}

function ChevronDownIcon({ className = "h-4 w-4" }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 9 6 6 6-6" />
        </svg>
    );
}

function BellIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M14.8 17.5a3 3 0 0 1-5.6 0M18 10.2c0-3.4-2.2-6.2-6-6.2s-6 2.8-6 6.2c0 5-2 5.8-2 5.8h16s-2-.8-2-5.8Z" />
        </svg>
    );
}

function MenuIcon({ open }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m6 6 12 12M18 6 6 18" />
            ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
            )}
        </svg>
    );
}

function UserAvatar({ name }) {
    const initial = name.trim().charAt(0).toUpperCase() || "U";

    return (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-900 to-blue-600 text-sm font-bold text-white shadow-sm">
            {initial}
        </span>
    );
}

function NavItem({ item, isActive, onNavigate }) {
    if (!item.to) {
        return (
            <span className="flex h-16 min-w-max cursor-default items-center whitespace-nowrap px-1 text-sm font-medium text-slate-700">
                {item.label}
            </span>
        );
    }

    return (
        <Link
            to={item.to}
            onClick={onNavigate}
            className={`relative flex h-16 min-w-max items-center whitespace-nowrap px-1 text-sm font-semibold transition ${
                isActive
                    ? "text-blue-600"
                    : "text-slate-700 hover:text-blue-600"
            }`}
        >
            {item.label}
            {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-1 rounded-t-full bg-blue-600" />
            )}
        </Link>
    );
}

export default function Navbar() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [dropDownOpen, setDropDownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropDownOpen(false);
            }
        };

        if (dropDownOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [dropDownOpen]);

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    const closeMenus = () => {
        setDropDownOpen(false);
        setMobileMenuOpen(false);
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        closeMenus();

        const formData = new FormData(event.currentTarget);
        const searchQuery = String(formData.get("search") || "");
        const trimmedQuery = searchQuery.trim();

        if (trimmedQuery) {
            navigate(`/courses?search=${encodeURIComponent(trimmedQuery)}`);
            return;
        }

        navigate("/courses");
    };

    const isInstructor = Boolean(user?.is_instructor);
    const userName = user?.username || (isInstructor ? "Instructor" : "Student");
    const navigationItems = user
        ? (isInstructor ? instructorNavigation : studentNavigation)
        : publicNavigation;
    const dropdownLinks = isInstructor
        ? [
            { label: "Course Catalog", to: "/courses" },
            { label: "Account Settings", to: "/account-settings" },
        ]
        : [
            { label: "My Learning", to: "/my-learning" },
            { label: "Course Catalog", to: "/courses" },
            { label: "Account Settings", to: "/account-settings" },
        ];
    const courseSearchQuery = location.pathname === "/courses"
        ? new URLSearchParams(location.search).get("search") || ""
        : "";

    const isActivePath = (to) => {
        if (to === "/") {
            return location.pathname === "/";
        }

        return location.pathname === to || location.pathname.startsWith(`${to}/`);
    };

    return (
        <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur">
            <nav className="mx-auto flex min-h-16 max-w-[1440px] items-center px-5 md:px-8 lg:px-10">
                <Link to="/" className="flex shrink-0 items-center gap-2.5" aria-label="LearnIT home">
                    <LogoMark />
                    <span className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                        Learn<span className="text-blue-600">IT</span>
                    </span>
                </Link>

                <div className="ml-12 hidden items-center gap-8 min-[1080px]:flex xl:ml-25 xl:gap-9">
                    {navigationItems.map((item) => (
                        <NavItem
                            key={`${item.label}-${item.to || "text"}`}
                            item={item}
                            isActive={item.to ? isActivePath(item.to) : false}
                            onNavigate={closeMenus}
                        />
                    ))}
                </div>

                <form
                    onSubmit={handleSearchSubmit}
                    className="ml-auto hidden h-10 w-56 items-center rounded-lg border border-slate-200 bg-slate-50/80 px-4 text-slate-500 transition focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100 min-[1080px]:flex xl:w-80 2xl:w-[380px]"
                >
                    <input
                        key={`${location.pathname}-${location.search}`}
                        type="search"
                        name="search"
                        defaultValue={courseSearchQuery}
                        placeholder="Search courses..."
                        aria-label="Search courses"
                        className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                    />
                    <button type="submit" aria-label="Search" className="ml-2 rounded-md p-1 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600">
                        <SearchIcon />
                    </button>
                </form>

                <div className="ml-auto flex shrink-0 items-center gap-3 min-[1080px]:ml-5">
                    {user ? (
                        <>
                            <button
                                type="button"
                                className="relative hidden h-10 w-10 cursor-pointer items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:flex"
                                aria-label="Notifications"
                            >
                                <BellIcon />
                                <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    type="button"
                                    className="flex cursor-pointer items-center gap-3 rounded-xl px-1.5 py-1 transition hover:bg-slate-50"
                                    onClick={() => setDropDownOpen((open) => !open)}
                                    aria-expanded={dropDownOpen}
                                    aria-haspopup="menu"
                                >
                                    <UserAvatar name={userName} />
                                    <span className="hidden text-left md:block">
                                        <span className="block text-sm font-bold leading-5 text-slate-950">{userName}</span>
                                        <span className="block text-xs font-medium text-slate-500">{isInstructor ? "Instructor" : "Student"}</span>
                                    </span>
                                    <ChevronDownIcon className="hidden h-4 w-4 text-slate-500 md:block" />
                                </button>

                                {dropDownOpen && (
                                    <div className="absolute right-0 mt-3 w-72 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10">
                                        <div className="border-b border-slate-100 px-4 py-4">
                                            <p className="text-sm font-bold text-slate-950">{userName}</p>
                                            <p className="mt-0.5 text-xs font-medium text-slate-500">{isInstructor ? "Instructor" : "Student"}</p>
                                        </div>

                                        <div className="p-2">
                                            {dropdownLinks.map((item) => (
                                                <Link key={item.label} to={item.to} onClick={closeMenus} className="block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-50 hover:text-blue-600">
                                                    {item.label}
                                                </Link>
                                            ))}

                                            <div className="my-2 h-px bg-slate-100" />

                                            <button
                                                type="button"
                                                onClick={handleLogout}
                                                className="block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="hidden rounded-lg border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-950 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 md:inline-flex">
                                Login
                            </Link>
                            <Link to="/register" className="hidden rounded-lg bg-blue-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 md:inline-flex">
                                Sign Up
                            </Link>
                        </>
                    )}

                    <button
                        type="button"
                        className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg bg-slate-50 text-slate-800 transition hover:bg-blue-50 hover:text-blue-600 min-[1080px]:hidden"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-expanded={mobileMenuOpen}
                        aria-label="Toggle navigation menu"
                    >
                        <MenuIcon open={mobileMenuOpen} />
                    </button>
                </div>
            </nav>

            {mobileMenuOpen && (
                <div className="border-t border-slate-200 bg-white px-5 py-4 shadow-lg shadow-slate-950/5 min-[1080px]:hidden">
                    <form
                        onSubmit={handleSearchSubmit}
                        className="mb-4 flex h-12 items-center rounded-lg border border-slate-200 bg-slate-50 px-4 text-slate-500 focus-within:border-blue-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-100"
                    >
                        <input
                            type="search"
                            name="search"
                            defaultValue={courseSearchQuery}
                            placeholder={user ? "Search anything..." : "Search courses..."}
                            aria-label="Search courses"
                            className="min-w-0 flex-1 bg-transparent text-sm text-slate-900 outline-none placeholder:text-slate-400"
                        />
                        <button type="submit" aria-label="Search" className="ml-2 rounded-md p-1 text-slate-700">
                            <SearchIcon />
                        </button>
                    </form>

                    <div className="grid gap-1">
                        {navigationItems.map((item) => (
                            item.to ? (
                                <Link
                                    key={`${item.label}-${item.to}`}
                                    to={item.to}
                                    onClick={closeMenus}
                                    className={`rounded-lg px-3 py-2 text-sm font-semibold ${
                                        isActivePath(item.to)
                                            ? "bg-blue-50 text-blue-600"
                                            : "text-slate-700 hover:bg-slate-50 hover:text-blue-600"
                                    }`}
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span key={item.label} className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400">
                                    {item.label}
                                </span>
                            )
                        ))}
                    </div>

                    {!user && (
                        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
                            <Link to="/login" onClick={closeMenus} className="rounded-lg border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-950">
                                Login
                            </Link>
                            <Link to="/register" onClick={closeMenus} className="rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-bold text-white">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}

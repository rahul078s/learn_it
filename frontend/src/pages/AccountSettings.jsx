import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem("learnit-theme");

    if (savedTheme) {
        return savedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getProfileFromToken = (user) => ({
    username: user?.username || "Learner",
    email: user?.email || "Not provided",
    role: user?.is_instructor ? "Instructor" : "Student",
    dateJoined: user?.date_joined || null,
});

const formatDate = (dateString) => {
    if (!dateString) return "Not available";

    return new Date(dateString).toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

export default function AccountSettings() {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [profile, setProfile] = useState(() => getProfileFromToken(user));
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [theme, setTheme] = useState(getInitialTheme);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("learnit-theme", theme);
    }, [theme]);

    useEffect(() => {
        let isMounted = true;

        const fetchProfile = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await api.get("/users/api/me/");

                if (isMounted) {
                    setProfile({
                        username: response.data.username || "Learner",
                        email: response.data.email || "Not provided",
                        role: response.data.is_instructor ? "Instructor" : "Student",
                        dateJoined: response.data.date_joined || null,
                    });
                }
            } catch (err) {
                console.error("Failed to fetch account details", err);

                if (isMounted) {
                    setProfile(getProfileFromToken(user));
                    setError("Could not load the latest account details. Showing your current session info.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchProfile();

        return () => {
            isMounted = false;
        };
    }, [user]);

    const profileInitial = useMemo(() => (
        profile.username.trim().charAt(0).toUpperCase() || "U"
    ), [profile.username]);

    const handleThemeChange = () => {
        setTheme((currentTheme) => currentTheme === "dark" ? "light" : "dark");
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        setError("");

        try {
            await api.delete("/users/api/me/");
            logout();
            navigate("/register");
        } catch (err) {
            console.error("Failed to delete account", err);
            setError("Could not delete your account right now. Please try again.");
        } finally {
            setDeleteLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-10 font-sans text-slate-950 transition-colors dark:bg-slate-950 dark:text-white">
            <div className="mx-auto max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600 dark:text-blue-400">Account</p>
                    <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl dark:text-white">Settings</h1>
                    <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-300">
                        Manage your personal information, display preference, and account access.
                    </p>
                </div>

                {error && (
                    <div className="mb-6 rounded-md border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
                        {error}
                    </div>
                )}

                <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
                    <aside className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex flex-col items-center text-center">
                            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-3xl font-bold text-white">
                                {profileInitial}
                            </div>
                            <h2 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">{profile.username}</h2>
                            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{profile.role}</p>
                        </div>
                    </aside>

                    <main className="space-y-6">
                        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="mb-5 flex items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Personal Information</h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Basic account details connected to your LearnIT profile.
                                    </p>
                                </div>
                                {loading && <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading...</span>}
                            </div>

                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Username</p>
                                    <p className="mt-2 font-semibold text-slate-950 dark:text-white">{profile.username}</p>
                                </div>
                                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</p>
                                    <p className="mt-2 break-words font-semibold text-slate-950 dark:text-white">{profile.email}</p>
                                </div>
                                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Account Type</p>
                                    <p className="mt-2 font-semibold text-slate-950 dark:text-white">{profile.role}</p>
                                </div>
                                <div className="rounded-md border border-slate-200 p-4 dark:border-slate-800">
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Joined</p>
                                    <p className="mt-2 font-semibold text-slate-950 dark:text-white">{formatDate(profile.dateJoined)}</p>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950 dark:text-white">Theme</h2>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        Switch between light and dark mode. Your choice is saved on this browser.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleThemeChange}
                                    className="inline-flex items-center justify-center rounded-md border border-blue-600 px-5 py-3 font-bold text-blue-600 transition hover:bg-blue-50 dark:border-blue-400 dark:text-blue-300 dark:hover:bg-blue-500/10"
                                >
                                    {theme === "dark" ? "Use Light Theme" : "Use Dark Theme"}
                                </button>
                            </div>
                        </section>

                        <section className="rounded-lg border border-red-200 bg-white p-6 shadow-sm dark:border-red-500/30 dark:bg-slate-900">
                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-red-700 dark:text-red-300">Delete Account</h2>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                                        Permanently delete your account, profile, and learning access.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setShowDeleteConfirm(true)}
                                    className="inline-flex items-center justify-center rounded-md bg-red-600 px-5 py-3 font-bold text-white transition hover:bg-red-700"
                                >
                                    Delete Account
                                </button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 px-5">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-slate-900">
                        <h2 className="text-xl font-bold text-slate-950 dark:text-white">Delete your account?</h2>
                        <p className="mt-3 leading-relaxed text-slate-600 dark:text-slate-300">
                            This action is permanent. Your account will be removed and you will lose access to your learning data.
                        </p>

                        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteLoading}
                                className="rounded-md border border-slate-300 px-4 py-2 font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={deleteLoading}
                                className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {deleteLoading ? "Deleting..." : "Yes, Delete Account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

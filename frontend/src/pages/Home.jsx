import { Link } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

export default function Home() {
    const { user } = useContext(AuthContext);

    return (
        <div className="min-h-screen font-sans text-slate-950">
            
            {/* 1. HERO SECTION */}
            <div className="border-b border-slate-200 bg-slate-50 px-5 py-20 text-center">
                <h1 className="mb-5 text-4xl font-black text-slate-900 sm:text-5xl">
                    Master New Skills, <span className="text-blue-600">Anywhere.</span>
                </h1>
                <p className="mx-auto mb-10 max-w-2xl text-xl leading-relaxed text-slate-600">
                    Join thousands of students learning from expert instructors. 
                    Build your portfolio, advance your career, and achieve your goals.
                </p>
                
                <div className="flex flex-wrap justify-center gap-5">
                    <Link to="/courses" className="rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700">
                        Explore Courses
                    </Link>

                    {!user ? (
                        <Link to="/register" className="rounded-lg border-2 border-blue-600 bg-white px-8 py-4 text-lg font-bold text-blue-600 transition hover:bg-blue-50">
                            Start for free
                        </Link>
                    ) : user.is_instructor ? (
                        <Link to="/instructor" className="rounded-lg border-2 border-blue-600 bg-white px-8 py-4 text-lg font-bold text-blue-600 transition hover:bg-blue-50">
                            Create a course
                        </Link>
                    ) : (
                        <Link to="/my-learning" className="rounded-lg border-2 border-blue-600 bg-white px-8 py-4 text-lg font-bold text-blue-600 transition hover:bg-blue-50">
                            Resume Learning
                        </Link>
                    )}
                </div>
            </div>

            {/* 2. VALUE PROPOSITION SECTION */}
            <div className="mx-auto my-16 max-w-6xl px-5">
                <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">Why LearnIT?</h2>
                
                <div className="grid gap-8 md:grid-cols-3">
                    
                    {/* Feature 1 */}
                    <div className="px-5 py-5 text-center">
                        <div className="mb-4 text-4xl">🚀</div>
                        <h3 className="mb-3 text-2xl font-semibold text-slate-900">Fast-Track Your Career</h3>
                        <p className="leading-relaxed text-slate-600">Our courses are designed to get you hired. Learn practical, real-world skills that employers are actively looking for.</p>
                    </div>

                    {/* Feature 2 */}
                    <div className="px-5 py-5 text-center">
                        <div className="mb-4 text-4xl">👨‍🏫</div>
                        <h3 className="mb-3 text-2xl font-semibold text-slate-900">Expert Instructors</h3>
                        <p className="leading-relaxed text-slate-600">Learn directly from industry professionals who have spent years mastering their craft in the real world.</p>
                    </div>

                    {/* Feature 3 */}
                    <div className="px-5 py-5 text-center">
                        <div className="mb-4 text-4xl">♾️</div>
                        <h3 className="mb-3 text-2xl font-semibold text-slate-900">Lifetime Access</h3>
                        <p className="leading-relaxed text-slate-600">Enroll once and learn at your own pace. You get lifetime access to the course materials and all future updates.</p>
                    </div>

                </div>
            </div>
            
        </div>
    );
}

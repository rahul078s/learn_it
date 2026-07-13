import { useState, useEffect } from "react";
import api from '../api/axios';

export default function StudentDashboard() {
    const [myCourses, setmyCourses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses/api/mycourses/');
                setmyCourses(response.data);
            } catch (err) {
                console.error('Failed to fetch courses', err);
                setError('Could not load courses. Are you sure you are logged in?');
            }
        };
        fetchCourses();
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-5 py-8">
            <h2 className="mb-6 text-3xl font-bold text-slate-900">My Learnings</h2>
            {error && <p className="text-red-600">{error}</p>}

            {myCourses.map((enrollment) =>
                <div key={enrollment.id} className="my-3 rounded-lg border border-slate-900 p-5">
                    <h3 className="mb-2 text-xl font-semibold text-slate-900">{ enrollment.course_title }</h3>
                    <p className="text-slate-700">{ enrollment.course_description }</p>
                    
                    <p className="mt-4 text-sm text-slate-500">
                        Enrolled on: {new Date(enrollment.enroll_date).toLocaleDateString()}
                    </p>
                    
                    <button className="mt-3 rounded bg-blue-700 px-4 py-2 text-white transition hover:bg-blue-800">
                        Continue Learning
                    </button>
                </div>
            )}
        </div>
    );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAllCourses = async () => {
            try {
                const response = await api.get('courses/api/courses');

                // If Django uses Pagination, the courses will be hidden in .results
                if (response.data.results) {
                    setCourses(response.data.results);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);
                setError("Could not fetch courses");
            } finally {
                setLoading(false);
            }
        };
        fetchAllCourses();
    }, []);

    return (
        <div className="mx-auto max-w-6xl px-5 py-6">
            <h1 className="mb-3 text-3xl font-bold text-slate-900">Discover Your Next Skill</h1>
            <p className="mb-8 text-slate-500">Browse our complete list of courses.</p>

            {error && <p className="text-red-600">{error}</p>}
            {loading && <p>Loading coureses...</p>}

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {courses.map((course) => (
                    <div key={course.id} className="rounded-lg border border-slate-200 bg-white p-5">
                        {course.thumbnail ? (
                            <img 
                                src={course.thumbnail} 
                                alt={course.title} 
                                className="mb-4 aspect-video w-full rounded bg-slate-950 object-contain" 
                            />
                        ) : (
                            // Fallback if the instructor hasn't uploaded a thumbnail yet
                            <div className="mb-4 flex aspect-video w-full items-center justify-center rounded bg-slate-100 text-slate-400">
                                No Image Available
                            </div>
                        )}

                        <h3 className="mb-3 text-lg font-semibold text-slate-950">{course.name}</h3>
                        <p className="mb-4 text-sm leading-relaxed text-slate-600">
                            {course.description.substring(0, 100)}... {/* Truncate long descriptions */}
                        </p>

                        <div className="flex items-center justify-between gap-4">
                            <span className="text-base font-bold text-slate-900">${course.price}</span>
                            <button
                                onClick={() => navigate(`/courses/${course.id}`)}
                                className="rounded bg-blue-600 px-4 py-2 font-bold text-white transition hover:bg-blue-700">
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

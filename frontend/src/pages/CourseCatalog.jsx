import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const searchTerm = searchParams.get('search')?.trim() || '';

    useEffect(() => {
        let isMounted = true;

        const fetchAllCourses = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get('/courses/api/courses/', {
                    params: searchTerm ? { search: searchTerm } : {}
                });

                const courseList = response.data?.results || response.data || [];

                if (isMounted) {
                    setCourses(courseList);
                }
            } catch (err) {
                console.error("Failed to fetch courses", err);

                if (isMounted) {
                    setError("Could not fetch courses");
                    setCourses([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchAllCourses();

        return () => {
            isMounted = false;
        };
    }, [searchTerm]);

    return (
        <div className="mx-auto max-w-6xl px-5 py-6">
            <h1 className="mb-3 text-3xl font-bold text-slate-900">
                {searchTerm ? `Search results for "${searchTerm}"` : 'Discover Your Next Skill'}
            </h1>
            <p className="mb-8 text-slate-500">
                {searchTerm ? 'Courses matching your search across titles and descriptions.' : 'Browse our complete list of courses.'}
            </p>

            {error && <p className="text-red-600">{error}</p>}
            {loading && <p>Loading courses...</p>}

            {!loading && !error && courses.length === 0 && (
                <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                    No courses found{searchTerm ? ` for "${searchTerm}"` : ''}.
                </div>
            )}

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

                        <h3 className="mb-3 text-lg font-semibold text-slate-950">{course.title}</h3>
                        <p className="mb-4 text-sm leading-relaxed text-slate-600">
                            {(course.description || '').substring(0, 100)}... {/* Truncate long descriptions */}
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

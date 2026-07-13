import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

export default function CourseDetail() {
    const { id } = useParams();

    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await api.get(`/courses/api/courses/${id}`);
                setCourse(response.data);
            } catch (err) {
                console.error("Failed to fetch course details", err);
                setError('Could not load the course details.');
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]) // Pass id in dependency array so that it run fetchCourse every time the id changes;

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        try {
            await api.post('courses/api/enroll/', { course: id });
            navigate('/my-learning');
        } catch (err) {
            console.error("Enrollment failed", err);
            alert(err.response?.data?.detail || "Failed to enroll. Please try again.");
        }
    };

    if (loading) return <div className="p-10">Loading course details...</div>;
    if (error) return <div className="p-10 text-red-600">{error}</div>;
    if (!course) return <div className="p-10">Course not found.</div>;

    return (
        <div className="mx-auto my-10 max-w-3xl px-5 font-sans">
            <button 
                onClick={() => navigate('/courses')}
                className="mb-5 p-0 text-blue-600 hover:text-blue-700"
            >
                ← Back to Catalog
            </button>
            
            {course.thumbnail ? (
                <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    className="mb-5 aspect-video w-full rounded-lg bg-slate-950 object-contain" 
                />
            ) : (
                <div className="mb-5 flex aspect-video w-full items-center justify-center rounded-lg bg-slate-100 text-slate-400">
                    No Image Available
                </div>
            )}

            <h1 className="mb-3 text-3xl font-bold text-slate-900">{course.title}</h1>
            <p className="mb-5 text-xl font-bold text-blue-600">
                ${course.price}
            </p>

            <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5 leading-relaxed">
                <h3 className="mb-2 text-xl font-semibold text-slate-900">About This Course</h3>
                <p>{course.description}</p>
            </div>

            <button 
                onClick={handleEnroll}
                className="w-full rounded-lg bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
            >
                Enroll in Course
            </button>
        </div>
    );
}

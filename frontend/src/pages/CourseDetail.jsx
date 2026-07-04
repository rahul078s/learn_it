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

    if (loading) return <div style={{ padding: '40px' }}>Loading course details...</div>;
    if (error) return <div style={{ padding: '40px', color: 'red' }}>{error}</div>;
    if (!course) return <div style={{ padding: '40px' }}>Course not found.</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <button 
                onClick={() => navigate('/courses')}
                style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '20px', padding: 0 }}
            >
                ← Back to Catalog
            </button>
            
            {course.thumbnail ? (
                <img 
                    src={course.thumbnail} 
                    alt={course.title} 
                    style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px', marginBottom: '20px' }} 
                />
            ) : (
                <div style={{ backgroundColor: '#f3f4f6', height: '300px', borderRadius: '8px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af' }}>
                    No Image Available
                </div>
            )}

            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>{course.title}</h1>
            <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#2563eb', marginBottom: '20px' }}>
                ${course.price}
            </p>

            <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', border: '1px solid #e0e0e0', marginBottom: '30px', lineHeight: '1.6' }}>
                <h3>About This Course</h3>
                <p>{course.description}</p>
            </div>

            <button 
                onClick={handleEnroll}
                style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', width: '100%' }}
            >
                Enroll in Course
            </button>
        </div>
    );
}
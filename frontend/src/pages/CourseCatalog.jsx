import { useState, useEffect } from "react";
import api from "../api/axios";

export default function CourseCatalog() {
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
            <h1 style={{ marginBottom: '10px' }}>Discover Your Next Skill</h1>
            <p style={{ color: 'gray', marginBottom: '30px' }}>Browse our complete list of courses.</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}
            {loading && <p>Loading coureses...</p>}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                {courses.map((course) => (
                    <div key={course.id} style={{ border: '1px solid #e0e0e0', borderRadius: '8px', padding: '20px', backgroundColor: 'white' }}>
                        {/* Add images in below div later if needed */}
                        <div style={{ height: '150px', backgroundColor: '#f3f4f6', borderRadius: '4px', marginBottom: '15px' }}></div>

                        <h3 style={{ margin: '0 0 10px 0', fontSize: '18px', color: '#1a1a1a' }}>{course.name}</h3>
                        <p style={{ color: '#555', fontSize: '14px', marginBottom: '15px', lineHeight: '1.5' }}>
                            {course.description.substring(0, 100)}... {/* Truncate long descriptions */}
                        </p>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '16px' }}>${course.price}</span>
                            <button style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
                                View Details
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

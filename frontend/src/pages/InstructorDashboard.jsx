import { useState, useEffect } from "react";
import api from "../api/axios";

export default function InstructorDashboard() {
    const [myCourses, setMyCourses] = useState([]);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: ''
    });

    const [thumbnail, setThumbnail] = useState(null);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    async function fetchMyCourses() {
        const response = await api.get('/courses/api/instructor/courses/');
        return response.data?.results || response.data || [];
    }

    useEffect(() => {
        let isMounted = true;

        fetchMyCourses()
            .then((courses) => {
                if (isMounted) {
                    setMyCourses(courses);
                }
            })
            .catch((err) => {
                console.error("Failed to fetch your courses", err);
            });

        return () => {
            isMounted = false;
        };
    }, []);

    const handleTextChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    };

    const handleFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const submitData = new FormData();
        submitData.append('title', formData.title);
        submitData.append('description', formData.description);
        submitData.append('price', formData.price);

        if (thumbnail) {
            submitData.append('thumbnail', thumbnail);
        }

        try {
            await api.post('courses/api/instructor/courses/', submitData);

            setFormData({ title: '', description: '', price: '' });
            setThumbnail(null);
            document.getElementById('thumbnail-upload').value = '';

            const courses = await fetchMyCourses();
            setMyCourses(courses);

        } catch (err) {
            console.error("Creation failed", err);
            setError("Failed to create course. Please check your inputs.");

        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            <h1 style={{ fontSize: '32px', marginBottom: '10px' }}>Instructor Dashboard</h1>
            <p style={{ color: '#555', marginBottom: '40px' }}>Welcome to the LearnIT creation hub. Build and manage your courses here.</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>

                {/* LEFT COLUMN: THE CREATION FORM */}
                <div style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '8px', border: '1px solid #e0e0e0' }}>
                    <h2 style={{ marginBottom: '20px' }}>Create New Course</h2>

                    {error && <div style={{ backgroundColor: '#fee2e2', color: '#dc2626', padding: '10px', borderRadius: '4px', marginBottom: '15px' }}>{error}</div>}

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Course Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleTextChange} required style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Description</label>
                            <textarea name="description" value={formData.description} onChange={handleTextChange} required rows="4" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }}></textarea>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleTextChange} required step="0.01" style={{ width: '100%', padding: '10px', boxSizing: 'border-box' }} />
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Course Thumbnail (Image)</label>
                            <input type="file" id="thumbnail-upload" accept="image/*" onChange={handleFileChange} style={{ width: '100%', padding: '10px 0' }} />
                        </div>

                        <button type="submit" disabled={loading} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px', borderRadius: '4px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
                            {loading ? 'Publishing Course...' : 'Publish Course'}
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: MY PUBLISHED COURSES */}
                <div>
                    <h2 style={{ marginBottom: '20px' }}>My Published Courses</h2>

                    {myCourses.length === 0 ? (
                        <div style={{ padding: '40px', backgroundColor: '#f8fafc', borderRadius: '8px', textAlign: 'center', color: '#9ca3af' }}>
                            You haven't published any courses yet.
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {myCourses.map(course => (
                                <div key={course.id} style={{ display: 'flex', gap: '15px', padding: '15px', backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', alignItems: 'center' }}>
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt="thumbnail" style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '4px' }} />
                                    ) : (
                                        <div style={{ width: '80px', height: '80px', backgroundColor: '#f3f4f6', borderRadius: '4px' }}></div>
                                    )}
                                    <div>
                                        <h3 style={{ margin: '0 0 5px 0', fontSize: '18px' }}>{course.title}</h3>
                                        <p style={{ margin: 0, color: '#2563eb', fontWeight: 'bold' }}>${course.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}

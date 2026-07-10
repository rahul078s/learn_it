import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";

export default function CourseManager() {
    const { id } = useParams();

    const [course, setCourse] = useState(null);
    const [moduleTitle, setModuleTitle] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [error, setError] = useState('');

    const getCourseData = useCallback(async () => {
        const response = await api.get(`/courses/api/courses/${id}`);
        return response.data;
    }, [id]);

    useEffect(() => {
        let isMounted = true;

        getCourseData()
            .then((courseData) => {
                if (isMounted) {
                    setCourse(courseData);
                    setError('');
                }
            })
            .catch((err) => {
                console.error("Failed to fetch course data", err);
                if (isMounted) {
                    setError("Could not load this course.");
                }
            })
            .finally(() => {
                if (isMounted) {
                    setPageLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, [getCourseData]);

    const handleAddModule = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.post('/courses/api/modules/', {
                course: id,
                title: moduleTitle,
                description: 'NA',
                order: (course?.modules?.length || 0) + 1
            });

            setModuleTitle('');
            const courseData = await getCourseData();
            setCourse(courseData);

        } catch (err) {
            console.error("Failed to add module", err);
            alert("Could not create module. Check console for backend errors.");

        } finally {
            setLoading(false);
        }
    };

    const handleDeleteModule = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await api.delete(`/courses/api/modules/${e.target.value}/`);
            const courseData = await getCourseData();
            setCourse(courseData);

        } catch (err) {
            console.error("Unable to delete the Module", err);
            // alert("Could not delete the module. Check console to fix.")

        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>Loading course manager...</div>;
    }

    if (error || !course) {
        return <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', color: 'red', fontFamily: 'sans-serif' }}>{error || 'Course not found.'}</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
            
            <Link to="/instructor" style={{ color: '#2563eb', textDecoration: 'none', marginBottom: '20px', display: 'inline-block' }}>
                &larr; Back to Dashboard
            </Link>

            <div style={{ padding: '20px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '30px' }}>
                <h1 style={{ margin: '0 0 10px 0' }}>{course.title || course.name}</h1>
                <p style={{ margin: 0, color: '#64748b' }}>Curriculum Manager</p>
            </div>

            {/* MODULE CREATION FORM */}
            <div style={{ padding: '20px', backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '8px', marginBottom: '30px' }}>
                <h3 style={{ marginTop: 0 }}>Add New Module</h3>
                <form onSubmit={handleAddModule} style={{ display: 'flex', gap: '10px' }}>
                    <input 
                        type="text" 
                        value={moduleTitle} 
                        onChange={(e) => setModuleTitle(e.target.value)} 
                        placeholder="e.g., Module 1: Introduction to Python" 
                        required 
                        style={{ flex: 1, padding: '10px' }}
                    />
                    <button type="submit" disabled={loading} style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                        {loading ? 'Saving...' : '+ Add'}
                    </button>
                </form>
            </div>

            {/* CURRICULUM LIST */}
            <div>
                <h2 style={{ marginBottom: '15px' }}>Course Modules</h2>
                
                {!course.modules || course.modules.length === 0 ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#9ca3af', border: '1px dashed #ccc' }}>
                        No modules created yet. Add one above!
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {course.modules.map((mod, index) => (
                            <div key={mod.id} style={{ padding: '15px', backgroundColor: 'white', border: '1px solid #e0e0e0', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <strong>{index + 1}. {mod.title}</strong>
                                <span style={{ color: '#9ca3af', fontSize: '14px' }}>Empty Module (Lessons coming in Prod!)</span>
                                <button onClick={handleDeleteModule} value={mod.id} style={{ backgroundColor: '#eb2525', color: 'white', border: 'none', padding: '10px 20px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 'bold' }}>
                                    {loading ? 'Deleting' : 'Delete'}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}

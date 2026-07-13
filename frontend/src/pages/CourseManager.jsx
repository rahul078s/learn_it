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
        return <div className="mx-auto my-10 max-w-3xl px-5 font-sans">Loading course manager...</div>;
    }

    if (error || !course) {
        return <div className="mx-auto my-10 max-w-3xl px-5 font-sans text-red-600">{error || 'Course not found.'}</div>;
    }

    return (
        <div className="mx-auto my-10 max-w-3xl px-5 font-sans">
            
            <Link to="/instructor" className="mb-5 inline-block text-blue-600 hover:text-blue-700">
                &larr; Back to Dashboard
            </Link>

            <div className="mb-8 rounded-lg border border-slate-200 bg-slate-50 p-5">
                <h1 className="mb-3 text-3xl font-bold text-slate-900">{course.title || course.name}</h1>
                <p className="text-slate-500">Curriculum Manager</p>
            </div>

            {/* MODULE CREATION FORM */}
            <div className="mb-8 rounded-lg border border-slate-200 bg-white p-5">
                <h3 className="mb-4 text-xl font-semibold text-slate-900">Add New Module</h3>
                <form onSubmit={handleAddModule} className="flex flex-col gap-3 sm:flex-row">
                    <input 
                        type="text" 
                        value={moduleTitle} 
                        onChange={(e) => setModuleTitle(e.target.value)} 
                        placeholder="e.g., Module 1: Introduction to Python" 
                        required 
                        className="flex-1 rounded border border-slate-300 px-3 py-2"
                    />
                    <button type="submit" disabled={loading} className="rounded bg-blue-600 px-5 py-2 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
                        {loading ? 'Saving...' : '+ Add'}
                    </button>
                </form>
            </div>

            {/* CURRICULUM LIST */}
            <div>
                <h2 className="mb-4 text-2xl font-semibold text-slate-900">Course Modules</h2>
                
                {!course.modules || course.modules.length === 0 ? (
                    <div className="border border-dashed border-slate-300 p-5 text-center text-slate-400">
                        No modules created yet. Add one above!
                    </div>
                ) : (
                    <div className="flex flex-col gap-3">
                        {course.modules.map((mod, index) => (
                            <div key={mod.id} className="flex flex-col gap-3 rounded border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                                <strong>{index + 1}. {mod.title}</strong>
                                <span className="text-sm text-slate-400">Empty Module (Lessons coming in Prod!)</span>
                                <button onClick={handleDeleteModule} value={mod.id} className="rounded bg-red-600 px-5 py-2 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">
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

import { useState, useEffect } from "react";
import api from "../api/axios";
import { Link } from "react-router-dom";

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
        <div className="mx-auto my-10 max-w-6xl px-5 font-sans">
            <h1 className="mb-3 text-3xl font-bold text-slate-900">Instructor Dashboard</h1>
            <p className="mb-10 text-slate-600">Welcome to the LearnIT creation hub. Build and manage your courses here.</p>

            <div className="grid gap-10 lg:grid-cols-2">

                {/* LEFT COLUMN: THE CREATION FORM */}
                <div className="rounded-lg border border-slate-200 bg-white p-8">
                    <h2 className="mb-5 text-2xl font-semibold text-slate-900">Create New Course</h2>

                    {error && <div className="mb-4 rounded bg-red-100 p-3 text-red-600">{error}</div>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div>
                            <label className="mb-1 block font-bold text-slate-900">Course Title</label>
                            <input type="text" name="title" value={formData.title} onChange={handleTextChange} required className="w-full rounded border border-slate-300 px-3 py-2" />
                        </div>

                        <div>
                            <label className="mb-1 block font-bold text-slate-900">Description</label>
                            <textarea name="description" value={formData.description} onChange={handleTextChange} required rows="4" className="w-full rounded border border-slate-300 px-3 py-2"></textarea>
                        </div>

                        <div>
                            <label className="mb-1 block font-bold text-slate-900">Price ($)</label>
                            <input type="number" name="price" value={formData.price} onChange={handleTextChange} required step="0.01" className="w-full rounded border border-slate-300 px-3 py-2" />
                        </div>

                        <div>
                            <label className="mb-1 block font-bold text-slate-900">Course Thumbnail (Image)</label>
                            <input type="file" id="thumbnail-upload" accept="image/*" onChange={handleFileChange} className="w-full py-3" />
                        </div>

                        <button type="submit" disabled={loading} className="mt-3 rounded bg-blue-600 p-4 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70">
                            {loading ? 'Publishing Course...' : 'Publish Course'}
                        </button>
                    </form>
                </div>

                {/* RIGHT COLUMN: MY PUBLISHED COURSES */}
                <div>
                    <h2 className="mb-5 text-2xl font-semibold text-slate-900">My Published Courses</h2>

                    {myCourses.length === 0 ? (
                        <div className="rounded-lg bg-slate-50 p-10 text-center text-slate-400">
                            You haven't published any courses yet.
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {myCourses.map(course => (
                                <div key={course.id} className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-4">
                                    {course.thumbnail ? (
                                        <img src={course.thumbnail} alt="thumbnail" className="h-20 w-20 rounded bg-slate-950 object-contain" />
                                    ) : (
                                        <div className="h-20 w-20 rounded bg-slate-100"></div>
                                    )}
                                    <div>
                                        <h3 className="mb-1 text-lg font-semibold text-slate-900">
                                            <Link to={`/instructor/courses/${course.id}`} className="hover:text-blue-600">
                                                {course?.title || course?.name || 'Untitled Course'}
                                            </Link>
                                        </h3>
                                        <p className="font-bold text-blue-600">${course.price}</p>
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

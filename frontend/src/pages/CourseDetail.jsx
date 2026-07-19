import { useEffect, useMemo, useState, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import AuthContext from "../context/AuthContext";

const formatPrice = (price) => {
    const amount = Number(price);

    if (!Number.isFinite(amount) || amount === 0) {
        return 'Free';
    }

    return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
};

const getModules = (course) => course?.modules || [];

const getLessonCount = (course) => (
    getModules(course).reduce((total, module) => total + (module.lessons?.length || 0), 0)
);

function CourseThumbnail({ course }) {
    if (course.thumbnail) {
        return (
            <img
                src={course.thumbnail}
                alt={course.title}
                className="h-full w-full bg-slate-950 object-contain"
            />
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-semibold uppercase tracking-wide text-slate-400">
            Course thumbnail
        </div>
    );
}

function StatBlock({ value, label }) {
    return (
        <div className="min-h-24 rounded-md border border-slate-200 bg-white px-5 py-4">
            <p className="text-2xl font-bold text-slate-950">{value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
        </div>
    );
}

function PreviewMetric({ label, value }) {
    return (
        <div className="flex min-h-20 flex-1 flex-col justify-center rounded-md bg-slate-50 px-4 py-3">
            <p className="text-sm font-semibold text-slate-500">{label}</p>
            <p className="mt-1 text-xl font-bold text-slate-950">{value}</p>
        </div>
    );
}

export default function CourseDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [course, setCourse] = useState(null);
    const [loading, setLoading] = useState(true);
    const [enrolling, setEnrolling] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchCourse = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get(`/courses/api/courses/${id}`);

                if (isMounted) {
                    setCourse(response.data);
                }
            } catch (err) {
                console.error("Failed to fetch course details", err);

                if (isMounted) {
                    setError('Could not load the course details.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourse();

        return () => {
            isMounted = false;
        };
    }, [id]);

    const modules = useMemo(() => getModules(course), [course]);
    const lessonCount = useMemo(() => getLessonCount(course), [course]);
    const priceLabel = formatPrice(course?.price);

    const handleEnroll = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        setEnrolling(true);

        try {
            await api.post('/courses/api/enroll/', { course: id });
            navigate('/my-learning');
        } catch (err) {
            console.error("Enrollment failed", err);
            alert(err.response?.data?.detail || "Failed to enroll. Please try again.");
        } finally {
            setEnrolling(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-10 font-sans">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-8 h-5 w-56 rounded bg-slate-200" />
                    <div className="grid gap-8 lg:grid-cols-12">
                        <div className="space-y-4 lg:col-span-7">
                            <div className="h-12 w-3/4 rounded bg-slate-200" />
                            <div className="h-5 w-full rounded bg-slate-200" />
                            <div className="h-5 w-2/3 rounded bg-slate-200" />
                        </div>
                        <div className="aspect-video rounded-lg border border-slate-200 bg-white lg:col-span-5" />
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-10 font-sans">
                <div className="mx-auto max-w-3xl rounded-lg border border-red-200 bg-white p-6 text-red-700">
                    {error}
                </div>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-10 font-sans">
                <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-6 text-slate-700">
                    Course not found.
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white font-sans text-slate-950">
            <section className="border-b border-slate-200 bg-slate-50 px-5 py-8 sm:py-12">
                <div className="mx-auto max-w-7xl">
                    <div className="mb-10 flex flex-wrap items-center gap-3 text-sm font-medium text-slate-500">
                        <Link to="/" className="hover:text-blue-600">Home</Link>
                        <span>/</span>
                        <Link to="/courses" className="hover:text-blue-600">Courses</Link>
                        <span>/</span>
                        <span className="max-w-72 truncate text-slate-800">{course.title}</span>
                    </div>

                    <div className="grid gap-10 lg:grid-cols-12 lg:items-start">
                        <div className="lg:col-span-7">
                            <p className="mb-5 inline-flex rounded-full border border-slate-300 bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-slate-800">
                                Professional Course
                            </p>
                            <h1 className="max-w-4xl text-4xl font-bold leading-tight text-slate-950 lg:text-5xl">
                                {course.title}
                            </h1>
                            <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-700">
                                {course.description}
                            </p>

                            <div className="mt-8 grid gap-4 md:grid-cols-3">
                                <StatBlock value={modules.length} label="Modules" />
                                <StatBlock value={lessonCount} label="Lessons" />
                                <StatBlock value={priceLabel} label="Access" />
                            </div>

                            <div className="flex flex-col gap-3 pt-8 sm:flex-row">
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling}
                                    className="inline-flex min-h-12 min-w-44 items-center justify-center whitespace-nowrap rounded-md bg-blue-600 px-6 text-base font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {enrolling ? 'Enrolling...' : user ? 'Enroll in Course' : 'Log in to Enroll'}
                                </button>
                                <button
                                    onClick={() => navigate('/courses')}
                                    className="inline-flex min-h-12 min-w-40 items-center justify-center whitespace-nowrap rounded-md border border-slate-300 bg-white px-6 text-base font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
                                >
                                    Back to Catalog
                                </button>
                            </div>
                        </div>

                        <div className="lg:col-span-5">
                            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                                <div className="aspect-video overflow-hidden rounded-md bg-slate-950">
                                    <CourseThumbnail course={course} />
                                </div>
                                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                                    <PreviewMetric label="Course price" value={priceLabel} />
                                    <PreviewMetric label="Total items" value={modules.length + lessonCount} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <main className="mx-auto grid max-w-7xl gap-8 px-5 py-10 lg:grid-cols-[1fr_360px]">
                <div className="space-y-8">
                    <section>
                        <h2 className="text-3xl font-bold text-slate-950">About This Course</h2>
                        <div className="mt-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                            <p className="max-w-4xl text-base leading-8 text-slate-700">
                                {course.description}
                            </p>
                        </div>
                    </section>

                    <section>
                        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                            <div>
                                <h2 className="text-3xl font-bold text-slate-950">Course Curriculum</h2>
                                <p className="mt-2 text-slate-600">
                                    Review the module structure before enrolling.
                                </p>
                            </div>
                            <p className="text-sm font-semibold text-slate-500">
                                {modules.length} modules / {lessonCount} lessons
                            </p>
                        </div>

                        {modules.length === 0 ? (
                            <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                <h3 className="text-lg font-semibold text-slate-800">Curriculum coming soon.</h3>
                                <p className="mt-2 text-sm text-slate-500">
                                    Modules and lessons will appear here as the instructor publishes them.
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {modules.map((module, moduleIndex) => {
                                    const lessons = module.lessons || [];

                                    return (
                                        <article key={module.id} className="rounded-lg border border-slate-200 bg-white shadow-sm">
                                            <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                                                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                    <div>
                                                        <p className="text-xs font-bold uppercase tracking-wide text-blue-600">
                                                            Module {module.order || moduleIndex + 1}
                                                        </p>
                                                        <h3 className="mt-1 text-lg font-bold text-slate-950">{module.title}</h3>
                                                        {module.description && (
                                                            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-slate-600">
                                                                {module.description}
                                                            </p>
                                                        )}
                                                    </div>
                                                    <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                                                        {lessons.length} lessons
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="divide-y divide-slate-200">
                                                {lessons.length === 0 ? (
                                                    <p className="px-5 py-4 text-sm text-slate-500">
                                                        Lessons have not been added to this module yet.
                                                    </p>
                                                ) : (
                                                    lessons.map((lesson, lessonIndex) => (
                                                        <div key={lesson.id} className="flex items-center gap-4 px-5 py-4">
                                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-sm font-bold text-blue-700">
                                                                {lesson.order || lessonIndex + 1}
                                                            </div>
                                                            <div className="min-w-0">
                                                                <h4 className="font-semibold text-slate-900">{lesson.title}</h4>
                                                                <p className="mt-1 text-sm text-slate-500">
                                                                    Lesson media space will be available inside the student dashboard.
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </article>
                                    );
                                })}
                            </div>
                        )}
                    </section>
                </div>

                <aside className="lg:pt-14">
                    <div className="sticky top-24 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Enroll Today</p>
                        <p className="mt-2 text-3xl font-bold text-slate-950">{priceLabel}</p>
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
                            Get access to the full course structure, modules, and lesson workspace after enrollment.
                        </p>

                        <button
                            onClick={handleEnroll}
                            disabled={enrolling}
                            className="mt-5 w-full rounded-md bg-blue-600 px-5 py-3 font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {enrolling ? 'Enrolling...' : user ? 'Enroll in Course' : 'Log in to Enroll'}
                        </button>

                        <div className="mt-5 space-y-3 border-t border-slate-200 pt-5 text-sm text-slate-600">
                            <div className="flex items-center justify-between gap-3">
                                <span>Modules</span>
                                <strong className="text-slate-950">{modules.length}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Lessons</span>
                                <strong className="text-slate-950">{lessonCount}</strong>
                            </div>
                            <div className="flex items-center justify-between gap-3">
                                <span>Access type</span>
                                <strong className="text-slate-950">Self-paced</strong>
                            </div>
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
}

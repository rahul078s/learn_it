import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from '../api/axios';

const formatDate = (dateString) => {
    if (!dateString) return 'Recently';

    return new Date(dateString).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });
};

const getModules = (course) => course?.modules || [];

const getLessonCount = (course) => (
    getModules(course).reduce((total, module) => total + (module.lessons?.length || 0), 0)
);

const getCourseTitle = (enrollment) => (
    enrollment.courseDetails?.title || enrollment.course_title || 'Untitled course'
);

const getCourseDescription = (enrollment) => (
    enrollment.courseDetails?.description || enrollment.course_description || 'Course details will appear here.'
);

function Thumbnail({ course, title }) {
    if (course?.thumbnail) {
        return (
            <img
                src={course.thumbnail}
                alt={title}
                className="h-full w-full bg-slate-950 object-contain"
            />
        );
    }

    return (
        <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">
            Thumbnail
        </div>
    );
}

function MediaSlot({ title, description }) {
    return (
        <div className="flex min-h-28 flex-col justify-center rounded-md border border-dashed border-slate-300 bg-slate-50 px-4 py-5">
            <p className="text-sm font-semibold text-slate-700">{title}</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">{description}</p>
        </div>
    );
}

export default function StudentDashboard() {
    const [myCourses, setMyCourses] = useState([]);
    const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        let isMounted = true;

        const fetchCourses = async () => {
            setLoading(true);
            setError('');

            try {
                const response = await api.get('/courses/api/mycourses/');
                const enrollments = response.data || [];
                
                // Hydrate or Add course data into enrollments
                const hydratedEnrollments = await Promise.all(
                    enrollments.map(async (enrollment) => {
                        try {
                            const courseResponse = await api.get(`/courses/api/courses/${enrollment.course}`);
                            return {
                                ...enrollment,
                                courseDetails: courseResponse.data,
                            };
                        } catch (courseError) {
                            console.error('Failed to fetch enrolled course details', courseError);
                            return {
                                ...enrollment,
                                courseDetails: null,
                            };
                        } // Used try catch so that even if a promise fails Promise.all() still succeeds with an array.
                    })
                );

                if (isMounted) {
                    setMyCourses(hydratedEnrollments);
                    setSelectedEnrollmentId(hydratedEnrollments[0]?.id || null);
                }
            } catch (err) {
                console.error('Failed to fetch courses', err);
                if (isMounted) {
                    setError('Could not load your courses. Please log in again and retry.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchCourses();

        return () => {
            isMounted = false;
        };
    }, []);

    const selectedEnrollment = useMemo(() => (
        myCourses.find((enrollment) => enrollment.id === selectedEnrollmentId) || myCourses[0]
    ), [myCourses, selectedEnrollmentId]);

    const dashboardTotals = useMemo(() => (
        myCourses.reduce((totals, enrollment) => {
            const course = enrollment.courseDetails;

            return {
                modules: totals.modules + getModules(course).length,
                lessons: totals.lessons + getLessonCount(course),
            };
        }, { modules: 0, lessons: 0 })
    ), [myCourses]);

    const selectedCourse = selectedEnrollment?.courseDetails;
    const modules = getModules(selectedCourse);
    const selectedLessonCount = getLessonCount(selectedCourse);
    const selectedModuleCount = modules.length;

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-10 font-sans">
                <div className="mx-auto max-w-6xl">
                    <div className="mb-6 h-8 w-56 rounded bg-slate-200" />
                    <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
                        <div className="h-96 rounded-lg border border-slate-200 bg-white" />
                        <div className="h-96 rounded-lg border border-slate-200 bg-white" />
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

    if (myCourses.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 px-5 py-10 font-sans">
                <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 text-center">
                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">My Learning</p>
                    {/* <h1 className="mt-3 text-3xl font-bold text-slate-950">Your dashboard is ready.</h1> */}
                    <p className="mx-auto mt-3 max-w-xl leading-relaxed text-slate-600">
                        Enroll in a course to see its modules, lessons, and production media spaces here.
                    </p>
                    <Link
                        to="/courses"
                        className="mt-6 inline-flex rounded-md bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                    >
                        Browse Courses
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 px-5 py-8 font-sans text-slate-950">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Student Dashboard</p>
                        <h1 className="mt-2 text-3xl font-bold text-slate-950 sm:text-4xl">My Learning</h1>
                        <p className="mt-2 max-w-2xl text-slate-600">
                            Access your enrolled courses, review every module, and move through lessons in a structured workspace.
                        </p>
                    </div>

                    <div className="grid grid-cols-3 gap-3 rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
                        <div className="px-4 py-2">
                            <p className="text-2xl font-bold text-slate-950">{myCourses.length}</p>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Courses</p>
                        </div>
                        <div className="border-x border-slate-200 px-4 py-2">
                            <p className="text-2xl font-bold text-slate-950">{dashboardTotals.modules}</p>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Modules</p>
                        </div>
                        <div className="px-4 py-2">
                            <p className="text-2xl font-bold text-slate-950">{dashboardTotals.lessons}</p>
                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lessons</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-[340px_1fr]">
                    <aside className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-950">Enrolled Courses</h2>
                            <Link to="/courses" className="text-sm font-semibold text-blue-600 hover:text-blue-700">
                                Browse
                            </Link>
                        </div>

                        <div className="space-y-3">
                            {myCourses.map((enrollment) => {
                                const course = enrollment.courseDetails;
                                const title = getCourseTitle(enrollment);
                                const isSelected = enrollment.id === selectedEnrollment?.id;

                                return (
                                    <button
                                        key={enrollment.id}
                                        type="button"
                                        onClick={() => setSelectedEnrollmentId(enrollment.id)}
                                        className={`w-full rounded-md border p-3 text-left transition cursor-pointer ${
                                            isSelected
                                                ? 'border-blue-500 bg-blue-50 shadow-sm'
                                                : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className="h-16 w-24 shrink-0 overflow-hidden rounded bg-slate-100">
                                                <Thumbnail course={course} title={title} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="line-clamp-2 text-sm font-bold text-slate-950">{title}</h3>
                                                <p className="mt-1 text-xs text-slate-500">
                                                    Enrolled {formatDate(enrollment.enroll_date)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="mt-3 flex items-center gap-2 text-xs font-medium text-slate-500">
                                            <span>{getModules(course).length} modules</span>
                                            <span className="h-1 w-1 rounded-full bg-slate-300" />
                                            <span>{getLessonCount(course)} lessons</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </aside>

                    <main className="space-y-6">
                        <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                            <div className="grid gap-5 lg:grid-cols-12 lg:items-start">
                                <div className="aspect-video w-full overflow-hidden rounded-md bg-slate-950 lg:col-span-5">
                                    <Thumbnail course={selectedCourse} title={getCourseTitle(selectedEnrollment)} />
                                </div>

                                <div className="min-w-0 lg:col-span-7">
                                    <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                                        Current Course  
                                    </p>
                                    <h2 className="mt-2 max-w-3xl text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
                                        {getCourseTitle(selectedEnrollment)}
                                    </h2>
                                    <p className="mt-3 max-w-3xl leading-relaxed text-slate-600">
                                        {getCourseDescription(selectedEnrollment)}
                                    </p>

                                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                                        <div className="rounded-md bg-slate-50 p-3">
                                            <p className="text-lg font-bold text-slate-950">{selectedModuleCount}</p>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Modules</p>
                                        </div>
                                        <div className="rounded-md bg-slate-50 p-3">
                                            <p className="text-lg font-bold text-slate-950">{selectedLessonCount}</p>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Lessons</p>
                                        </div>
                                        <div className="rounded-md bg-slate-50 p-3">
                                            <p className="text-lg font-bold text-slate-950">{formatDate(selectedEnrollment?.enroll_date)}</p>
                                            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Started</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h2 className="text-xl font-bold text-slate-950">Course Media Workspace</h2>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Reserved production space for videos, files, transcripts, and resources.
                                    </p>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-3">
                                <MediaSlot
                                    title="Video player space"
                                    description="Use this area later for lesson video playback, embeds, or streaming components."
                                />
                                <MediaSlot
                                    title="Downloadable material space"
                                    description="Use this area later for PDFs, worksheets, slide decks, and code files."
                                />
                                <MediaSlot
                                    title="Notes and transcript space"
                                    description="Use this area later for lesson transcripts, highlights, and student notes."
                                />
                            </div>
                        </section>

                        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                            <div className="mb-5">
                                <h2 className="text-xl font-bold text-slate-950">Structured Curriculum</h2>
                                <p className="mt-1 text-sm text-slate-500">
                                    Modules and lessons are shown in their instructor-defined order.
                                </p>
                            </div>

                            {modules.length === 0 ? (
                                <div className="rounded-md border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
                                    <h3 className="text-lg font-semibold text-slate-800">No modules published yet.</h3>
                                    <p className="mt-2 text-sm text-slate-500">
                                        Once the instructor adds modules and lessons, students will access them here.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {modules.map((module, moduleIndex) => {
                                        const lessons = module.lessons || [];

                                        return (
                                            <article key={module.id} className="rounded-md border border-slate-200">
                                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
                                                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                                        <div>
                                                            <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                                                                Module {module.order || moduleIndex + 1}
                                                            </p>
                                                            <h3 className="mt-1 text-lg font-bold text-slate-950">{module.title}</h3>
                                                            {module.description && (
                                                                <p className="mt-2 text-sm leading-relaxed text-slate-600">
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
                                                        <div className="px-5 py-5 text-sm text-slate-500">
                                                            Lessons for this module have not been added yet.
                                                        </div>
                                                    ) : (
                                                        lessons.map((lesson, lessonIndex) => (
                                                            <div key={lesson.id} className="px-5 py-4">
                                                                <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                                                                    <div>
                                                                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                                                            Lesson {lesson.order || lessonIndex + 1}
                                                                        </p>
                                                                        <h4 className="mt-1 font-semibold text-slate-900">{lesson.title}</h4>
                                                                    </div>
                                                                    <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-500">
                                                                        <span className="rounded-full bg-slate-100 px-3 py-1">
                                                                            Video slot
                                                                        </span>
                                                                        <span className="rounded-full bg-slate-100 px-3 py-1">
                                                                            PDF slot
                                                                        </span>
                                                                    </div>
                                                                </div>

                                                                <div className="mt-4 grid gap-3 md:grid-cols-2">
                                                                    <MediaSlot
                                                                        title="Lesson video space"
                                                                        description="Reserved for the video player or embed when production media is connected."
                                                                    />
                                                                    <MediaSlot
                                                                        title="Lesson file space"
                                                                        description="Reserved for PDFs, supporting files, and downloadable class resources."
                                                                    />
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
                    </main>
                </div>
            </div>
        </div>
    );
}

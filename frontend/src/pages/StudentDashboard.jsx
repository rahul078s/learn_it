import { useState, useEffect } from "react";
import api from '../api/axios';

export default function StudentDashboard() {
    const [myCourses, setmyCourses] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const response = await api.get('/courses/api/mycourses/');
                setmyCourses(response.data);
            } catch (err) {
                console.error('Failed to fetch courses', err);
                setError('Could not load courses. Are you sure you are logged in?');
            }
        };
        fetchCourses();
    }, []);

    return (
        <div>
            <h2>My Learnings</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {myCourses.map((enrollment) =>
                <div key={enrollment.id} style={{ border: '1px solid black', margin: '10px', padding: '20px', borderRadius: '8px' }}>
                    <h3>{ enrollment.course_title }</h3>
                    <p>{ enrollment.course_description }</p>
                    
                    <p style={{ color: 'gray', fontSize: '14px' }}>
                        Enrolled on: {new Date(enrollment.enroll_date).toLocaleDateString()}
                    </p>
                    
                    <button style={{ marginTop: '10px', padding: '8px 16px', backgroundColor: '#0056b3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                        Continue Learning
                    </button>
                </div>
            )}
        </div>
    );
}
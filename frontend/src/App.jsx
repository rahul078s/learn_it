import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import InstructorDashboard from './pages/InstructorDashboard';
import CourseCatalog from './pages/CourseCatalog';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CourseDetail from './pages/CourseDetail';
import Register from './pages/Register';
import Home from './pages/Home';
import InstructorRoute from './components/InstructorRoute';
import CourseManager from './pages/CourseManager';

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/courses" element={<CourseCatalog />} />
                <Route path="/courses/:id" element={<CourseDetail />} />

                {/* Private Routes */}
                <Route path='/my-learning' element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                } />

                <Route path="/instructor" element={<InstructorRoute><InstructorDashboard /></InstructorRoute>} />
                <Route path="/instructor/courses/:id" element={<InstructorRoute><CourseManager /></InstructorRoute>} />
            </Routes>
        </BrowserRouter>
    );
}

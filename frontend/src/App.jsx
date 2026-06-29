import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalog from './pages/CourseCatalog';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import CourseDetail from './pages/CourseDetail';

function Home() {
    return <h1>Welcome to the Learn It!</h1>;
}

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CourseCatalog />}/>
                <Route path="/courses/:id" element={<CourseDetail />}/>
                <Route path='/my-learning' element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
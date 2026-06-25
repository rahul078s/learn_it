import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import CourseCatalog from './pages/CourseCatalog';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';

function Home() {
    return <h1>Welcome to the Dashboard! You are logged in.</h1>;
}

export default function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<CourseCatalog />}/>
                <Route path='/my-learning' element={
                    <ProtectedRoute>
                        <StudentDashboard />
                    </ProtectedRoute>
                } />
            </Routes>
        </BrowserRouter>
    );
}
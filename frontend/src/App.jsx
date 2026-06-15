import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';

function Home() {
    return <h1>Welcome to the Dashboard! You are logged in.</h1>;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Home />} />
            </Routes>
        </BrowserRouter>
    );
}
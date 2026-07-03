import { useNavigate } from 'react-router-dom';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div style={{ fontFamily: 'sans-serif', color: '#1a1a1a' }}>
            
            {/* 1. HERO SECTION */}
            <div style={{ backgroundColor: '#f8fafc', padding: '80px 20px', textAlign: 'center', borderBottom: '1px solid #e0e0e0' }}>
                <h1 style={{ fontSize: '48px', margin: '0 0 20px 0', fontWeight: '900', color: '#0f172a' }}>
                    Master New Skills, <span style={{ color: '#2563eb' }}>Anywhere.</span>
                </h1>
                <p style={{ fontSize: '20px', color: '#475569', maxWidth: '600px', margin: '0 auto 40px auto', lineHeight: '1.6' }}>
                    Join thousands of students learning from expert instructors. 
                    Build your portfolio, advance your career, and achieve your goals.
                </p>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <button 
                        onClick={() => navigate('/courses')}
                        style={{ backgroundColor: '#2563eb', color: 'white', border: 'none', padding: '15px 30px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Explore Courses
                    </button>
                    <button 
                        onClick={() => navigate('/register')}
                        style={{ backgroundColor: 'white', color: '#2563eb', border: '2px solid #2563eb', padding: '15px 30px', fontSize: '18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                        Start for Free
                    </button>
                </div>
            </div>

            {/* 2. VALUE PROPOSITION SECTION */}
            <div style={{ maxWidth: '1200px', margin: '60px auto', padding: '0 20px' }}>
                <h2 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '40px' }}>Why LearnIT?</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' }}>
                    
                    {/* Feature 1 */}
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>🚀</div>
                        <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Fast-Track Your Career</h3>
                        <p style={{ color: '#555', lineHeight: '1.5' }}>Our courses are designed to get you hired. Learn practical, real-world skills that employers are actively looking for.</p>
                    </div>

                    {/* Feature 2 */}
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>👨‍🏫</div>
                        <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Expert Instructors</h3>
                        <p style={{ color: '#555', lineHeight: '1.5' }}>Learn directly from industry professionals who have spent years mastering their craft in the real world.</p>
                    </div>

                    {/* Feature 3 */}
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '40px', marginBottom: '15px' }}>♾️</div>
                        <h3 style={{ fontSize: '22px', marginBottom: '10px' }}>Lifetime Access</h3>
                        <p style={{ color: '#555', lineHeight: '1.5' }}>Enroll once and learn at your own pace. You get lifetime access to the course materials and all future updates.</p>
                    </div>

                </div>
            </div>
            
        </div>
    );
}
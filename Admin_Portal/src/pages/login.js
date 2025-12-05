import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const EMPLOYEE_LOGIN_URL = 'http://localhost:3000/login';

export default function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already logged in as admin/manager
    const token = localStorage.getItem('app_token');
    const userStr = localStorage.getItem('currentUser');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        if (user.role === 'admin' || user.role === 'manager') {
          navigate('/dashboard', { replace: true });
          return;
        }
      } catch (e) {}
    }
    
    // Not logged in - redirect to Employee Portal login
    window.location.href = EMPLOYEE_LOGIN_URL;
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white'
    }}>
      <p>Redirecting to login...</p>
    </div>
  );
}

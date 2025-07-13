import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../store/authSlice';

const Login = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Check if user exists
    const user = users.find(u => u.email === formData.email && u.password === formData.password);
    if (user) {
      dispatch(login(user));
      // Save to localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      setErrors({ general: 'Invalid email or password' });
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#333' }}>Login</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {errors.general && (
          <div style={{ color: '#e74c3c', padding: '10px', backgroundColor: '#fdf2f2', borderRadius: '5px' }}>
            {errors.general}
          </div>
        )}
        
        <div>
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.email ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.email && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.email}</div>}
        </div>

        <div>
          <input
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            style={{
              width: '100%',
              padding: '12px',
              border: errors.password ? '2px solid #e74c3c' : '2px solid #e1e5e9',
              borderRadius: '8px',
              fontSize: '16px'
            }}
          />
          {errors.password && <div style={{ color: '#e74c3c', fontSize: '14px', marginTop: '5px' }}>{errors.password}</div>}
        </div>

        <button
          type="submit"
          style={{
            padding: '12px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#2980b9'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#3498db'}
        >
          Login
        </button>
      </form>
      
      <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
        Don't have an account?{' '}
        <span
          onClick={onSwitchToRegister}
          style={{ color: '#3498db', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Register here
        </span>
      </p>
    </div>
  );
};

export default Login;
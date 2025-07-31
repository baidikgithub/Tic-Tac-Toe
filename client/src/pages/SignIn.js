import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignIn = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signin, user, error, clearError } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/game');
    }
  }, [user, navigate]);

  // Clear auth errors when component mounts
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, []); // Run only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await signin(formData);
    
    if (result.success) {
      navigate('/game');
    }
    setIsSubmitting(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>🎮</h1>
        <h2>Tic-Tac-Toe</h2>
        <p>Sign in to your account</p>
      </div>

      <div className="auth-form">
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="error-message">{errors.email}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Auth Error */}
          {error && (
            <div className="auth-error">
              <p>{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <div className="form-group">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary"
              style={{width: '100%'}}
            >
              {isSubmitting ? (
                <div className="flex-center gap-4">
                  <div className="spinner spinner-sm"></div>
                  Signing in...
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          {/* Sign up link */}
          <div className="auth-link">
            <p>
              Don't have an account?{' '}
              <Link to="/signup">Sign up</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn; 
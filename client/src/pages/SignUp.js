import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signup, user, error, clearError } = useAuth();
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

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    } else if (formData.username.length > 20) {
      newErrors.username = 'Username must not exceed 20 characters';
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    const result = await signup({
      username: formData.username,
      email: formData.email,
      password: formData.password
    });
    
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
        <p>Create your account</p>
      </div>

      <div className="auth-form">
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              value={formData.username}
              onChange={handleChange}
              className={errors.username ? 'error' : ''}
              placeholder="Choose a username"
            />
            {errors.username && (
              <p className="error-message">{errors.username}</p>
            )}
          </div>

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
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password"
            />
            {errors.password && (
              <p className="error-message">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <p className="error-message">{errors.confirmPassword}</p>
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
                  Creating account...
                </div>
              ) : (
                'Sign up'
              )}
            </button>
          </div>

          {/* Sign in link */}
          <div className="auth-link">
            <p>
              Already have an account?{' '}
              <Link to="/signin">Sign in</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp; 
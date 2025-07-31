import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  loading: true,
  error: null,
};

// Action types
const AuthActions = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_ERROR: 'SET_ERROR',
  LOGOUT: 'LOGOUT',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActions.SET_LOADING:
      return { ...state, loading: action.payload };
    case AuthActions.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        loading: false,
        error: null,
      };
    case AuthActions.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case AuthActions.LOGOUT:
      return { ...state, user: null, token: null, loading: false, error: null };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start if token exists
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const response = await authAPI.getMe();
          dispatch({
            type: AuthActions.SET_USER,
            payload: { user: response.data, token },
          });
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch({ type: AuthActions.LOGOUT });
        }
      } else {
        dispatch({ type: AuthActions.SET_LOADING, payload: false });
      }
    };

    loadUser();
  }, []); // Empty dependency array to run only once

  // Sign in function
  const signin = async (credentials) => {
    try {
      dispatch({ type: AuthActions.SET_LOADING, payload: true });
      const response = await authAPI.signin(credentials);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AuthActions.SET_USER,
        payload: { user, token },
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Sign in failed';
      dispatch({ type: AuthActions.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Sign up function
  const signup = async (userData) => {
    try {
      dispatch({ type: AuthActions.SET_LOADING, payload: true });
      const response = await authAPI.signup(userData);
      const { token, user } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      dispatch({
        type: AuthActions.SET_USER,
        payload: { user, token },
      });

      return { success: true, data: response.data };
    } catch (error) {
      const message = error.response?.data?.message || 'Sign up failed';
      dispatch({ type: AuthActions.SET_ERROR, payload: message });
      return { success: false, error: message };
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: AuthActions.LOGOUT });
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AuthActions.SET_ERROR, payload: null });
  };

  const value = {
    ...state,
    signin,
    signup,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 
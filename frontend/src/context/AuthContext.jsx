// frontend/src/context/AuthContext.jsx

import React, { createContext, useEffect, useReducer } from 'react';

const initialState = {
    user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
};

export const AuthContext = createContext(initialState);

const authReducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN_START':
            return {
                user: null,
                token: null,
                role: null,
            };
        case 'LOGIN_SUCCESS':
            return {
                user: action.payload.user,
                token: action.payload.token,
                role: action.payload.role,
            };
        case 'UPDATE_USER':
            // --- START DEBUGGING LOGS ---
            console.log('AuthContext: UPDATE_USER action dispatched with payload:', action.payload);
            // --- END DEBUGGING LOGS ---
            return {
                ...state,
                user: action.payload,
            };
        case 'LOGOUT':
            return {
                user: null,
                token: null,
                role: null,
            };
        default:
            return state;
    }
};

export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Save state to local storage whenever it changes
    useEffect(() => {
        localStorage.setItem('user', JSON.stringify(state.user));
        localStorage.setItem('token', state.token);
        localStorage.setItem('role', state.role);
    }, [state]);

    return (
        <AuthContext.Provider value={{
            user: state.user,
            token: state.token,
            role: state.role,
            dispatch
        }}>
            {children}
        </AuthContext.Provider>
    );
};

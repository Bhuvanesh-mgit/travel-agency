import React, { createContext, useContext, useState, useEffect } from 'react';

export const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const getStoredToken = () => {
    const t = localStorage.getItem('travel_token') || localStorage.getItem('token');
    return t && t !== 'undefined' && t !== 'null' ? t : null;
  };

  const getStoredUser = () => {
    try {
      const u = localStorage.getItem('travel_user') || localStorage.getItem('userInfo');
      if (u && u !== 'undefined' && u !== 'null') {
        return JSON.parse(u);
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
    }
    return null;
  };

  const [user, setUser] = useState(() => getStoredUser());
  const [token, setToken] = useState(() => getStoredToken());
  const [loading, setLoading] = useState(true);

  const [isGlobalLoading, setIsGlobalLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Authenticating...');

  const showLoader = (msg = 'Authenticating...') => {
    setLoadingMessage(msg);
    setIsGlobalLoading(true);
  };

  const hideLoader = () => {
    setIsGlobalLoading(false);
  };

 useEffect(() => {
    const checkAuthStatus = async () => {
      const savedUser = getStoredUser();
      const savedToken = getStoredToken();

      if (savedUser && savedToken) {
        try {
          // 1. Immediately establish state from LocalStorage so UI does not flicker
          setUser(savedUser);
          setToken(savedToken);

          // 2. Special case: If user is the hardcoded ENV Admin with an offline/static token, do not fail on 401
          const isEnvAdmin = savedUser.id === 'admin_env_id' || savedUser._id === 'admin_env_id';

          // 🔑 FIX: Properly evaluate base URL
          const activeBaseUrl = backendUrl || API_URL || 'http://localhost:5000';

          const response = await fetch(`${activeBaseUrl}/api/auth/profile`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${savedToken}`,
            },
          });

          const contentType = response.headers.get('content-type');

          if (response.ok && contentType && contentType.includes('application/json')) {
            const data = await response.json();
            if (data.success) {
              setUser(data.user);
              setToken(savedToken);
              syncStorage(data.user, savedToken); // This will now properly update local storage with the full user object including the avatar!
            }
          } else if ((response.status === 401 || response.status === 403) && !isEnvAdmin) {
            // ONLY perform automatic logout if NOT an ENV admin with special token fallback
            console.warn('🔑 Session rejected by server (401/403). Clearing session...');
            logout();
          } else {
            console.warn(`Profile check returned status ${response.status}. Retaining local session.`);
          }
        } catch (err) {
          console.error('Network error verifying token. Retaining local session:', err);
        }
      } else {
        setUser(null);
        setToken(null);
      }

      setLoading(false);
    };

    checkAuthStatus();
  }, []);

  const syncStorage = (userData, userToken) => {
    if (!userToken || userToken === 'null' || userToken === 'undefined') return;
    const userString = typeof userData === 'string' ? userData : JSON.stringify(userData);
    localStorage.setItem('travel_user', userString);
    localStorage.setItem('userInfo', userString);
    localStorage.setItem('travel_token', userToken);
    localStorage.setItem('token', userToken);
  };

 const login = async (userData, userToken) => {
    if (!userToken) {
      console.error('Login attempted without a valid token!');
      return;
    }

    setToken(userToken);
    localStorage.setItem('token', userToken);

    try {
      // 🔑 Instantly fetch complete profile data (including phone, gender, avatar) on login
      const response = await fetch(`${backendUrl || API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });
      const data = await response.json();

      const finalUser = data.success ? data.user : userData;

      setUser(finalUser);
      localStorage.setItem('user', JSON.stringify(finalUser));
      
      if (typeof syncStorage === 'function') {
        syncStorage(finalUser, userToken);
      }
    } catch (err) {
      console.error('Error fetching full profile on login:', err);
      // Fallback to basic userData if fetch fails
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      if (typeof syncStorage === 'function') {
        syncStorage(userData, userToken);
      }
    }
  };

  const logout = () => {
    console.trace('🚨 LOGOUT CALLED:');
    setUser(null);
    setToken(null);
    // localStorage.removeItem('user');
    localStorage.removeItem('travel_user');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('travel_token');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
        backendUrl,
        API_URL: backendUrl,
        isAuthenticated: !!user,
        isGlobalLoading,
        loadingMessage,
        showLoader,
        hideLoader,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
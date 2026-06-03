const TOKEN_KEY = 'skilllink_token';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const getDashboardPath = (role) => {
  if (role === 'mentor') return '/mentor/dashboard';
  return '/learner/dashboard';
};

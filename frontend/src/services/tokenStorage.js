export const getToken = () => {
    return sessionStorage.getItem('token') || localStorage.getItem('token') || null;
};

export const setToken = (token, rememberMe) => {
    if (rememberMe) {
        localStorage.setItem('token', token);
        sessionStorage.removeItem('token');
    } else {
        sessionStorage.setItem('token', token);
        localStorage.removeItem('token');
    }
};

export const clearToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};

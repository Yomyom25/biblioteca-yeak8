// src/utils/authUtils.js
export const getUserRole = () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        return userData?.rol || null;
    } catch (e) {
        return null;
    }
};
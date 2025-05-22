//Functions to control the login status of the user
// and to get the username from the token

//Libraries
import { jwtDecode } from "jwt-decode";

function getUsername() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        const decoded = jwtDecode(token);
        return decoded.username;
    } catch (error) {
        console.error("Token non valido:", error);
        return null;
    }
}

function isLoggedIn() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  try {
    const { exp } = jwtDecode(token);
    const now = Math.floor(Date.now() / 1000);
    const isValid = exp && exp > now;
    return isValid;
  } catch (error) {
    console.error("Invalid token:", error);
    return false;
  }
}

function handleLogout() {
    localStorage.removeItem('token');
    window.location.href = '/';
}

export { getUsername, isLoggedIn, handleLogout };
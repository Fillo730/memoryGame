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

export default getUsername;
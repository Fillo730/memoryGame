// Libraries
import { jwtDecode } from "jwt-decode";

// CSS Files
import "./ProfileButton.css";

function ProfileButton() {
    
    function handleClick() {
        if (!username) {
            window.location.href = '/login';
        } else {
            window.location.href = '/profile';
        }
    }

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

    const username = getUsername();

    return (
        <div className='profile-button-container' onClick={handleClick}>
            <button class="btn">
                 {username ? "Hello " + username.toUpperCase() : "You are not logged in"}
            </button>
        </div>
    );
}

export default ProfileButton;

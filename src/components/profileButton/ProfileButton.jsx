//Functions
import getUsername from "../../utils/getUsername";

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

    const username = getUsername();

    return (
        <div className='profile-button-container' onClick={handleClick}>
            <button className="btn">
                 {username ? "Hello " + username.toUpperCase() : "You are not logged in"}
            </button>
        </div>
    );
}

export default ProfileButton;
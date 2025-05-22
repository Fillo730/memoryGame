//Functions
import { useEffect, useState } from "react";
import getUsername from "../../utils/getUsername";

// CSS Files
import "./ProfileButton.css";

function ProfileButton() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        if(window.location.pathname === "/profile") {
            setIsVisible(false);
        }
        else {
            setIsVisible(true);
        }
    }, []);

    function handleClick() {
        if (!username) {
            window.location.href = '/login';
        } else {
            window.location.href = '/profile';
        }
    }

    const username = getUsername();

    return (
        <>
            {isVisible && (
                <div className='profile-button-container' onClick={handleClick}>
                <button className="btn">
                    {username ? "Hello " + username.toUpperCase() : "You are not logged in"}
                </button>
                </div>
            )}
        </>
    );
}

export default ProfileButton;
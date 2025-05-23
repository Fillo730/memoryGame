//Libraries
import { useEffect, useState } from "react";

//Utils
import { isLoggedIn as checkIsLoggedIn, getUsername } from "../../utils/loginFunctions";

//CSSFiles
import "./ProfileButton.css";

function ProfileButton() {
  const [isVisible, setIsVisible] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    setIsVisible(window.location.pathname !== "/profile");
    setLoggedIn(checkIsLoggedIn());
  }, []);

  function handleClick() {
    if (!loggedIn) {
      window.location.href = "/login";
    } else {
      window.location.href = "/profile";
    }
  }

  return (
    <>
      {isVisible && (
        <div className="profile-button-container" onClick={handleClick}>
          <button className="btn">
            {loggedIn ? "Hello " + getUsername().toUpperCase() : "You are not logged in"}
          </button>
        </div>
      )}
    </>
  );
}

export default ProfileButton;
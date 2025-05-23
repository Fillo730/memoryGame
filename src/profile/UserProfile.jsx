// Libraries
import { useEffect, useState } from "react";

// Components
import { Modal, CustomButton, ProfileDifficultyCard } from "../components/ComponentsDependencies";

// Utils
import { getUsername, handleLogout } from "../utils/loginFunctions";
import { checkUsername, checkName } from "../utils/checkPasswordUsername";
import difficulties from "../utils/difficulties";

// Constants
import BACKEND_URL from "../utils/backendEndpoint";

function UserProfile() {
  const username = getUsername();
  const [userInformation, setUserInformation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    firstName: "",
    lastName: ""
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await fetch(`${BACKEND_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch stats");
        }
        const data = await response.json();
        setUserInformation(data);
        setFormData({
          username: data.username,
          firstName: data.firstName,
          lastName: data.lastName,
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  function handleEditProfile() {
    setFormData({
      username: userInformation.username,
      firstName: userInformation.firstName,
      lastName: userInformation.lastName,
    });
    setIsModalOpen(true);
  }

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleCloseModal() {
    setIsModalOpen(false);
    setError(null);
  }

  async function handleSaveProfile() {
    const usernameCheck = checkUsername(formData.username);
    if (!usernameCheck.valid) {
      setError(usernameCheck.message);
      return;
    }

    const nameCheck = checkName(formData.firstName, formData.lastName);
    if (!nameCheck.valid) {
      setError(nameCheck.message);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${BACKEND_URL}/update-profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update profile");
      }
      const updatedUser = await response.json();
      setUserInformation(updatedUser);
      setIsModalOpen(false);
      setError(null);
      localStorage.setItem("token", updatedUser.token);
      window.location.reload();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="display-vertical">
      <div className="display-center-vertical-nogap">
        <h1 className="title light-color">Hello {username.toUpperCase()}</h1>
        <div className="normal-max-width">
          <p className="text custom-max-width">
            This is your profile page. Here you can see all the information about your profile and all the games you have played, with 
            relative difficulty level.
          </p>
        </div>
      </div>

      {userInformation ? (
        <div className="normal-max-width display-vertical">
          <p className="text custom-max-width">
            <label className="big-text light-color">Username: </label> {userInformation.username}<br />
            <label className="big-text light-color">Firstname: </label> {userInformation.firstName}<br />
            <label className="big-text light-color">Lastname: </label> {userInformation.lastName}<br />
            <CustomButton text={"Edit Profile"} handleClick={handleEditProfile} />
          </p>

          <h1 className="medium-title light-color">Games Played</h1>
          <div className="difficulty-container">
            {difficulties.map((difficulty, index) => {
              const stats = userInformation.gamesCompleted[difficulty.name];
              return (
                <ProfileDifficultyCard
                  key={index}
                  frontTitle={difficulty.name}
                  frontText={`Games Played: ${stats.completed}`}
                  backTitle="More Info"
                  backText={`Average attempts: ${
                    stats.completed === 0
                      ? 0
                      : (stats.totalAttempts / stats.completed).toFixed(2)
                  }<br/>Best score: ${stats.bestScore || 0}`}
                />
              );
            })}
          </div>

          <CustomButton text={"Logout"} handleClick={handleLogout} />

          {/* Modal */}
          <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
            <h2 className="medium-title light-color">Edit Profile</h2>
            <p className="text custom-max-width margin-bottom">
              Here you can edit your profile. Please note that the username must be unique and cannot be changed to an already existing one.
            </p>

            <div className="form-modal margin-bottom">
              <label className="big-text light-color label-width">Username:</label>
              <input
                type="text"
                name="username"
                className="input-field"
                value={formData.username}
                onChange={handleInputChange}
              /><br />
            </div>

            <div className="form-modal margin-bottom">
              <label className="big-text light-color label-width">First Name:</label>
              <input
                type="text"
                name="firstName"
                className="input-field"
                value={formData.firstName}
                onChange={handleInputChange}
              /><br />
            </div>

            <div className="form-modal margin-bottom">
              <label className="big-text light-color label-width">Last Name:</label>
              <input
                type="text"
                name="lastName"
                className="input-field"
                value={formData.lastName}
                onChange={handleInputChange}
              /><br />
            </div>

            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className="display-horizontal margin-top">
              <CustomButton text="Save" handleClick={handleSaveProfile} />
              <CustomButton text="Cancel" handleClick={handleCloseModal} />
            </div>
          </Modal>
        </div>
      ) : (
        <div className="normal-max-width">Loading</div>
      )}
    </div>
  );
}

export default UserProfile;
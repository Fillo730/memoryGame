//Components
import { ProfileDifficultyCard } from "../components/ComponentsDependencies";

// Utils
import getUsername from "../utils/getUsername";
import difficulties from "../utils/difficulties";
import { useEffect, useState } from "react";

//Constants
import BACKEND_URL from "../utils/backendEndpoint";

function UserProfile() {
  const username = getUsername();
  const [userInformation, setUserInformation] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${BACKEND_URL}/stats`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        setUserInformation(data);
        console.log(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="display-vertical">
      <h1 className="title light-color">Hello {username.toUpperCase()}</h1>
      <div className="normal-max-width">
        <p className="text custom-max-width">
          This is your profile page. Here you can see all the information about your profile and all the games you have played, with 
          relative difficulty level.
        </p>
      </div>

      {userInformation ? (
        <div className="normal-max-width display-vertical">
          <p className="text custom-max-width">
            <label className="big-text light-color">Username: </label> {userInformation.username}<br/>
            <label className="big-text light-color">Firstname: </label> {userInformation.firstName}<br/>
            <label className="big-text light-color">Lastname: </label> {userInformation.lastName}<br/>
          </p>
          <h1 className="medium-title light-color">Games Played</h1>
          <div className="difficulty-container">
            {difficulties.map((difficulty, index) => (
              <ProfileDifficultyCard 
                key={index} 
                frontTitle={difficulty.name} 
                frontText={`Games Played: ${userInformation.gamesPlayed[difficulty.name]}`} 
                backTitle="More Info" 
                backText={`Average Time: 2 seconds`}
              />  
            ))}
            </div>
        </div>
      ) : (
        <div className="normal-max-width">
          Loading
        </div>
      )}
      
      
    </div>
  );
}

export default UserProfile;
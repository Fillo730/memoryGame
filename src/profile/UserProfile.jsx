// Utils
import getUsername from "../utils/getUsername";
import { useEffect, useState } from "react";

function UserProfile() {
  const username = getUsername();
  const [gamesPlayed, setGamesPlayed] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:3001/api/stats', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch stats');
        }
        const data = await response.json();
        console.log(data);
        setGamesPlayed(data.gamesPlayed);
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="display-vertical">
      <h1 className="title light-color">Hello {username.toUpperCase()}</h1>
      <div className="display-horizontal normal-max-width">
        <p className="text custom-max-width">
          This is your profile page. Here you can see all your statistics. You can also see how many games you have played and your best scores.
        </p>
      </div>

      {gamesPlayed ? (
        <div className="stats">
          <h2>Games Played:</h2>
          <ul>
            {Object.entries(gamesPlayed).map(([level, count]) => (
              <li key={level}>
                {level}: {count} games
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading stats...</p>
      )}
    </div>
  );
}

export default UserProfile;
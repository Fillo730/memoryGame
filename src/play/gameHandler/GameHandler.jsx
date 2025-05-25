//Libraries
import { useState } from 'react'

//utils
import { isLoggedIn } from '../../utils/loginFunctions';


//Components
import { DifficultyCard } from '../../components/ComponentsDependencies';
import MemoryGame from '../memoryGame/MemoryGame';

//Constants
import { difficulties } from '../../utils/difficulties';

function GameHandler() {
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);
  const [loggedIn] = useState(isLoggedIn());
  const [difficulty, setDifficulty] = useState(null);

  function handleClick(selectedDifficulty) {
    setIsDifficultySelected(true);
    setDifficulty(selectedDifficulty);
  }

  function handleGoBack() {
    setIsDifficultySelected(false);
    setDifficulty(null);
  }

  function handleNextDifficulty(level) {
    setIsDifficultySelected(true);
    const nextDifficulty = difficulties.find(d => d.level === level);
    setDifficulty(nextDifficulty);
  }

  return (
    <>
      {!isDifficultySelected ? (
        <>
          <h1 className="light-color title">Select the difficulty you want to play</h1>
          <p className="text">
              The more cards are present, the more difficult the game will be.<br/>
              So choose wisely!<br/>
              {!loggedIn && 
                <label className='warning-color'>
                  <span>Note: </span>
                  You are not logged in, so your progress will not be saved.
                </label> 
              }
          </p>
          <div className="difficulty-container">
            {difficulties.map((difficulty, index) => (
              <DifficultyCard 
                key={index} 
                difficulty={difficulty}   
                handleClick={handleClick}
              />  
            ))}
          </div>
        </>
      ) : (
        <>
          {difficulty && (
            <>
              <h1 className="light-color title">
                You selected the following difficulty: {difficulty.name}
              </h1>
              <p className="text">
                Match the cards and try to remember their positions!<br/>
              </p>
              <MemoryGame difficulty={difficulty} handleGoBack={handleGoBack} handleNextDifficulty={handleNextDifficulty}/>
            </>
          )}
        </>
      )}
    </>
  )
}

export default GameHandler;
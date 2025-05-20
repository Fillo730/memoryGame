//Libraries
import { useState } from 'react'

//Components
import { DifficultyCard } from '../../components/ComponentsDependencies';
import MemoryGame from '../memoryGame/MemoryGame';

//Objects
import difficulties from '../../utils/difficulties';

//CSSFiles
import './GameHandler.css'

function GameHandler() {
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);
  const [difficulty, setDifficulty] = useState(null);

  function handleClick(selectedDifficulty) {
    setIsDifficultySelected(true);
    setDifficulty(selectedDifficulty);
  }

  function handleGoBack() {
    setIsDifficultySelected(false);
    setDifficulty(null);
  }

  return (
    <>
      {!isDifficultySelected ? (
        <>
          <h1 className="light-color title">Select the difficulty you want to play</h1>
          <p className="text">
              The more cards are present, the more difficult the game will be.<br/>
              So choose wisely!<br/>
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
              <MemoryGame cards={difficulty.cards} level={difficulty.level} handleGoBack={handleGoBack}/>
            </>
          )}
        </>
      )}
    </>
  )
}

export default GameHandler;
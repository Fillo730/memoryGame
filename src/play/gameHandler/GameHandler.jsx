import React, { useState } from 'react'
import { DifficultyCard } from '../../components/ComponentsDependencies';
import MemoryGame from '../memoryGame/MemoryGame';
import './GameHandler.css'

function GameHandler() {
  const [isDifficultySelected, setIsDifficultySelected] = useState(false);
  const [difficulty, setDifficulty] = useState('');
  const [cards, setCards] = useState(0);

  function handleClick(cards, difficulty) {
    setIsDifficultySelected(prevValue => !prevValue);
    setCards(cards);
    setDifficulty(difficulty);
  }

  function handleGoBack() {
    setIsDifficultySelected(false);
    setCards(0);
    setDifficulty('');
  }


  return (
    <>
        {!isDifficultySelected &&
          <>
            <h1 class="light-color title">Select the difficulty you want to play</h1>
            <p class="text">
                The more cards are present, the more difficult the game will be.<br/>
                So choose wisely!<br/>
            </p>
            <div className="difficulty-container">
              <DifficultyCard difficulty="Easy" text="8 cards" cards={8} handleClick={handleClick}/>
              <DifficultyCard difficulty="Medium" text="12 cards" cards={12} handleClick={handleClick}/>
              <DifficultyCard difficulty="Hard" text="16 cards" cards={16} handleClick={handleClick}/>
              <DifficultyCard difficulty="Extreme" text="20 cards" cards={20} handleClick={handleClick}/>
              <DifficultyCard difficulty="Impossible" text="24 cards" cards={24} handleClick={handleClick}/>
              <DifficultyCard difficulty="Legendary" text="30 cards" cards={30} handleClick={handleClick}/>
              <DifficultyCard difficulty="Mythical" text="36 cards" cards={36} handleClick={handleClick}/>
              <DifficultyCard difficulty="Divine" text="42 cards" cards={42} handleClick={handleClick}/>
              <DifficultyCard difficulty="Godlike" text="50 cards" cards={48} handleClick={handleClick}/>
            </div>
          </>
        }
        {isDifficultySelected && 
          <>
            <h1 class="light-color title">You selected the following difficulty: {difficulty}</h1>
            <p class="text">
                Match the cards and try to remember their positions!<br/>
            </p>
            <MemoryGame cards={cards} handleGoBack={handleGoBack}/>
          </>
        }
    </>
  )
}

export default GameHandler;
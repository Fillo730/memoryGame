//CSSFiles
import './DifficultyCard.css';

function DifficultyCard({difficulty, handleClick}) {
  return (
    <div className="card" onClick={() => handleClick(difficulty)}>
        <div className="first-content">
            <span>{difficulty.name}</span>
        </div>
        <div className="second-content">
            <span>{difficulty.text}</span>
        </div>
    </div>
  )
}

export default DifficultyCard;
//CSSFiles
import './DifficultyCard.css';

function DifficultyCard({difficulty, text, cards, handleClick}) {
  return (
    <div className="card" onClick={() => handleClick(cards, difficulty)}>
        <div className="first-content">
            <span>{difficulty}</span>
        </div>
        <div className="second-content">
            <span>{text}</span>
        </div>
    </div>
  )
}

export default DifficultyCard;
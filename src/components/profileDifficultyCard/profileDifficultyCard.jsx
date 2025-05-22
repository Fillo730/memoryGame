//CSSFiles
import './profileDifficultyCard.css';

function profileDifficultyCard({ frontTitle, frontText, backTitle, backText }) {
  return (
    <div>
      <div className="flip-card">
        <div className="flip-card-inner">
            <div className="flip-card-front">
                <p className="title-card">{frontTitle}</p>
                <p>{frontText}</p>
            </div>
            <div className="flip-card-back">
                <p className="title-card">{backTitle}</p>
                <p>{backText}</p>
            </div>
         </div>
        </div>
    </div>
  )
}

export default profileDifficultyCard;
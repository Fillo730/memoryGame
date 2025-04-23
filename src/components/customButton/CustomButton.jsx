//CSSFiles
import './CustomButton.css';

function CustomButton({text, handleClick}) {
  return (
    <button className="customButton" onClick={handleClick}>{text}</button>
  )
}

export default CustomButton;
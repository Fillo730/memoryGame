//CSSFiles
import './CustomButton.css';

function CustomButton({text, handleClick, disabled = false}) {
  return (
    <button className="customButton" onClick={handleClick} disabled={disabled}>{text}</button>
  )
}

export default CustomButton;